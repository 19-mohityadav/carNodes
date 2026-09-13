import { VEHICLES } from '../data/vehicles';
import { MOCK_AUTHORITY_DATA, MOCK_SELLER_DATA } from '../data/dashboardData';

const CUSTOM_VEHICLES_KEY = 'carnodes_custom_vehicles';
const QUEUE_KEY = 'carnodes_verification_queue';
const AUDIT_TRAIL_KEY = 'carnodes_authority_audit_trail';

// Helper to broadcast store updates
function broadcastEvent(eventName, detail) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
  }
}

/**
 * Get all vehicles (baseline + custom user created)
 */
export function getAllVehicles() {
  try {
    const custom = JSON.parse(localStorage.getItem(CUSTOM_VEHICLES_KEY) || '[]');
    const baselineIds = new Set(custom.map(v => v.id));
    return [...custom, ...VEHICLES.filter(v => !baselineIds.has(v.id))];
  } catch (err) {
    console.warn('Error reading custom vehicles from localStorage:', err);
    return VEHICLES;
  }
}

/**
 * Add a newly minted vehicle (from Seller)
 */
export function addCustomVehicle(newCar) {
  try {
    const existing = JSON.parse(localStorage.getItem(CUSTOM_VEHICLES_KEY) || '[]');
    const updated = [newCar, ...existing.filter(c => c.id !== newCar.id)];
    localStorage.setItem(CUSTOM_VEHICLES_KEY, JSON.stringify(updated));

    // Also automatically queue for Authority verification
    const queueItem = {
      id: `VQ-${Date.now().toString().slice(-4)}`,
      vehicleId: newCar.id,
      vehicleName: newCar.name || `${newCar.year} ${newCar.make} ${newCar.model}`,
      vin: newCar.vin || `VIN-${newCar.id}`,
      registrationNo: newCar.registration || 'MH 02 ER ' + Math.floor(1000 + Math.random() * 9000),
      ownerName: newCar.ownerName || 'Seller (Current User)',
      ownerType: 'Individual Seller',
      verificationType: 'Digital Passport Verification & Title Seal',
      submittedDate: 'Just now',
      risk: 'LOW',
      riskScore: newCar.trustScore || 95,
      status: 'Pending',
      documentsCount: 4,
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
      // Find from baseline
      const base = VEHICLES.find(v => v.id === vehicleId) || { id: vehicleId };
      updated = [{ ...base, ...updates }, ...existing];
    }
    localStorage.setItem(CUSTOM_VEHICLES_KEY, JSON.stringify(updated));
    broadcastEvent('carnodes_vehicles_updated', updated);
  } catch (err) {
    console.warn('Failed to update vehicle:', err);
  }
}

/**
 * Get Authority Verification Queue
 */
export function getVerificationQueue() {
  try {
    const stored = localStorage.getItem(QUEUE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return MOCK_AUTHORITY_DATA.verificationQueue;
  } catch (err) {
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
      if (item.id === itemId) {
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
