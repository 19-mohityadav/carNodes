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
    const REGISTRY_CONTRACT_ADDRESS =
      Deno.env.get("REGISTRY_CONTRACT_ADDRESS") ?? "0xD585f8daDdB3F438aCE2A5b4e86f47e11825fF30";

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const payload = await req.json();
    const { vin, riskScore = 15, inspectionNotes = "Passed inspection" } = payload;

    if (!vin) {
      return new Response(
        JSON.stringify({ error: "Missing required parameter: vin" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let txHash: string | null = null;
    let blockNumber: number | null = null;
    let tokenId: number | null = null;

    if (PRIVATE_KEY && SEPOLIA_RPC_URL) {
      const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
      const signer = new ethers.Wallet(PRIVATE_KEY, provider);

      const registryAbi = [
        "function verifyVehicle(string memory vin, uint8 riskScore) external",
        "function getVehicleByVin(string memory vin) external view returns (tuple(uint256 tokenId, string vin, bytes32 vinHash, string registrationNumber, string documentCID, address owner, address verifier, uint8 status, uint8 riskScore, uint256 createdAt, address pendingOwner))",
      ];
      const registryContract = new ethers.Contract(REGISTRY_CONTRACT_ADDRESS, registryAbi, signer);

      const tx = await registryContract.verifyVehicle(vin, Math.min(100, Math.max(0, riskScore)));
      txHash = tx.hash;
      const receipt = await tx.wait();
      blockNumber = receipt.blockNumber;

      // Query the vehicle to get the minted tokenId
      try {
        const onchainVehicle = await registryContract.getVehicleByVin(vin);
        tokenId = Number(onchainVehicle.tokenId);
      } catch (err) {
        console.warn("Could not fetch tokenId after verification:", err);
      }
    }

    // Update vehicle in Supabase
    const { data: updatedVehicle, error: updateError } = await supabaseAdmin
      .from("vehicles")
      .update({
        status: "VERIFIED",
        risk_score: riskScore,
        blockchain_token_id: tokenId,
        mint_tx_hash: txHash,
      })
      .eq("vin", vin)
      .select()
      .single();

    if (updateError) console.error("Update vehicle error:", updateError);

    // Save risk assessment
    if (updatedVehicle) {
      await supabaseAdmin.from("ai_risk_assessments").insert({
        vehicle_id: updatedVehicle.id,
        risk_score: riskScore,
        odometer_tampering_risk: riskScore < 30 ? "LOW" : riskScore < 60 ? "MEDIUM" : "HIGH",
        summary: inspectionNotes,
      });
    }

    // Save audit log
    if (txHash) {
      await supabaseAdmin.from("blockchain_records").insert({
        tx_hash: txHash,
        block_number: blockNumber,
        contract_address: REGISTRY_CONTRACT_ADDRESS,
        event_name: "VehicleVerified",
        network: "sepolia",
        payload: { vin, riskScore, tokenId },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        vehicle: updatedVehicle,
        tokenId,
        txHash,
        blockNumber,
        etherscanUrl: txHash ? `https://sepolia.etherscan.io/tx/${txHash}` : null,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("verify-vehicle error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to verify vehicle" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
