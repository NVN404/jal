import { useState, useMemo, useEffect, useCallback } from 'react';
import { useConnection, useAnchorWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, web3, BN } from '@coral-xyz/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import idl from '@/idl/jal_program.json'; // Using alias from create-next-app setup

// --- ACTION REQUIRED: PASTE YOUR DEPLOYED PROGRAM ID HERE ---
const PROGRAM_ID = new PublicKey("PUT_YOUR_JAL_PROGRAM_ID_HERE");

// Type definition for your on-chain data structure (optional but good practice)
interface WaterReadingAccount {
    meterId: string;
    reading: BN; // Anchor returns u64 as BN
    timestamp: BN; // Anchor returns i64 as BN
    authority: PublicKey;
}

// Type for display purposes
interface FormattedReading {
    publicKey: string;
    meter_id: string;
    reading: number; // Converted for display
    timestamp: number; // Converted for display
    authority: string; // Converted for display
}

export default function Home() {
    const { connection } = useConnection();
    const wallet = useAnchorWallet();
    const [simulatedReadings, setSimulatedReadings] = useState<any[]>([]); // Using any for simulator simplicity
    const [onChainReadings, setOnChainReadings] = useState<FormattedReading[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false); // Separate loading state for fetching

    // --- 1. Anchor Program Client Setup ---
    const provider = useMemo(() => {
        if (!wallet) return null;
        return new AnchorProvider(connection, wallet, { commitment: "confirmed" });
    }, [connection, wallet]);

    const program = useMemo(() => {
        if (!provider) return null;
        return new Program<any>(idl as any, PROGRAM_ID, provider); // Use <any> or generate types via Anchor CLI
    }, [provider]);

    // --- 4. Fetch Data Function (wrapped in useCallback) ---
    const handleFetchData = useCallback(async () => {
        if (!program) {
            alert("Program not initialized or wallet not connected.");
            return;
        }
        if (isFetching) return; // Prevent multiple fetches

        setIsFetching(true);
        console.log("Fetching on-chain data...");
        try {
            const accounts = await program.account.waterReading.all() as { publicKey: PublicKey, account: WaterReadingAccount }[];
            console.log(`Found ${accounts.length} records.`);
            const formattedReadings = accounts.map(acc => ({
                publicKey: acc.publicKey.toBase58(),
                meter_id: acc.account.meterId,
                reading: acc.account.reading.toNumber(), // Convert BN
                timestamp: acc.account.timestamp.toNumber() * 1000, // Convert BN to ms
                authority: acc.account.authority.toBase58(),
            })).sort((a, b) => b.timestamp - a.timestamp); // Sort newest first
            setOnChainReadings(formattedReadings);
        } catch (error: any) {
            console.error("Error fetching data:", error);
            alert(`Error fetching data: ${error.message}`);
        } finally {
            setIsFetching(false);
        }
    }, [program, isFetching]); // Add isFetching dependency


    // --- 3. Send Batch Function (wrapped in useCallback) ---
    const handleSendBatch = useCallback(async () => {
        if (!program || !wallet || simulatedReadings.length === 0) {
            console.log("handleSendBatch: Conditions not met (program/wallet/no data), skipping send.");
            return;
        }
        if (isLoading) {
            console.log("handleSendBatch: Already sending, skipping this trigger.");
            return;
        }

        setIsLoading(true);
        const readingsToSend = [...simulatedReadings];
        setSimulatedReadings([]); // Clear simulator immediately
        console.log(`🚀 Sending batch of ${readingsToSend.length} to Devnet...`);

        let successCount = 0;
        try {
            for (const reading of readingsToSend) {
                const newReadingAccount = web3.Keypair.generate();
                try {
                    const txSignature = await program.methods
                        .recordReading(reading.meter_id, new BN(reading.reading))
                        .accounts({
                            readingAccount: newReadingAccount.publicKey,
                            user: wallet.publicKey,
                            systemProgram: SystemProgram.programId,
                        })
                        .signers([newReadingAccount])
                        .rpc();

                    console.log(`✅ Sent reading ${reading.meter_id}. Tx: ${txSignature.substring(0, 8)}...`);
                    // Don't wait for full confirmation in auto-mode for speed,
                    // but log that we're moving on. Remove confirmTransaction.
                    // await connection.confirmTransaction(txSignature, 'confirmed');
                    // console.log(`🔗 Confirmed reading ${reading.meter_id}.`);
                    successCount++;
                    // Optional: shorter delay or no delay for faster sending
                    await new Promise(resolve => setTimeout(resolve, 100)); // Shorter delay
                } catch (txError: any) {
                     console.error(`❌ Failed to send reading ${reading.meter_id}:`, txError.message);
                     // Optional: Add failed reading back to queue? For demo, maybe just skip.
                }
            }
            console.log(`✅ Batch send attempt finished. ${successCount}/${readingsToSend.length} succeeded.`);
             // Fetch data after the batch attempt completes
            await handleFetchData();

        } catch (error: any) { // Catch errors outside the loop (e.g., setup issues)
            console.error("Critical error during batch send:", error);
        } finally {
            setIsLoading(false);
        }
    }, [program, wallet, simulatedReadings, isLoading, connection, handleFetchData]);


    // --- 2. IoT Simulator ---
    useEffect(() => {
        console.log("Simulator starting...");
        const interval = setInterval(() => {
            const newReading = {
                meter_id: `SIM-${Math.random().toString(16).substring(2, 8).toUpperCase()}`,
                reading: Math.floor(Math.random() * 1000) + 100,
                timestamp: Date.now(),
            };
            setSimulatedReadings((prev) => [...prev.slice(-19), newReading]); // Keep last 20
        }, 3000); // Generate reading every 3 seconds
        return () => {
             console.log("Simulator stopping...");
             clearInterval(interval);
        }
    }, []); // Runs only once on mount


    // --- NEW: Automatic Sending Timer ---
    useEffect(() => {
        const attemptAutoSend = async () => {
            if (!isLoading && wallet && program && simulatedReadings.length > 0) {
                console.log(`⏱️ Auto-send timer: ${simulatedReadings.length} readings queued. Sending...`);
                await handleSendBatch();
            }
        };

        const intervalId = setInterval(attemptAutoSend, 60000); // Send every 1 minute
        console.log("⏰ Auto-send timer started (every 60 seconds).");

        return () => {
            clearInterval(intervalId);
            console.log("🛑 Auto-send timer stopped.");
        };
    }, [isLoading, wallet, program, simulatedReadings.length, handleSendBatch]);


    // --- 5. Basic UI ---
    return (
        <div className="container mx-auto p-4 font-sans"> {/* Added basic Tailwind container */}
            <h1 className="text-3xl font-bold mb-6">Jal Hackathon MVP</h1>
            {!wallet && <p className="text-red-500">Please connect your wallet (Devnet)</p>}

            <div className="flex flex-col md:flex-row gap-6">
                {/* Simulator Panel */}
                <div className="border border-gray-300 p-4 rounded-lg md:w-1/2">
                    <h2 className="text-xl font-semibold mb-2">Live IoT Feed (Simulated)</h2>
                    <div className="h-72 overflow-y-scroll bg-gray-100 p-2 text-xs rounded">
                        {simulatedReadings.length === 0 && <p>Waiting for readings...</p>}
                        {simulatedReadings.map((r, i) => (
                            <pre key={i} className="mb-1">{JSON.stringify(r)}</pre>
                        ))}
                    </div>
                     <p className="text-sm mt-2 text-gray-600">Queued for next send: {simulatedReadings.length}</p>
                </div>

                {/* Action Panel */}
                <div className="border border-gray-300 p-4 rounded-lg md:w-1/2">
                    <h2 className="text-xl font-semibold mb-2">Actions</h2>
                    {/* Manual Send Button - Can keep for testing or remove */}
                    {/* <button
                        onClick={handleSendBatch}
                        disabled={isLoading || !wallet || simulatedReadings.length === 0}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                    >
                        {isLoading ? 'Sending...' : `Send Batch Manually (${simulatedReadings.length})`}
                    </button> */}
                    <button
                        onClick={handleFetchData}
                        disabled={isFetching || !wallet}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 ml-2"
                    >
                        {isFetching ? 'Fetching...' : 'Fetch On-Chain Data'}
                    </button>
                    <p className="text-sm mt-2 text-gray-600">
                        {isLoading ? "Auto-sending in progress..." : "Data will auto-send every minute."}
                    </p>
                    <hr className="my-4" />
                    <h2 className="text-xl font-semibold mb-2">On-Chain Data (Devnet)</h2>
                    <div className="h-60 overflow-y-scroll bg-gray-100 p-2 text-xs rounded">
                        {onChainReadings.length === 0 && <p>No data fetched yet.</p>}
                        {onChainReadings.map((r) => (
                            <div key={r.publicKey} className="mb-3 pb-2 border-b border-gray-300">
                                <p><strong>Acc:</strong> <span className="break-all">{r.publicKey}</span></p>
                                <p><strong>ID:</strong> {r.meter_id}</p>
                                <p><strong>Reading:</strong> {r.reading}</p>
                                <p><strong>Time:</strong> {new Date(r.timestamp).toLocaleString()}</p>
                                <p><strong>By:</strong> <span className="break-all">{r.authority}</span></p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}