import { VEHICLES } from '../data/vehicles';
import { MOCK_AUTHORITY_DATA } from '../data/dashboardData';

const CUSTOM_VEHICLES_KEY = 'carnodes_custom_vehicles';
const QUEUE_KEY = 'carnodes_verification_queue';
const AUDIT_TRAIL_KEY = 'carnodes_authority_audit_trail';

// Multi-tab sync channel
let syncChannel = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    syncChannel = new BroadcastChannel('carnodes_sync_channel');
  }
} catch (e) {
  console.warn('BroadcastChannel not supported:', e);
}

// Helper to broadcast store updates in-page and cross-tab
export function broadcastEvent(eventName, detail) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
    if (syncChannel) {
      try {
        syncChannel.postMessage({ eventName, detail, timestamp: Date.now() });
      } catch (e) {}
    }
  }
}

/**
 * Get all vehicles (baseline + custom user created from seller)
 */
export function getAllVehicles() {
  try {
    const custom = JSON.parse(localStorage.getItem(CUSTOM_VEHICLES_KEY) || '[]');
    const customIds = new Set(custom.map(v => v.id));
    return [...custom, ...VEHICLES.filter(v => !customIds.has(v.id))];
  } catch (err) {
    console.warn('Error reading custom vehicles from localStorage:', err);
    return VEHICLES;
  }
}

/**
 * Add a newly uploaded vehicle (from Seller)
 */
export function addCustomVehicle(newCar) {
  try {
    const existing = JSON.parse(localStorage.getItem(CUSTOM_VEHICLES_KEY) || '[]');
    const updated = [newCar, ...existing.filter(c => c.id !== newCar.id)];
    localStorage.setItem(CUSTOM_VEHICLES_KEY, JSON.stringify(updated));

    // Also automatically build queue item for Authority verification
    const queueItem = {
      id: `VQ-${newCar.id}`,
      vehicleId: newCar.id,
      vehicleName: newCar.name || `${newCar.year} ${newCar.make} ${newCar.model}`,
      vin: newCar.vin || newCar.registration || `VIN-${newCar.id}`,
      registrationNo: newCar.registration || 'MH 02 ER ' + String(newCar.id).slice(-4),
      ownerName: newCar.ownerName || (newCar.ownerAddress ? `${newCar.ownerAddress.slice(0, 6)}...${newCar.ownerAddress.slice(-4)}` : 'Seller (Current User)'),
      ownerType: 'Individual Seller',
      verificationType: 'Vehicle Documents + IPFS Cryptographic Hash',
      submittedDate: 'Just now',
      risk: newCar.riskStatus || 'LOW',
      riskScore: newCar.trustScore || 95,
      status: 'Pending',
      documentsCount: newCar.ipfsDocuments ? Object.keys(newCar.ipfsDocuments).length : 4,
      ipfsDocuments: newCar.ipfsDocuments || {},
      metadataCID: newCar.metadataCID || null,
      txHash: newCar.txHash || null,
      ownerAddress: newCar.ownerAddress || '',
      checklist: {
        identityMatch: 'verified',
        registrationDoc: 'verified',
        ownershipProof: 'verified',
        insurance: 'verified',
        inspection: 'verified',
        financeStatus: 'verified'
      }
    };
    addToVerificationQueue(queueItem);

    broadcastEvent('carnodes_vehicles_updated', updated);
    broadcastEvent('carnodes_queue_updated', getVerificationQueue());
    return newCar;
  } catch (err) {
    console.error('Failed to add custom vehicle:', err);
    return newCar;
  }
}

/**
 * Update a vehicle in storage
 */
export function updateVehicle(vehicleId, updates) {
  try {
    const existing = JSON.parse(localStorage.getItem(CUSTOM_VEHICLES_KEY) || '[]');
    const targetIdx = existing.findIndex(v => v.id === vehicleId);
    let updated;
    if (targetIdx >= 0) {
      existing[targetIdx] = { ...existing[targetIdx], ...updates };
      updated = existing;
    } else {
      const base = VEHICLES.find(v => v.id === vehicleId) || { id: vehicleId };
      updated = [{ ...base, ...updates }, ...existing];
    }
    localStorage.setItem(CUSTOM_VEHICLES_KEY, JSON.stringify(updated));

    // If verification status changed to Verified, also sync queue item
    if (updates.verificationStatus === 'Verified' || updates.mintStatus === 'Minted' || updates.mintStatus === 'Minted in Seller Wallet') {
      try {
        const queue = getVerificationQueue();
        const updatedQueue = queue.map(q => {
          if (q.vehicleId === vehicleId || q.id === vehicleId || q.id === `VQ-${vehicleId}`) {
            return { ...q, status: 'Verified', txHash: updates.mintTxHash || q.txHash };
          }
          return q;
        });
        localStorage.setItem(QUEUE_KEY, JSON.stringify(updatedQueue));
        broadcastEvent('carnodes_queue_updated', updatedQueue);
      } catch (e) {}
    }

    broadcastEvent('carnodes_vehicles_updated', updated);
    return updated;
  } catch (err) {
    console.warn('Failed to update vehicle:', err);
  }
}

/**
 * Get Authority Verification Queue
 * Dynamically guarantees all seller-uploaded vehicles are present at the top
 */
export function getVerificationQueue() {
  try {
    let storedQueue = [];
    try {
      storedQueue = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
    } catch (e) {
      storedQueue = [];
    }

    const allVehicles = getAllVehicles();
    
    // Find all custom vehicles uploaded by sellers
    const customVehicles = allVehicles.filter(v => 
      v.ipfsDocuments || 
      v.metadataCID || 
      v.verificationStatus === 'Under RTO Review' || 
      v.verificationStatus === 'Pending' || 
      v.verificationStatus === 'Pending Verification' || 
      v.listingStatus === 'Pending Verification' || 
      v.listingStatus === 'Ready to List' || 
      v.ownerAddress
    );

    const queueMap = new Map();
    // Index existing stored queue items
    storedQueue.forEach(item => {
      const key = item.vehicleId || item.id;
      queueMap.set(key, item);
    });

    // Make sure EVERY custom vehicle from seller is in the queue
    customVehicles.forEach(v => {
      const key = v.id;
      const existing = queueMap.get(key) || queueMap.get(`VQ-${key}`);
      const isVerified = v.verificationStatus === 'Verified' || v.mintStatus === 'Minted' || v.mintStatus === 'Minted in Seller Wallet';

      const item = {
        id: existing?.id || `VQ-${v.id}`,
        vehicleId: v.id,
        vehicleName: v.name || `${v.year || ''} ${v.make || ''} ${v.model || ''}`.trim() || 'Custom Vehicle',
        vin: v.vin || v.registration || `VIN-${v.id}`,
        registrationNo: v.registration || v.vin || 'MH 02 ER ' + String(v.id).slice(-4),
        ownerName: v.ownerName || (v.ownerAddress ? `${v.ownerAddress.slice(0, 6)}...${v.ownerAddress.slice(-4)}` : 'Seller (Current User)'),
        ownerType: 'Individual Seller',
        verificationType: 'Vehicle Documents + IPFS Cryptographic Hash',
        submittedDate: existing?.submittedDate || 'Recently Uploaded',
        risk: v.riskStatus || 'LOW',
        riskScore: v.trustScore || 96,
        status: isVerified ? 'Verified' : (existing?.status || 'Pending'),
        documentsCount: v.ipfsDocuments ? Object.keys(v.ipfsDocuments).length : 4,
        ipfsDocuments: v.ipfsDocuments || existing?.ipfsDocuments || {},
        metadataCID: v.metadataCID || existing?.metadataCID || null,
        txHash: v.txHash || existing?.txHash || null,
        ownerAddress: v.ownerAddress || existing?.ownerAddress || '',
        checklist: existing?.checklist || {
          identityMatch: 'verified',
          registrationDoc: 'verified',
          ownershipProof: 'verified',
          insurance: 'verified',
          inspection: 'verified',
          financeStatus: 'verified'
        }
      };
      queueMap.set(key, item);
    });

    // Merge baseline mock items if not already present
    MOCK_AUTHORITY_DATA.verificationQueue.forEach(mockItem => {
      const key = mockItem.vehicleId || mockItem.id;
      if (!queueMap.has(key) && !queueMap.has(mockItem.id)) {
        queueMap.set(key, mockItem);
      }
    });

    const result = Array.from(queueMap.values());
    // Sort: Pending first, custom vehicles first
    result.sort((a, b) => {
      if (a.status === 'Pending' && b.status !== 'Pending') return -1;
      if (b.status === 'Pending' && a.status !== 'Pending') return 1;
      return 0;
    });

    return result;
  } catch (err) {
    console.warn('Error reading verification queue:', err);
    return MOCK_AUTHORITY_DATA.verificationQueue;
  }
}

/**
 * Add an item to the Authority Verification Queue
 */
export function addToVerificationQueue(item) {
  try {
    const current = getVerificationQueue();
    const updated = [item, ...current.filter(q => q.id !== item.id && q.vehicleId !== item.vehicleId)];
    localStorage.setItem(QUEUE_KEY, JSON.stringify(updated));
    broadcastEvent('carnodes_queue_updated', updated);
  } catch (err) {
    console.warn('Failed to add to verification queue:', err);
  }
}

/**
 * Update verification queue item (e.g. status after authority approval)
 */
export function updateQueueItemStatus(itemId, newStatus, txHash = null) {
  try {
    const current = getVerificationQueue();
    const updated = current.map(item => {
      if (item.id === itemId || item.vehicleId === itemId || item.id === `VQ-${itemId}`) {
        return { ...item, status: newStatus, txHash: txHash || item.txHash };
      }
      return item;
    });
    localStorage.setItem(QUEUE_KEY, JSON.stringify(updated));
    broadcastEvent('carnodes_queue_updated', updated);
    return updated;
  } catch (err) {
    console.warn('Failed to update queue item:', err);
  }
}

/**
 * Get Authority Audit Trail
 */
export function getAuthorityAuditTrail() {
  try {
    const stored = localStorage.getItem(AUDIT_TRAIL_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return MOCK_AUTHORITY_DATA.auditTrail;
  } catch (err) {
    return MOCK_AUTHORITY_DATA.auditTrail;
  }
}

/**
 * Add entry to Authority Audit Trail
 */
export function addAuthorityAuditEntry(entry) {
  try {
    const current = getAuthorityAuditTrail();
    const updated = [entry, ...current];
    localStorage.setItem(AUDIT_TRAIL_KEY, JSON.stringify(updated));
    broadcastEvent('carnodes_audit_updated', updated);
  } catch (err) {
    console.warn('Failed to add audit entry:', err);
  }
}
