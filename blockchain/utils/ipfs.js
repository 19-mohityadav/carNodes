import "dotenv/config";

const PINATA_JWT = process.env.PINATA_JWT;
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_API_SECRET = process.env.PINATA_API_SECRET;

/**
 * Get headers for Pinata API requests
 */
function getHeaders() {
  if (PINATA_JWT) {
    return {
      Authorization: `Bearer ${PINATA_JWT}`,
    };
  }
  if (PINATA_API_KEY && PINATA_API_SECRET) {
    return {
      pinata_api_key: PINATA_API_KEY,
      pinata_secret_api_key: PINATA_API_SECRET,
    };
  }
  throw new Error("No Pinata credentials found in .env (PINATA_JWT or PINATA_API_KEY required)");
}

/**
 * Verify Pinata API connection and authentication
 */
export async function testPinataAuth() {
  const headers = getHeaders();
  const res = await fetch("https://api.pinata.cloud/data/testAuthentication", {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Pinata authentication failed (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  return data;
}

/**
 * Upload JSON metadata to IPFS (Vehicle RC, insurance, inspection info)
 * @param {Object} data - The JSON object to pin
 * @param {string} name - The human readable name for Pinata explorer
 * @returns {Promise<string>} - IPFS CID (IpfsHash)
 */
export async function uploadJSONToIPFS(data, name = "CarNodes_Vehicle_Document") {
  const headers = {
    ...getHeaders(),
    "Content-Type": "application/json",
  };

  const body = JSON.stringify({
    pinataContent: data,
    pinataMetadata: {
      name,
      keyvalues: {
        platform: "CarNodes",
        type: "VehiclePassportMetadata",
        vin: data.vin || "unknown",
      },
    },
  });

  const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers,
    body,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to upload JSON to IPFS (${res.status}): ${errorText}`);
  }

  const result = await res.json();
  return result.IpfsHash;
}

/**
 * Helper to build gateway URL for viewing IPFS content
 * @param {string} cid - IPFS CID
 */
export function getIPFSGatewayUrl(cid) {
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
}
