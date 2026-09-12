// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";
// @ts-ignore
import { ethers } from "https://esm.sh/ethers@6.11.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const SEPOLIA_RPC_URL = Deno.env.get("SEPOLIA_RPC_URL") ?? "https://rpc.sepolia.org";
    const PRIVATE_KEY = Deno.env.get("PRIVATE_KEY") ?? "";
    const ESCROW_CONTRACT_ADDRESS =
      Deno.env.get("ESCROW_CONTRACT_ADDRESS") ?? "0xB9d64e71bc01C8b09F19fF258dE21E0ebDb78EE2";

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const body = await req.json();
    const { escrowId, onchainEscrowId } = body;

    if (!escrowId && !onchainEscrowId) {
      return new Response(
        JSON.stringify({ error: "Missing required field: escrowId or onchainEscrowId" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Fetch Escrow Transaction Record
    let query = supabaseAdmin.from("escrow_transactions").select("*, vehicles(*)");
    if (escrowId) query = query.eq("id", escrowId);
    else query = query.eq("onchain_escrow_id", onchainEscrowId);

    const { data: escrow, error: escErr } = await query.single();
    if (escErr || !escrow) {
      return new Response(
        JSON.stringify({ error: "Escrow transaction not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let txHash: string | null = null;
    let blockNumber: number | null = null;

    // 2. Call releaseFunds on Sepolia smart contract
    const targetOnchainEscrowId = escrow.onchain_escrow_id || onchainEscrowId;
    if (targetOnchainEscrowId && PRIVATE_KEY && SEPOLIA_RPC_URL) {
      try {
        const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
        const signer = new ethers.Wallet(PRIVATE_KEY, provider);

        const escrowAbi = [
          "function releaseFunds(uint256 escrowId) external",
        ];
        const escrowContract = new ethers.Contract(ESCROW_CONTRACT_ADDRESS, escrowAbi, signer);

        const tx = await escrowContract.releaseFunds(targetOnchainEscrowId);
        txHash = tx.hash;
        const receipt = await tx.wait();
        blockNumber = receipt.blockNumber;
      } catch (chainErr) {
        console.warn("releaseFunds onchain warning:", chainErr);
      }
    }

    // 3. Update database status
    await supabaseAdmin
      .from("escrow_transactions")
      .update({
        status: "RELEASED",
        release_tx_hash: txHash,
      })
      .eq("id", escrow.id);

    // 4. Transfer vehicle ownership to buyer
    if (escrow.buyer_id) {
      await supabaseAdmin
        .from("vehicles")
        .update({
          current_owner_id: escrow.buyer_id,
          status: "TRANSFERRED",
        })
        .eq("id", escrow.vehicle_id);
    }

    // 5. Update marketplace listing to SOLD
    if (escrow.listing_id) {
      await supabaseAdmin
        .from("marketplace_listings")
        .update({ status: "SOLD" })
        .eq("id", escrow.listing_id);
    }

    // 6. Audit log
    if (txHash) {
      await supabaseAdmin.from("blockchain_records").insert({
        tx_hash: txHash,
        block_number: blockNumber,
        contract_address: ESCROW_CONTRACT_ADDRESS,
        event_name: "EscrowReleased",
        network: "sepolia",
        payload: { escrowId: escrow.id, onchainEscrowId: targetOnchainEscrowId },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        escrowId: escrow.id,
        status: "RELEASED",
        txHash,
        etherscanUrl: txHash ? `https://sepolia.etherscan.io/tx/${txHash}` : null,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("release-escrow error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to release escrow" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
