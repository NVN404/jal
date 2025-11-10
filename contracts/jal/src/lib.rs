use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, MintTo, Token, TokenAccount};

declare_id!("Fg6PaFpoVXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod jal_program {
    use super::*;

    // === ONLY ADMIN CAN RECORD ===
    pub fn record_reading(
        ctx: Context<RecordReading>,
        meter_id: String,
        reading: u64,
        meter_type: MeterType,
    ) -> Result<()> {
        let reading_acc = &mut ctx.accounts.reading;
        let clock = Clock::get()?;
        let config = &ctx.accounts.config;

        // === VALIDATE ===
        require!(meter_id.len() <= 50, CustomError::InvalidMeterId);
        require!(reading > 0, CustomError::InvalidReading);

        // === ONLY ADMIN CAN CALL THIS FUNCTION ===
        require!(
            ctx.accounts.admin.key() == config.admin,
            CustomError::Unauthorized
        );

        // === STORE ===
        reading_acc.meter_id = meter_id.clone();
        reading_acc.reading = reading;
        reading_acc.timestamp = clock.unix_timestamp;
        reading_acc.meter_type = meter_type;
        reading_acc.authority = ctx.accounts.admin.key();

        // === AUTO MINT LOGIC ===
        if let Some(prev) = &ctx.accounts.previous_reading {
            if prev.meter_id == meter_id && reading > prev.reading {
                let saved = reading - prev.reading;

                let mint_amount = match meter_type {
                    MeterType::Residential => {
                        let threshold = config.residential_threshold;
                        if saved >= threshold {
                            Some(saved * config.jal_per_liter)
                        } else {
                            None
                        }
                    }
                    MeterType::Municipal => {
                        let effective = (saved as u128) * config.municipal_multiplier as u128 / 100;
                        Some(effective as u64 * config.jal_per_liter)
                    }
                    MeterType::Industrial => {
                        None // No mint
                    }
                };

                if let Some(amount) = mint_amount {
                    if amount > 0 {
                        mint_jal(&ctx, amount)?;
                    }
                }
            }
        }

        Ok(())
    }

    // === ADMIN UPDATES CONFIG ===
    pub fn update_config(
        ctx: Context<UpdateConfig>,
        residential_threshold: u64,
        municipal_multiplier: u8,
        jal_per_liter: u64,
    ) -> Result<()> {
        let config = &mut ctx.accounts.config;
        require!(ctx.accounts.admin.key() == config.admin, CustomError::Unauthorized);

        config.residential_threshold = residential_threshold;
        config.municipal_multiplier = municipal_multiplier;
        config.jal_per_liter = jal_per_liter;
        config.admin = ctx.accounts.admin.key();

        Ok(())
    }
}

// === MINT HELPER ===
fn mint_jal(ctx: &Context<RecordReading>, amount: u64) -> Result<()> {
    let seeds = &[b"mint_auth".as_ref(), &[ctx.bumps.mint_auth]];
    let signer = &[&seeds];

    token::mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.user_token.to_account_info(),
                authority: ctx.accounts.mint_auth.to_account_info(),
            },
            signer,
        ),
        amount,
    )?;
    Ok(())
}

// === ACCOUNTS ===
#[derive(Accounts)]
#[instruction(meter_id: String)]
pub struct RecordReading<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + 4 + 50 + 8 + 8 + 1 + 32 + 8,
    )]
    pub reading: Account<'info, WaterReading>,

    #[account(seeds = [b"config"], bump)]
    pub config: Account<'info, MintConfig>,

    #[account(seeds = [b"mint_auth"], bump)]
    pub mint_auth: Signer<'info>,

    #[account(mut)]
    pub mint: Account<'info, Mint>,

    #[account(mut)]
    pub user_token: Account<'info, TokenAccount>,

    #[account(
        constraint = previous_reading.is_none() || 
        previous_reading.as_ref().unwrap().meter_id == meter_id
    )]
    pub previous_reading: Option<Account<'info, WaterReading>>,

    #[account(mut)]
    pub admin: Signer<'info>,  // ← ONLY ADMIN

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateConfig<'info> {
    #[account(mut, seeds = [b"config"], bump)]
    pub config: Account<'info, MintConfig>,

    #[account(mut)]
    pub admin: Signer<'info>,
}

#[account]
pub struct WaterReading {
    pub meter_id: String,
    pub reading: u64,
    pub timestamp: i64,
    pub meter_type: MeterType,
    pub authority: Pubkey,
}

#[account]
pub struct MintConfig {
    pub residential_threshold: u64,
    pub municipal_multiplier: u8,
    pub jal_per_liter: u64,
    pub admin: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq)]
pub enum MeterType { Residential, Industrial, Municipal }

#[error_code]
pub enum CustomError {
    #[msg("Invalid meter ID")]
    InvalidMeterId,
    #[msg("Reading must be > 0")]
    InvalidReading,
    #[msg("Only admin can call this")]
    Unauthorized,
}