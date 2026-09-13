const CUSTOM_VEHICLES_KEY = 'carnodes_custom_vehicles';
const QUEUE_KEY = 'carnodes_verification_queue';
const AUDIT_TRAIL_KEY = 'carnodes_authority_audit_trail';

// Helper to sanitize and remove old mock data from localStorage
function sanitizeStorage() {
  if (typeof window === 'undefined') return;
  try {
    // Clean custom vehicles of legacy mock IDs
    const storedVehicles = localStorage.getItem(CUSTOM_VEHICLES_KEY);
    if (storedVehicles) {
      const parsed = JSON.parse(storedVehicles);
      const filtered = parsed.filter(v => 
        v && v.id && 
        !['CN-48291', 'CN-77310', 'CN-10294', 'CN-33921', 'CN-55102', 'CN-88219'].includes(v.id)
      );
      if (filtered.length !== parsed.length) {
        localStorage.setItem(CUSTOM_VEHICLES_KEY, JSON.stringify(filtered));
      }
    }

    // Clean verification queue of legacy mock IDs
    const storedQueue = localStorage.getItem(QUEUE_KEY);
    if (storedQueue) {
      const parsed = JSON.parse(storedQueue);
      const filtered = parsed.filter(q => 
        q && q.id && 
        !['VQ-01', 'VQ-02', 'VQ-03', 'VQ-04', 'VQ-05', 'VQ-CN-48291', 'VQ-CN-77310'].includes(q.id)
      );
      if (filtered.length !== parsed.length) {
        localStorage.setItem(QUEUE_KEY, JSON.stringify(filtered));
      }
    }

    // Clean audit trail of legacy mock IDs
    const storedAudit = localStorage.getItem(AUDIT_TRAIL_KEY);
    if (storedAudit) {
      const parsed = JSON.parse(storedAudit);
      const filtered = parsed.filter(a => 
        a && a.id && !['LOG-89102', 'LOG-89101', 'LOG-89100', 'LOG-89099'].includes(a.id)
      );
      if (filtered.length !== parsed.length) {
        localStorage.setItem(AUDIT_TRAIL_KEY, JSON.stringify(filtered));
      }
    }
  } catch (e) {
    console.warn('Error sanitizing storage:', e);
  }
}

sanitizeStorage();

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
 * Get all vehicles (strictly real user uploads from seller)
 */
export function getAllVehicles() {
  try {
    const custom = JSON.parse(localStorage.getItem(CUSTOM_VEHICLES_KEY) || '[]');
    return Array.isArray(custom) ? custom : [];
  } catch (err) {
    console.warn('Error reading vehicles from localStorage:', err);
    return [];
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

    // Build comprehensive queue item for Authority verification
    const queueItem = {
      id: `VQ-${newCar.id}`,
      vehicleId: newCar.id,
      vehicleName: newCar.name || `${newCar.year || ''} ${newCar.make || ''} ${newCar.model || ''}`.trim() || 'Custom Vehicle',
      make: newCar.make || '',
      model: newCar.model || newCar.modelName || '',
      year: newCar.year || '',
      vin: newCar.vin || newCar.registration || `VIN-${newCar.id}`,
      registrationNo: newCar.registration || newCar.vin || `MH 02 ER ${String(newCar.id).slice(-4)}`,
      mileage: newCar.mileage || '',
      color: newCar.color || '',
      fuelType: newCar.fuelType || 'Petrol',
      transmission: newCar.transmission || 'Manual',
      priceInr: newCar.priceInr || '',
      priceEth: newCar.priceEth || '0.05',
      description: newCar.description || '',
      ownerName: newCar.ownerName || (newCar.ownerAddress ? `${newCar.ownerAddress.slice(0, 6)}...${newCar.ownerAddress.slice(-4)}` : 'Seller'),
      ownerType: 'Individual Seller',
      ownerAddress: newCar.ownerAddress || '',
      verificationType: 'Vehicle Documents + IPFS Cryptographic Hash',
      submittedDate: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) + ' (Just now)',
      risk: newCar.riskStatus || 'LOW',
      riskScore: newCar.trustScore || 96,
      status: 'Pending',
      documentsCount: newCar.ipfsDocuments ? Object.keys(newCar.ipfsDocuments).length : 4,
      ipfsDocuments: newCar.ipfsDocuments || {},
      metadataCID: newCar.metadataCID || null,
      txHash: newCar.txHash || null,
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
    console.error('Failed to add vehicle:', err);
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
      updated = [{ id: vehicleId, ...updates }, ...existing];
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
 * Get Authority Verification Queue (Strictly real uploaded seller vehicles)
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
    const queueMap = new Map();

    // Index existing stored queue items
    storedQueue.forEach(item => {
      const key = item.vehicleId || item.id;
      queueMap.set(key, item);
    });

    // Make sure EVERY real uploaded vehicle from seller is present in the queue with full details
    allVehicles.forEach(v => {
      const key = v.id;
      const existing = queueMap.get(key) || queueMap.get(`VQ-${key}`);
      const isVerified = v.verificationStatus === 'Verified' || v.mintStatus === 'Minted' || v.mintStatus === 'Minted in Seller Wallet';

      const item = {
        id: existing?.id || `VQ-${v.id}`,
        vehicleId: v.id,
        vehicleName: v.name || `${v.year || ''} ${v.make || ''} ${v.model || ''}`.trim() || 'Vehicle Asset',
        make: v.make || existing?.make || '',
        model: v.model || v.modelName || existing?.model || '',
        year: v.year || existing?.year || '',
        vin: v.vin || v.registration || existing?.vin || `VIN-${v.id}`,
        registrationNo: v.registration || v.vin || existing?.registrationNo || `MH 02 ER ${String(v.id).slice(-4)}`,
        mileage: v.mileage || existing?.mileage || '',
        color: v.color || existing?.color || '',
        fuelType: v.fuelType || existing?.fuelType || 'Petrol',
        transmission: v.transmission || existing?.transmission || 'Manual',
        priceInr: v.priceInr || existing?.priceInr || '',
        priceEth: v.priceEth || existing?.priceEth || '0.05',
        description: v.description || existing?.description || '',
        ownerName: v.ownerName || existing?.ownerName || (v.ownerAddress ? `${v.ownerAddress.slice(0, 6)}...${v.ownerAddress.slice(-4)}` : 'Seller'),
        ownerType: 'Individual Seller',
        ownerAddress: v.ownerAddress || existing?.ownerAddress || '',
        verificationType: 'Vehicle Documents + IPFS Cryptographic Hash',
        submittedDate: existing?.submittedDate || 'Recently Uploaded',
        risk: v.riskStatus || existing?.risk || 'LOW',
        riskScore: v.trustScore || existing?.riskScore || 96,
        status: isVerified ? 'Verified' : (existing?.status || 'Pending'),
        documentsCount: v.ipfsDocuments ? Object.keys(v.ipfsDocuments).length : (existing?.documentsCount || 4),
        ipfsDocuments: v.ipfsDocuments || existing?.ipfsDocuments || {},
        metadataCID: v.metadataCID || existing?.metadataCID || null,
        txHash: v.txHash || existing?.txHash || null,
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

    const result = Array.from(queueMap.values());
    // Sort: Pending first
    result.sort((a, b) => {
      if (a.status === 'Pending' && b.status !== 'Pending') return -1;
      if (b.status === 'Pending' && a.status !== 'Pending') return 1;
      return 0;
    });

    return result;
  } catch (err) {
    console.warn('Error reading verification queue:', err);
    return [];
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
 * Get Authority Audit Trail (strictly real entries)
 */
export function getAuthorityAuditTrail() {
  try {
    const stored = localStorage.getItem(AUDIT_TRAIL_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    }
    return [];
  } catch (err) {
    return [];
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
