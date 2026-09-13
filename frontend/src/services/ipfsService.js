/**
 * IPFS Upload Service via Pinata
 * Uploads vehicle documents and metadata to IPFS and returns CIDs.
 * Falls back to a mock CID if Pinata JWT is not configured, so the UI
 * still works for demonstration purposes without a live API key.
 */

const PINATA_JWT = import.meta.env.VITE_PINATA_JWT || '';
const IPFS_GATEWAY = import.meta.env.VITE_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/';
const PINATA_UPLOAD_URL = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
const PINATA_JSON_URL = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

/**
 * Generate a deterministic-looking mock CID for demo purposes.
 */
function generateMockCID(seed = '') {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  let result = 'Qm';
  const rng = Math.abs(hash);
  for (let i = 0; i < 44; i++) {
    result += chars[(rng * (i + 1) * 31337) % chars.length];
  }
  return result;
}

/**
 * Upload a File object to IPFS via Pinata.
 * Returns { cid, url, name, size, mimeType }
 */
export async function uploadFileToIPFS(file, metadata = {}) {
  if (!PINATA_JWT || PINATA_JWT.trim() === '') {
    // Demo mode — return a believable mock CID instantly
    const mockCID = generateMockCID(file.name + file.size);
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));
    return {
      cid: mockCID,
      url: `${IPFS_GATEWAY}${mockCID}`,
      name: file.name,
      size: file.size,
      mimeType: file.type,
      demo: true
    };
  }

  const formData = new FormData();
  formData.append('file', file);

  const pinataMetadata = JSON.stringify({
    name: metadata.name || file.name,
    keyvalues: {
      vehicleId: metadata.vehicleId || '',
      docType: metadata.docType || 'vehicle-document',
      uploader: metadata.uploader || '',
      timestamp: Date.now().toString()
    }
  });
  formData.append('pinataMetadata', pinataMetadata);

  const pinataOptions = JSON.stringify({ cidVersion: 1 });
  formData.append('pinataOptions', pinataOptions);

  const response = await fetch(PINATA_UPLOAD_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${PINATA_JWT}` },
    body: formData
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`IPFS upload failed: ${err}`);
  }

  const data = await response.json();
  return {
    cid: data.IpfsHash,
    url: `${IPFS_GATEWAY}${data.IpfsHash}`,
    name: file.name,
    size: file.size,
    mimeType: file.type,
    demo: false
  };
}

/**
 * Upload JSON metadata to IPFS via Pinata.
 * Returns { cid, url }
 */
export async function uploadMetadataToIPFS(jsonData, name = 'vehicle-metadata') {
  if (!PINATA_JWT || PINATA_JWT.trim() === '') {
    const mockCID = generateMockCID(JSON.stringify(jsonData).slice(0, 64));
    await new Promise((r) => setTimeout(r, 500));
    return {
      cid: mockCID,
      url: `${IPFS_GATEWAY}${mockCID}`,
      demo: true
    };
  }

  const body = {
    pinataContent: jsonData,
    pinataMetadata: { name },
    pinataOptions: { cidVersion: 1 }
  };

  const response = await fetch(PINATA_JSON_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${PINATA_JWT}`
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`IPFS JSON upload failed: ${err}`);
  }

  const data = await response.json();
  return {
    cid: data.IpfsHash,
    url: `${IPFS_GATEWAY}${data.IpfsHash}`,
    demo: false
  };
}

/**
 * Build IPFS gateway URL from CID
 */
export function ipfsUrl(cid) {
  if (!cid) return '';
  if (cid.startsWith('http')) return cid;
  return `${IPFS_GATEWAY}${cid}`;
}
