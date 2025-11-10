use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer, CloseAccount};

declare_id!("MKTgSjA3H3r7Q1sCj2f5iFfB1oF1CjD3hJ4GkL5pYq"); // Example ID

#[program]
pub mod jal_marketplace {
    use super::*;

    // 1. List an NFT for sale (payment in SOL)
    pub fn list_nft(ctx: Context<ListNft>, price_sol: u64) -> Result<()> {
        let listing = &mut ctx.accounts.listing;
        
        listing.seller = *ctx.accounts.seller.key;
        listing.nft_mint = ctx.accounts.nft_mint.key();
        listing.price_sol = price_sol;
        listing.is_sold = false;

        // Transfer the NFT from the seller's wallet into the contract's vault
        token::transfer(
            ctx.accounts.into_transfer_to_vault_context(),
            1, // Only 1 NFT
        )?;

        msg!("NFT {} listed for {} SOL", listing.nft_mint, listing.price_sol);
        Ok(())
    }

    // 2. Buy the listed NFT (payment in SOL)
    pub fn buy_nft(ctx: Context<BuyNft>) -> Result<()> {
        let listing = &mut ctx.accounts.listing;
        
        require!(!listing.is_sold, MarketplaceError::AlreadySold);
        
        // 1. Pay the seller in SOL
        let price_lamports = listing.price_sol.checked_mul(1_000_000_000).ok_or(MarketplaceError::Overflow)?;
        
        let ix = anchor_lang::solana_program::system_instruction::transfer(
            ctx.accounts.buyer.key,
            ctx.accounts.seller.key,
            price_lamports,
        );
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.buyer.to_account_info(),
                ctx.accounts.seller.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        )?;

        // 2. Transfer the NFT from the vault to the buyer
        let bump = ctx.bumps.listing;
        let seeds = &[
            b"listing".as_ref(),
            listing.nft_mint.as_ref(),
            listing.seller.as_ref(),
            &[bump],
        ];
        let signer_seeds = &[&seeds[..]];

        token::transfer(
            ctx.accounts.into_transfer_to_buyer_context().with_signer(signer_seeds),
            1,
        )?;

        // 3. Mark as sold and close the vault account
        listing.is_sold = true;
        
        token::close_account(
            ctx.accounts.into_close_vault_context().with_signer(signer_seeds)
        )?;

        msg!("NFT {} sold to {}", listing.nft_mint, ctx.accounts.buyer.key);
        Ok(())
    }

    // 3. Delist the NFT
    pub fn delist_nft(ctx: Context<DelistNft>) -> Result<()> {
        let listing = &mut ctx.accounts.listing;
        
        require!(!listing.is_sold, MarketplaceError::AlreadySold);
        
        // Transfer the NFT from the vault back to the seller
        let bump = ctx.bumps.listing;
        let seeds = &[
            b"listing".as_ref(),
            listing.nft_mint.as_ref(),
            listing.seller.as_ref(),
            &[bump],
        ];
        let signer_seeds = &[&seeds[..]];

        token::transfer(
            ctx.accounts.into_transfer_to_seller_context().with_signer(signer_seeds),
            1,
        )?;

        // Close the vault
        token::close_account(
            ctx.accounts.into_close_vault_context().with_signer(signer_seeds)
        )?;

        msg!("NFT {} delisted by seller", listing.nft_mint);
        Ok(())
    }
}

// --- ACCOUNTS ---

#[account]
pub struct Listing {
    pub seller: Pubkey,
    pub nft_mint: Pubkey,
    pub price_sol: u64,
    pub is_sold: bool,
}

#[derive(Accounts)]
pub struct ListNft<'info> {
    #[account(mut)]
    pub seller: Signer<'info>,
    pub nft_mint: Account<'info, Mint>,

    #[account(
        mut,
        token::mint = nft_mint,
        token::authority = seller,
    )]
    pub seller_nft_token_account: Account<'info, TokenAccount>,

    #[account(
        init,
        payer = seller,
        space = 8 + 32 + 32 + 8 + 1, // Discriminator + seller + mint + price + is_sold
        seeds = [b"listing", nft_mint.key().as_ref(), seller.key().as_ref()],
        bump
    )]
    pub listing: Account<'info, Listing>,

    #[account(
        init,
        payer = seller,
        token::mint = nft_mint,
        token::authority = listing, // <-- The PDA owns the vault
    )]
    pub vault_token_account: Account<'info, TokenAccount>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct BuyNft<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,

    #[account(
        mut,
        seeds = [b"listing", listing.nft_mint.as_ref(), listing.seller.as_ref()],
        bump
    )]
    pub listing: Account<'info, Listing>,

    /// CHECK: This is safe because we only transfer SOL *to* it.
    #[account(mut)]
    pub seller: AccountInfo<'info>,

    #[account(
        mut,
        token::authority = listing,
    )]
    pub vault_token_account: Account<'info, TokenAccount>,

    #[account(
        init_if_needed,
        payer = buyer,
        token::mint = listing.nft_mint,
        token::authority = buyer,
    )]
    pub buyer_nft_token_account: Account<'info, TokenAccount>,
    
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct DelistNft<'info> {
    #[account(mut)]
    pub seller: Signer<'info>,

    #[account(
        mut,
        seeds = [b"listing", listing.nft_mint.as_ref(), seller.key().as_ref()],
        bump,
        has_one = seller, // Security: only the original seller can delist
        close = seller // Automatically close account and send rent back to seller
    )]
    pub listing: Account<'info, Listing>,

    #[account(
        mut,
        token::authority = listing,
    )]
    pub vault_token_account: Account<'info, TokenAccount>,

    #[account(
        mut,
        token::authority = seller,
    )]
    pub seller_nft_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

// --- Errors ---
#[error_code]
pub enum MarketplaceError {
    #[msg("This NFT has already been sold.")]
    AlreadySold,
    #[msg("Numerical overflow error.")]
    Overflow,
}

// --- CPI Contexts (Helper functions) ---
impl<'info> ListNft<'info> {
    fn into_transfer_to_vault_context(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        let cpi_accounts = Transfer {
            from: self.seller_nft_token_account.to_account_info(),
            to: self.vault_token_account.to_account_info(),
            authority: self.seller.to_account_info(),
        };
        CpiContext::new(self.token_program.to_account_info(), cpi_accounts)
    }
}

impl<'info> BuyNft<'info> {
    fn into_transfer_to_buyer_context(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        let cpi_accounts = Transfer {
            from: self.vault_toke_account.to_account_info(),
            to: self.buyer_nft_token_account.to_account_info(),
            authority: self.listing.to_account_info(), // The PDA is the authority
        };
        CpiContext::new(self.token_program.to_account_info(), cpi_accounts)
    }

    fn into_close_vault_context(&self) -> CpiContext<'_, '_, '_, 'info, CloseAccount<'info>> {
        let cpi_accounts = CloseAccount {
            account: self.vault_token_account.to_account_info(),
            destination: self.buyer.to_account_info(), // Send rent from vault to buyer
            authority: self.listing.to_account_info(),
        };
        CpiContext::new(self.token_program.to_account_info(), cpi_accounts)
    }
}

impl<'info> DelistNft<'info> {
    fn into_transfer_to_seller_context(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        let cpi_accounts = Transfer {
            from: self.vault_token_account.to_account_info(),
            to: self.seller_nft_token_account.to_account_info(),
            authority: self.listing.to_account_info(), // The PDA is the authority
        };
        CpiContext::new(self.token_program.to_account_info(), cpi_accounts)
    }

    fn into_close_vault_context(&self) -> CpiContext<'_, '_, '_, 'info, CloseAccount<'info>> {
        let cpi_accounts = CloseAccount {
            account: self.vault_token_account.to_account_info(),
            destination: self.seller.to_account_info(), // Send rent back to seller
            authority: self.listing.to_account_info(),
        };
        CpiContext::new(self.token_program.to_account_info(), cpi_accounts)
    }
}