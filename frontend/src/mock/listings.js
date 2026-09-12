// Mock marketplace listings
// TODO: Replace with GET /api/listings

import { MOCK_VEHICLES } from './vehicles';

export const MOCK_LISTINGS = MOCK_VEHICLES.filter(v => v.verified).map(v => ({
  listingId: v.id,
  vehicleId: v.vehicleId,
  vehicle: v,
  price: v.listingPrice,
  seller: v.owner,
  sellerName: v.sellerName,
  location: v.location,
  listedAt: v.createdAt + 86400, // listed 1 day after creation
  active: true,
}));
