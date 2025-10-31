use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoVXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");
#[program]
pub mod jal_program {
    use super::*;

    pub fn record_reading(ctx: Context<RecordReading>, meter_id: String, reading: u64) -> Result<()> {
        let reading_account = &mut ctx.accounts.reading_account;
        let clock = Clock::get()?; // Get the current blockchain time

        // 1. Basic Meter ID Validation
        require!(meter_id.len() > 0, CustomError::MeterIdEmpty);
        require!(meter_id.len() <= 50, CustomError::MeterIdTooLong); 

        // 2. Basic Reading Validation
        require!(reading > 0, CustomError::ReadingCannotBeZero);
        // Add an upper bound if you know one? E.g., require!(reading < 1_000_000_000, CustomError::ReadingTooHigh);

        // 3. Timestamp Validation (ensure it's not zero and not wildly in the future)
        // We get the timestamp directly from the blockchain clock now, more reliable
        let current_timestamp = clock.unix_timestamp;

        // --- Assign Data ---
        reading_account.meter_id = meter_id;
        reading_account.reading = reading;
        reading_account.timestamp = current_timestamp; // Use reliable clock time
        reading_account.authority = *ctx.accounts.user.key; // Store who recorded it

        Ok(())
    }



#[derive(Accounts)]
#[instruction(meter_id: String, reading: u64)] // Args passed to the instruction
pub struct RecordReading<'info> {
    // Create a new account for every single reading.
    // This is simple but can get expensive with millions of readings.
    // Later, you might store readings in arrays within accounts per meter, or use account compression.
    #[account(
        init,
        payer = user,
        // Space Calculation:
        // 8 bytes: Account discriminator (Anchor adds this)
        // 4 + 50 bytes: meter_id (4 for length, 50 for max chars)
        // 8 bytes: reading (u64)
        // 8 bytes: timestamp (i64)
        // 32 bytes: authority (Pubkey)
        // ---
        // Total = 8 + 4 + 50 + 8 + 8 + 32 = 110 bytes
        // Adding a small buffer just in case (e.g., 8 bytes) = 118 bytes
        space = 8 + 4 + 50 + 8 + 8 + 32 + 8, // Roughly 118 bytes
    )]
    pub reading_account: Account<'info, WaterReading>,

    #[account(mut)]
    pub user: Signer<'info>, // The wallet paying for the account creation & calling the function

    pub system_program: Program<'info, System>, // Needed for account creation
}

// Data Structure stored in each reading_account
#[account]
pub struct WaterReading {
    pub meter_id: String,   // Max 50 chars
    pub reading: u64,       // Water consumption value
    pub timestamp: i64,     // Unix timestamp (taken from blockchain clock)
    pub authority: Pubkey,  // Wallet that recorded this reading
}

// --- Custom Error Definitions ---
#[error_code]
pub enum CustomError {
    #[msg("Meter ID cannot be empty.")]
    MeterIdEmpty, // New
    #[msg("Meter ID cannot exceed 50 characters.")]
    MeterIdTooLong,
    #[msg("Reading value must be greater than zero.")]
    ReadingCannotBeZero, // New

}
}
