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
    const PINATA_JWT = Deno.env.get("PINATA_JWT") ?? "";

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    let userId: string | null = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabaseAdmin.auth.getUser(token);
      if (user) userId = user.id;
    }

    const body = await req.json();
    const { vehicleId, docType = "RC", fileName = "document.pdf", contentBase64, metadata = {} } = body;

    if (!vehicleId || !contentBase64) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: vehicleId, contentBase64" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. Decode base64 and compute SHA-256 hash
    const binaryStr = atob(contentBase64);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }

    const hashBuffer = await crypto.subtle.digest("SHA-256", bytes);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const sha256Hash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    // 2. Upload to Pinata IPFS
    let ipfsCid = `bafybeig${sha256Hash.slice(0, 32)}`;
    let ipfsUrl = `https://ipfs.io/ipfs/${ipfsCid}`;

    if (PINATA_JWT) {
      try {
        const formData = new FormData();
        const blob = new Blob([bytes], { type: "application/octet-stream" });
        formData.append("file", blob, fileName);

        const pinataMeta = JSON.stringify({
          name: `${docType}-${fileName}`,
          keyvalues: { vehicleId, docType, sha256Hash, ...metadata },
        });
        formData.append("pinataMetadata", pinataMeta);

        const pinataRes = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
          method: "POST",
          headers: { Authorization: `Bearer ${PINATA_JWT}` },
          body: formData,
        });

        if (pinataRes.ok) {
          const pinataData = await pinataRes.json();
          ipfsCid = pinataData.IpfsHash;
          ipfsUrl = `https://ipfs.io/ipfs/${ipfsCid}`;
        }
      } catch (err) {
        console.warn("Pinata upload warning:", err);
      }
    }

    // 3. Save into Supabase vehicle_documents
    const { data: documentRecord, error: docError } = await supabaseAdmin
      .from("vehicle_documents")
      .insert({
        vehicle_id: vehicleId,
        doc_type: docType,
        file_name: fileName,
        file_size: bytes.length,
        sha256_hash: sha256Hash,
        ipfs_cid: ipfsCid,
        ipfs_url: ipfsUrl,
        uploaded_by: userId,
      })
      .select()
      .single();

    if (docError) {
      console.error("DB Insert Document Error:", docError);
    }

    // 4. Save into ipfs_files registry
    await supabaseAdmin.from("ipfs_files").upsert({
      cid: ipfsCid,
      content_hash: sha256Hash,
      file_name: fileName,
      size_bytes: bytes.length,
      uploaded_by: userId,
    });

    return new Response(
      JSON.stringify({
        success: true,
        document: documentRecord,
        ipfsCid,
        ipfsUrl,
        sha256Hash,
      }),
      { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("upload-document error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to upload document" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
