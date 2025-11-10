// This is Node.js code, NOT Rust.
// Run this on your server.
// You must install the libraries:
// npm install @magicblock-labs/client @solana/web3.js @coral-xyz/anchor fs

import { MagicBlockClient } from '@magicblock-labs/client';
import { Program, AnchorProvider, web3, BN } from '@coral-xyz/anchor';
import { Connection, PublicKey, Keypair, SystemProgram } from '@solana/web3.js';
import fs from 'fs';

// --- CONFIGURATION ---
// 1. Your Jal Company's "Authority" wallet that pays for this
// This wallet MUST have the authority to call the permissioned functions
const JAL_AUTHORITY_KEYPAIR_PATH = '/home/yunohu/.config/solana/devnet.json'; // Or your server's key
const authorityKeypair = Keypair.fromSecretKey(
  Buffer.from(JSON.parse(fs.readFileSync(JAL_AUTHORITY_KEYPAIR_PATH, 'utf-8')))
);

// 2. Your Deployed Data Program ID
const JAL_PROGRAM_ID = new PublicKey("Fg6PaFpoVXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"); 

// 3. Your Magic Block API Key (Get this from the Magic Block website)
const MAGIC_BLOCK_API_KEY = "YOUR_MAGIC_BLOCK_API_KEY_GOES_HERE";

// 4. Your Contract's IDL
import idl from './jal_program_idl.json'; // Make sure this path is correct
// ---

async function sendMunicipalityBatch(readings) {
  console.log("Initializing Magic Block client...");
  const client = new MagicBlockClient(MAGIC_BLOCK_API_KEY);

  // 1. Start a new ephemeral rollup session
  const { sessionId, rpcUrl } = await client.startSession();
  console.log(`Magic Block session started: ${sessionId}`);
  console.log(`Using temporary RPC: ${rpcUrl}`);

  // 2. Connect to the *temporary rollup* RPC with your authority wallet
  const connection = new Connection(rpcUrl, 'confirmed');
  const provider = new AnchorProvider(connection, new web3.Wallet(authorityKeykeypair), { commitment: "confirmed" });
  const program = new Program(idl, JAL_PROGRAM_ID, provider);

  // 3. Send all transactions to the rollup
  console.log(`Sending ${readings.length} readings to the rollup...`);
  try {
    for (const reading of readings) {
      // Create a new account for each reading
      const newReadingAccount = Keypair.generate(); 
      
      const tx = await program.methods
        .recordReading(reading.meter_id, new BN(reading.reading))
        .accounts({
            readingAccount: newReadingAccount.publicKey,
            user: authorityKeypair.publicKey, // The Authority pays
            systemProgram: SystemProgram.programId,
         })
        .signers([newReadingAccount]) // New account must sign
        .transaction(); // Build the transaction

      // Send the transaction to the Magic Block RPC
      // The Authority wallet (provider) will also sign
      await web3.sendAndConfirmTransaction(connection, tx, [authorityKeypair, newReadingAccount]);
      console.log(`Sent reading ${reading.meter_id} to rollup.`);
    }

    // 4. Commit the session! This settles it on Solana L1.
    console.log("Committing session to L1...");
    const { signature } = await client.commitSession(sessionId);
    console.log(`✅ Batch successful! L1 Settlement TX: ${signature}`);
    
  } catch (err) {
    console.error("Error during batch, aborting session...", err);
    await client.abortSession(sessionId);
  }
}

// --- Example: How your API would call this function ---
const municipalityReadings = [
  { meter_id: "MUNI-INFLOW-01", reading: 123456789 },
  { meter_id: "MUNI-OUTFLOW-01", reading: 123450000 },
  { meter_id: "MUNI-INFLOW-02", reading: 987654321 },
];

sendMunicipalityBatch(municipalityReadings);