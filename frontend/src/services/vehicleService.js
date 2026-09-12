import { supabase } from './supabaseClient';

/**
 * Register a new vehicle via Supabase Edge Function (interacts with Pinata IPFS & Sepolia VehicleRegistry)
 */
export async function createVehicle(payload) {
  const { data, error } = await supabase.functions.invoke('create-vehicle', {
    body: payload,
    method: 'POST',
  });

  if (error) {
    console.error('Error invoking create-vehicle:', error);
    throw error;
  }
  return data;
}

/**
 * Verify vehicle and mint Digital Passport NFT on Sepolia via Supabase Edge Function
 */
export async function verifyVehicle(vin, riskScore = 15, inspectionNotes = 'Passed inspection') {
  const { data, error } = await supabase.functions.invoke('verify-vehicle', {
    body: { vin, riskScore, inspectionNotes },
    method: 'POST',
  });

  if (error) {
    console.error('Error invoking verify-vehicle:', error);
    throw error;
  }
  return data;
}

/**
 * Upload document to IPFS via Pinata and record in Supabase
 */
export async function uploadDocument({ vehicleId, docType, fileName, file }) {
  // Convert File / Blob to base64
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const contentBase64 = btoa(binary);

  const { data, error } = await supabase.functions.invoke('upload-document', {
    body: {
      vehicleId,
      docType,
      fileName: fileName || file.name,
      contentBase64,
    },
    method: 'POST',
  });

  if (error) {
    console.error('Error invoking upload-document:', error);
    throw error;
  }
  return data;
}

/**
 * Add a service or maintenance record and record evidence on-chain
 */
export async function addRecord(payload) {
  const { data, error } = await supabase.functions.invoke('add-record', {
    body: payload,
    method: 'POST',
  });

  if (error) {
    console.error('Error invoking add-record:', error);
    throw error;
  }
  return data;
}

/**
 * Fetch list of all vehicles directly from Supabase PostgreSQL
 */
export async function getVehicles(filters = {}) {
  let query = supabase.from('vehicles').select('*, current_owner:user_profiles(*)');

  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  if (filters.manufacturer) {
    query = query.ilike('manufacturer', `%${filters.manufacturer}%`);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

/**
 * Fetch full vehicle passport history (records, documents, risk score)
 */
export async function getVehicleDetails(vinOrId) {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(vinOrId);
  const column = isUuid ? 'id' : 'vin';

  const { data: vehicle, error: vError } = await supabase
    .from('vehicles')
    .select('*, current_owner:user_profiles(*)')
    .eq(column, vinOrId)
    .single();

  if (vError) throw vError;

  const [recordsRes, docsRes, riskRes] = await Promise.all([
    supabase.from('vehicle_records').select('*').eq('vehicle_id', vehicle.id).order('record_date', { ascending: false }),
    supabase.from('vehicle_documents').select('*').eq('vehicle_id', vehicle.id).order('uploaded_at', { ascending: false }),
    supabase.from('ai_risk_assessments').select('*').eq('vehicle_id', vehicle.id).order('created_at', { ascending: false }).limit(1),
  ]);

  return {
    ...vehicle,
    records: recordsRes.data || [],
    documents: docsRes.data || [],
    riskAssessment: riskRes.data?.[0] || null,
  };
}
