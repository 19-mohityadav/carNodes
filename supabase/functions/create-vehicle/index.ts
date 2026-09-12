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
    const REGISTRY_CONTRACT_ADDRESS =
      Deno.env.get("REGISTRY_CONTRACT_ADDRESS") ?? "0xD585f8daDdB3F438aCE2A5b4e86f47e11825fF30";

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Optional user validation via bearer token
    let userId: string | null = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabaseAdmin.auth.getUser(token);
      if (user) userId = user.id;
    }

    const payload = await req.json();
    const {
      vin,
      registrationNumber,
      manufacturer,
      model,
      variant = "",
      manufacturingYear = new Date().getFullYear(),
      fuelType = "Petrol",
      color = "White",
      engineNumber = "",
      chassisNumber = "",
      ownerWallet,
    } = payload;

    if (!vin || !registrationNumber || !manufacturer || !model) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: vin, registrationNumber, manufacturer, model" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Calculate VIN Hash (keccak256 matching Solidity: keccak256(abi.encodePacked(vin)))
    const vinBytes = ethers.toUtf8Bytes(vin);
    const vinHash = ethers.keccak256(vinBytes);

    // 2. Upload metadata to IPFS via Pinata
    const metadata = {
      vin,
      vinHash,
      registrationNumber,
      manufacturer,
      model,
      variant,
      manufacturingYear,
      fuelType,
      color,
      engineNumber,
      chassisNumber,
      ownerWallet: ownerWallet || "",
      createdAt: new Date().toISOString(),
    };

    let ipfsCid = "bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi";
    if (PINATA_JWT) {
      try {
        const pinataRes = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${PINATA_JWT}`,
          },
          body: JSON.stringify({
            pinataMetadata: { name: `Vehicle-${vin}` },
            pinataContent: metadata,
          }),
        });
        if (pinataRes.ok) {
          const pinataData = await pinataRes.json();
          ipfsCid = pinataData.IpfsHash;
        }
      } catch (err) {
        console.warn("Pinata upload warning:", err);
      }
    }

    // 3. Send registration transaction to Sepolia smart contract
    let txHash: string | null = null;
    let blockNumber: number | null = null;

    if (PRIVATE_KEY && SEPOLIA_RPC_URL) {
      const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
      const signer = new ethers.Wallet(PRIVATE_KEY, provider);

      const registryAbi = [
        "function registerVehicle(string memory vin, string memory registrationNumber, string memory documentCID) external",
      ];
      const registryContract = new ethers.Contract(REGISTRY_CONTRACT_ADDRESS, registryAbi, signer);

      const tx = await registryContract.registerVehicle(vin, registrationNumber, ipfsCid);
      txHash = tx.hash;
      const receipt = await tx.wait();
      blockNumber = receipt.blockNumber;
    }

    // 4. Save into Supabase vehicles table
    const { data: vehicle, error: dbError } = await supabaseAdmin
      .from("vehicles")
      .insert({
        vin,
        vin_hash: vinHash,
        registration_number: registrationNumber,
        manufacturer,
        model,
        variant,
        manufacturing_year: manufacturingYear,
        fuel_type: fuelType,
        color,
        engine_number: engineNumber,
        chassis_number: chassisNumber,
        current_owner_id: userId,
        owner_wallet: ownerWallet,
        status: "PENDING",
        ipfs_metadata_cid: ipfsCid,
        registration_tx_hash: txHash,
        registry_contract_address: REGISTRY_CONTRACT_ADDRESS,
      })
      .select()
      .single();

    if (dbError) {
      console.error("DB Insert Error:", dbError);
    }

    // 5. Save audit log in blockchain_records
    if (txHash) {
      await supabaseAdmin.from("blockchain_records").insert({
        tx_hash: txHash,
        block_number: blockNumber,
        contract_address: REGISTRY_CONTRACT_ADDRESS,
        event_name: "VehicleRegistered",
        network: "sepolia",
        payload: { vin, registrationNumber, ipfsCid, vinHash },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        vehicle,
        vinHash,
        ipfsCid,
        txHash,
        blockNumber,
        etherscanUrl: txHash ? `https://sepolia.etherscan.io/tx/${txHash}` : null,
      }),
      { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("create-vehicle error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to create vehicle" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
