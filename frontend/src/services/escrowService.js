import { supabase } from './supabaseClient';

/**
 * Initiate an escrow transaction via Supabase Edge Function
 */
export async function initiateEscrow(payload) {
  const { data, error } = await supabase.functions.invoke('initiate-escrow', {
    body: payload,
    method: 'POST',
  });

  if (error) {
    console.error('Error invoking initiate-escrow:', error);
    throw error;
  }
  return data;
}

/**
 * Release escrow funds and transfer ownership on-chain & in database
 */
export async function releaseEscrow({ escrowId, onchainEscrowId }) {
  const { data, error } = await supabase.functions.invoke('release-escrow', {
    body: { escrowId, onchainEscrowId },
    method: 'POST',
  });

  if (error) {
    console.error('Error invoking release-escrow:', error);
    throw error;
  }
  return data;
}

/**
 * Fetch marketplace listings
 */
export async function getMarketplaceListings() {
  const { data, error } = await supabase
    .from('marketplace_listings')
    .select('*, vehicle:vehicles(*), seller:user_profiles(*)')
    .eq('status', 'ACTIVE')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Fetch escrow transactions for current user (as buyer or seller)
 */
export async function getUserEscrows(userId) {
  const { data, error } = await supabase
    .from('escrow_transactions')
    .select('*, vehicle:vehicles(*), seller:user_profiles!seller_id(*), buyer:user_profiles!buyer_id(*)')
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
