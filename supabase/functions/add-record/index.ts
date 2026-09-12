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
    const PINATA_JWT = Deno.env.get("PINATA_JWT") ?? "";
    const PASSPORT_CONTRACT_ADDRESS =
      Deno.env.get("PASSPORT_CONTRACT_ADDRESS") ?? "0xec5b401ECe64d130B6Cc83c4916137990009Eaf5";

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
      vehicleId,
      recordType = "SERVICE",
      title,
      description = "",
      serviceCenter = "",
      mileageKm = 0,
      recordDate = new Date().toISOString().split("T")[0],
    } = body;

    if (!vehicleId || !title) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: vehicleId, title" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Retrieve vehicle details for tokenId
    const { data: vehicle, error: vehicleErr } = await supabaseAdmin
      .from("vehicles")
      .select("id, vin, blockchain_token_id")
      .eq("id", vehicleId)
      .single();

    if (vehicleErr || !vehicle) {
      return new Response(
        JSON.stringify({ error: "Vehicle not found in database" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Pin record data to IPFS
    const recordPayload = {
      vehicleId,
      vin: vehicle.vin,
      recordType,
      title,
      description,
      serviceCenter,
      mileageKm,
      recordDate,
      timestamp: new Date().toISOString(),
    };

    let ipfsCid = `bafybeirecord${Date.now()}`;
    if (PINATA_JWT) {
      try {
        const pinRes = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${PINATA_JWT}`,
          },
          body: JSON.stringify({
            pinataMetadata: { name: `Record-${vehicle.vin}-${Date.now()}` },
            pinataContent: recordPayload,
          }),
        });
        if (pinRes.ok) {
          const pinData = await pinRes.json();
          ipfsCid = pinData.IpfsHash;
        }
      } catch (err) {
        console.warn("Pinata record upload warning:", err);
      }
    }

    // 2. Add evidence on-chain to VehiclePassport if token exists
    let txHash: string | null = null;
    let blockNumber: number | null = null;

    if (vehicle.blockchain_token_id && PRIVATE_KEY && SEPOLIA_RPC_URL) {
      try {
        const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
        const signer = new ethers.Wallet(PRIVATE_KEY, provider);

        const passportAbi = [
          "function addEvidence(uint256 vehicleId, string memory cid) external returns (bool)",
        ];
        const passport = new ethers.Contract(PASSPORT_CONTRACT_ADDRESS, passportAbi, signer);

        const tx = await passport.addEvidence(vehicle.blockchain_token_id, ipfsCid);
        txHash = tx.hash;
        const receipt = await tx.wait();
        blockNumber = receipt.blockNumber;
      } catch (chainErr) {
        console.warn("Blockchain addEvidence error:", chainErr);
      }
    }

    // 3. Save to database vehicle_records
    const { data: record, error: recError } = await supabaseAdmin
      .from("vehicle_records")
      .insert({
        vehicle_id: vehicleId,
        record_type: recordType,
        title,
        description,
        service_center: serviceCenter,
        mileage_km: mileageKm,
        record_date: recordDate,
        submitted_by: userId,
        status: txHash ? "ON_CHAIN" : "VERIFIED",
        ipfs_cid: ipfsCid,
        blockchain_tx_hash: txHash,
      })
      .select()
      .single();

    if (recError) console.error("DB Insert Record Error:", recError);

    // 4. Save audit log
    if (txHash) {
      await supabaseAdmin.from("blockchain_records").insert({
        tx_hash: txHash,
        block_number: blockNumber,
        contract_address: PASSPORT_CONTRACT_ADDRESS,
        event_name: "EvidenceAdded",
        network: "sepolia",
        payload: { vehicleId, tokenId: vehicle.blockchain_token_id, ipfsCid },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        record,
        ipfsCid,
        txHash,
        etherscanUrl: txHash ? `https://sepolia.etherscan.io/tx/${txHash}` : null,
      }),
      { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("add-record error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to add record" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
