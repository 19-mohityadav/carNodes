// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";

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
    const ESCROW_CONTRACT_ADDRESS =
      Deno.env.get("ESCROW_CONTRACT_ADDRESS") ?? "0xB9d64e71bc01C8b09F19fF258dE21E0ebDb78EE2";
    const MOCKINR_CONTRACT_ADDRESS =
      Deno.env.get("MOCKINR_CONTRACT_ADDRESS") ?? "0x1aE2E1190f4e026f125111fA80882cCFE50EEC1C";

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    let userId: string | null = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabaseAdmin.auth.getUser(token);
      if (user) userId = user.id;
    }

    const body = await req.json();
    const {
      listingId,
      vehicleId,
      sellerId,
      amount,
      currency = "MOCKINR",
      buyerWallet,
      sellerWallet,
      onchainEscrowId,
      creationTxHash,
    } = body;

    if (!vehicleId || !amount) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters: vehicleId, amount" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert into escrow_transactions table
    const { data: escrow, error: escrowError } = await supabaseAdmin
      .from("escrow_transactions")
      .insert({
        listing_id: listingId || null,
        vehicle_id: vehicleId,
        buyer_id: userId,
        seller_id: sellerId,
        amount,
        currency,
        onchain_escrow_id: onchainEscrowId || null,
        contract_address: ESCROW_CONTRACT_ADDRESS,
        status: creationTxHash ? "FUNDED" : "CREATED",
        creation_tx_hash: creationTxHash || null,
      })
      .select()
      .single();

    if (escrowError) {
      console.error("DB Insert Escrow Error:", escrowError);
      return new Response(
        JSON.stringify({ error: escrowError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update vehicle status to ESCROW_LOCKED
    await supabaseAdmin
      .from("vehicles")
      .update({ status: "ESCROW_LOCKED" })
      .eq("id", vehicleId);

    // Update listing status to UNDER_ESCROW if listing exists
    if (listingId) {
      await supabaseAdmin
        .from("marketplace_listings")
        .update({ status: "UNDER_ESCROW" })
        .eq("id", listingId);
    }

    return new Response(
      JSON.stringify({
        success: true,
        escrow,
        contracts: {
          escrow: ESCROW_CONTRACT_ADDRESS,
          mockINR: MOCKINR_CONTRACT_ADDRESS,
        },
      }),
      { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("initiate-escrow error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to initiate escrow" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
