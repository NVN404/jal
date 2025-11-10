use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer, CpiContext};


declare_id!("JhGTuxgHaPa2gG2tTf21xod42E2EppG6t8sWX11s1is");

// NOTE: This needs to be calculated based on your desired APY and tokenomics
// (e.g., 10% APY as a per-second rate)
const APY_RATE_PER_SECOND: u64 = 1; 
#[program]
pub mod jal_staking {
    use super::*;

    // --- 1. AUTHORITY FUNCTION: Initialize the whole staking pool ---
    pub fn initialize_pool(ctx: Context<InitializePool>) -> Result<()> {
        msg!("Staking pool initialized");
        Ok(())
    }
    
    // --- 2. USER FUNCTION: User stakes $JAL tokens ---
    pub fn stake(ctx: Context<Stake>, amount: u64) -> Result<()> {
        require!(amount > 0, StakingError::StakeAmountZero);

        let user_stake_info = &mut ctx.accounts.user_stake_info;
        
        // --- Security: Claim any pending rewards before changing stake amount ---
        let rewards = user_stake_info.calculate_rewards(APY_RATE_PER_SECOND)?;
        if rewards > 0 {
             msg!("Claiming {} pending rewards before staking", rewards);
             token::transfer(
                 ctx.accounts.into_transfer_rewards_to_user_context(),
                 rewards,
             )?;
        }
        
        // --- Now, stake the new amount ---
        msg!("Staking {} tokens", amount);
        // Transfer $JAL from user's wallet TO the stake_vault
        token::transfer(
            ctx.accounts.into_transfer_to_stake_vault_context(),
            amount,
        )?;
        
        // Update user's staking info
        user_stake_info.amount_staked = user_stake_info.amount_staked
            .checked_add(amount)
            .ok_or(StakingError::Overflow)?;
        user_stake_info.last_claim_timestamp = Clock::get()?.unix_timestamp;

        Ok(())
    }

    // --- 3. USER FUNCTION: User unstakes $JAL tokens ---
    pub fn unstake(ctx: Context<Unstake>, amount: u64) -> Result<()> {
        require!(amount > 0, StakingError::UnstakeAmountZero);

        let user_stake_info = &mut ctx.accounts.user_stake_info;
        require!(user_stake_info.amount_staked >= amount, StakingError::InsufficientStake);

        // --- Claim any pending rewards before unstaking ---
        let rewards = user_stake_info.calculate_rewards(APY_RATE_PER_SECOND)?;
        if rewards > 0 {
             msg!("Claiming {} pending rewards before unstaking", rewards);
             token::transfer(
                 ctx.accounts.into_transfer_rewards_to_user_context(),
                 rewards,
             )?;
        }
        
        // --- Now, unstake the amount ---
        msg!("Unstaking {} tokens", amount);
        
        let bump = ctx.bumps.stake_vault;
        let seeds = &[b"stake_vault".as_ref(), &[bump]];
        let signer_seeds = &[&seeds[..]];

        // Transfer $JAL from stake_vault back TO the user's wallet
        token::transfer(
            ctx.accounts.into_transfer_from_stake_vault_context().with_signer(signer_seeds),
            amount,
        )?;

        // Update user's staking info
        user_stake_info.amount_staked = user_stake_info.amount_staked
            .checked_sub(amount)
            .ok_or(StakingError::Overflow)?;
        user_stake_info.last_claim_timestamp = Clock::get()?.unix_timestamp;

        Ok(())
    }

    // --- 4. AUTHORITY FUNCTION: Add more rewards to the pool ---
    pub fn fund_reward_pool(ctx: Context<FundRewardPool>, amount: u64) -> Result<()> {
        require!(amount > 0, StakingError::FundAmountZero);
        
        // Transfer from authority's wallet TO the reward_vault
        token::transfer(
            ctx.accounts.into_transfer_to_reward_vault_context(),
            amount,
        )?;
        msg!("{} tokens added to reward pool", amount);
        Ok(())
    }
}

// --- ACCOUNTS STRUCTS ---

#[derive(Accounts)]
pub struct InitializePool<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    pub jal_mint: Account<'info, Mint>,

    #[account(
        init,
        payer = authority,
        token::mint = jal_mint,
        token::authority = stake_vault, // PDA is the authority
        seeds = [b"stake_vault"],
        bump
    )]
    pub stake_vault: Account<'info, TokenAccount>,

    #[account(
        init,
        payer = authority,
        token::mint = jal_mint,
        token::authority = reward_vault, // PDA is the authority
        seeds = [b"reward_vault"],
        bump
    )]
    pub reward_vault: Account<'info, TokenAccount>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[account]
#[derive(Default)]
pub struct UserStakeInfo {
    pub amount_staked: u64,
    pub last_claim_timestamp: i64,
}

impl UserStakeInfo {
    // Simple reward calculation
    pub fn calculate_rewards(&self, apy_per_second: u64) -> Result<u64> {
        let current_time = Clock::get()?.unix_timestamp;
        let time_staked = current_time
            .checked_sub(self.last_claim_timestamp)
            .ok_or(StakingError::Overflow)?;
            
        let rewards = (self.amount_staked as u128)
            .checked_mul(time_staked as u128).ok_or(StakingError::Overflow)?
            .checked_mul(apy_per_second as u128).ok_or(StakingError::Overflow)?
            .checked_div(1_000_000).ok_or(StakingError::Overflow)?; // Assuming APY has 6 decimals
        
        Ok(rewards as u64)
    }
}

#[derive(Accounts)]
pub struct Stake<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    pub jal_mint: Account<'info, Mint>,

    #[account(
        mut,
        token::mint = jal_mint,
        token::authority = user,
    )]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        seeds = [b"stake_vault"],
        bump
    )]
    pub stake_vault: Account<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [b"reward_vault"],
        bump
    )]
    pub reward_vault: Account<'info, TokenAccount>,

    #[account(
        init_if_needed,
        payer = user,
        space = 8 + 8 + 8, // Discriminator + u64 + i64
        seeds = [b"stake_info", user.key().as_ref()],
        bump
    )]
    pub user_stake_info: Account<'info, UserStakeInfo>,
    
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct Unstake<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    pub jal_mint: Account<'info, Mint>,

    #[account(
        mut,
        token::mint = jal_mint,
        token::authority = user,
    )]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        seeds = [b"stake_vault"],
        bump
    )]
    pub stake_vault: Account<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [b"reward_vault"],
        bump
    )]
    pub reward_vault: Account<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [b"stake_info", user.key().as_ref()],
        bump
    )]
    pub user_stake_info: Account<'info, UserStakeInfo>,
    
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct FundRewardPool<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    pub jal_mint: Account<'info, Mint>,

    #[account(
        mut,
        token::mint = jal_mint,
        token::authority = authority,
    )]
    pub authority_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [b"reward_vault"],
        bump
    )]
    pub reward_vault: Account<'info, TokenAccount>,
    
    pub token_program: Program<'info, Token>,
}

// --- CPI Contexts ---
// (Helper functions for making token transfers)

impl<'info> Stake<'info> {
    // Transfer $JAL from reward_vault to user
    fn into_transfer_rewards_to_user_context(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        let bump = self.ctx.bumps.reward_vault;
        let seeds = &[b"reward_vault".as_ref(), &[bump]];
        let signer_seeds = &[&seeds[..]];

        let cpi_accounts = Transfer {
            from: self.reward_vault.to_account_info(),
            to: self.user_token_account.to_account_info(),
            authority: self.reward_vault.to_account_info(), // PDA signs
        };
        CpiContext::new(self.token_program.to_account_info(), cpi_accounts).with_signer(signer_seeds)
    }
    
    // Transfer $JAL from user to stake_vault
    fn into_transfer_to_stake_vault_context(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        let cpi_accounts = Transfer {
            from: self.user_token_account.to_account_info(),
            to: self.stake_vault.to_account_info(),
            authority: self.user.to_account_info(), // User signs
        };
        CpiContext::new(self.token_program.to_account_info(), cpi_accounts)
    }
}

impl<'info> Unstake<'info> {
    // Transfer $JAL from reward_vault to user
    fn into_transfer_rewards_to_user_context(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        let bump = self.ctx.bumps.reward_vault;
        let seeds = &[b"reward_vault".as_ref(), &[bump]];
        let signer_seeds = &[&seeds[..]];
        
        let cpi_accounts = Transfer {
            from: self.reward_vault.to_account_info(),
            to: self.user_token_account.to_account_info(),
            authority: self.reward_vault.to_account_info(), // PDA signs
        };
        CpiContext::new(self.token_program.to_account_info(), cpi_accounts).with_signer(signer_seeds)
    }

    // Transfer $JAL from stake_vault to user
    fn into_transfer_from_stake_vault_context(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        let bump = self.ctx.bumps.stake_vault;
        let seeds = &[b"stake_vault".as_ref(), &[bump]];
        let signer_seeds = &[&seeds[..]];

        let cpi_accounts = Transfer {
            from: self.stake_vault.to_account_info(),
            to: self.user_token_account.to_account_info(),
            authority: self.stake_vault.to_account_info(), // PDA signs
        };
        CpiContext::new(self.token_program.to_account_info(), cpi_accounts).with_signer(signer_seeds)
    }
}

impl<'info> FundRewardPool<'info> {
    // Transfer $JAL from authority to reward_vault
    fn into_transfer_to_reward_vault_context(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        let cpi_accounts = Transfer {
            from: self.authority_token_account.to_account_info(),
            to: self.reward_vault.to_account_info(),
            authority: self.authority.to_account_info(), // Authority signs
        };
        CpiContext::new(self.token_program.to_account_info(), cpi_accounts)
    }
}

// --- Errors ---
#[error_code]
pub enum StakingError {
    #[msg("Stake amount must be greater than zero")]
    StakeAmountZero,
    #[msg("Unstake amount must be greater than zero")]
    UnstakeAmountZero,
    #[msg("Funding amount must be greater than zero")]
    FundAmountZero,
    #[msg("Insufficient staked balance")]
    InsufficientStake,
    #[msg("Numerical overflow")]
    Overflow,
}