// Mock vehicle data for demo/development
// TODO: Replace with API calls to GET /api/vehicles and GET /api/vehicles/:id

export const MOCK_VEHICLES = [
  {
    id: 1,
    vehicleId: '1',
    vin: 'MA3FJEF1S00135201',
    vinHash: '0x3b4a9f2e1c7d8a6b5e2f9a0c3d1e4b7f8a2c5d9e0f3b6a1c4e7d2f5a8b0c3',
    make: 'Maruti Suzuki',
    model: 'Swift VXI',
    year: 2021,
    color: 'Pearl Arctic White',
    fuelType: 'Petrol',
    transmission: 'Manual',
    odometer: 32450,
    registrationNo: 'KA 01 AB 1234',
    metadataCID: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
    owner: '0x742d35Cc6634C0532925a3b8D4C9b8B4C3d5e2f1',
    verifier: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    riskScore: 15,
    verified: true,
    createdAt: 1720000000,
    listingPrice: '850000000000000000000000', // 850,000 MockINR
    sellerName: 'Rajesh Kumar',
    location: 'Bangalore, Karnataka',
    description: 'Well-maintained first-owner vehicle. Full service history available. No accidents. All documents clear.',
    evidence: [
      { cid: 'QmRCDoc123...', type: 'RC Certificate', addedAt: 1720001000 },
      { cid: 'QmInsurance456...', type: 'Insurance', addedAt: 1720002000 },
      { cid: 'QmInspection789...', type: 'Inspection Report', addedAt: 1720003000 },
    ],
    ownershipHistory: [
      { from: '0x0000000000000000000000000000000000000000', to: '0x742d35Cc...', txHash: '0xabc123...', timestamp: 1695000000, event: 'Original Registration' },
      { from: '0x9f8e7d6c...', to: '0x742d35Cc...', txHash: '0xdef456...', timestamp: 1720000000, event: 'Ownership Transfer' },
    ],
    txHash: '0xabc123def456789012345678901234567890abcdef1234567890abcdef123456',
  },
  {
    id: 2,
    vehicleId: '2',
    vin: 'MBLFA5AA1KF123456',
    vinHash: '0x5c8d1a3e9f2b7c4a6d0e8f1b5c9d3a7e2f6b0c4d8a1e5f9b3c7d1a5e9f2b6',
    make: 'Honda',
    model: 'City ZX CVT',
    year: 2022,
    color: 'Radiant Red Metallic',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    odometer: 18200,
    registrationNo: 'MH 02 CD 5678',
    metadataCID: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG',
    owner: '0x8f3b2c1d4e5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c',
    verifier: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    riskScore: 8,
    verified: true,
    createdAt: 1722000000,
    listingPrice: '1350000000000000000000000', // 1,350,000 MockINR
    sellerName: 'Priya Sharma',
    location: 'Mumbai, Maharashtra',
    description: 'Single owner, company maintained vehicle. Genuine low mileage. All service records available at authorized Honda service center.',
    evidence: [
      { cid: 'QmRCDoc789...', type: 'RC Certificate', addedAt: 1722001000 },
      { cid: 'QmInsurance012...', type: 'Insurance', addedAt: 1722002000 },
    ],
    ownershipHistory: [
      { from: '0x0000000000000000000000000000000000000000', to: '0x8f3b2c1d...', txHash: '0xghi789...', timestamp: 1720500000, event: 'Original Registration' },
    ],
    txHash: '0xdef456abc123789012345678901234567890abcdef1234567890abcdef654321',
  },
  {
    id: 3,
    vehicleId: '3',
    vin: 'TMBFE61J9H4012345',
    vinHash: '0x7a2c5e8b1d4f7a0c3e6b9d2f5a8c1e4b7d0f3a6c9e2b5d8f1a4c7e0b3d6f9',
    make: 'Tata Motors',
    model: 'Nexon EV Max',
    year: 2023,
    color: 'Intensi-Teal',
    fuelType: 'Electric',
    transmission: 'Automatic',
    odometer: 9800,
    registrationNo: 'DL 3C EF 9012',
    metadataCID: 'QmZBdcCJdDaS8w3VoNiJRkN3VGkHfR92VNKGkA5sGbkCqP',
    owner: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
    verifier: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    riskScore: 5,
    verified: true,
    createdAt: 1724000000,
    listingPrice: '1750000000000000000000000', // 1,750,000 MockINR
    sellerName: 'Arun Mehta',
    location: 'New Delhi, Delhi',
    description: 'Near-new EV with full warranty remaining. Battery health at 98%. Includes home charger. Zero emissions, zero worries.',
    evidence: [
      { cid: 'QmEVBattery123...', type: 'Battery Health Report', addedAt: 1724001000 },
      { cid: 'QmRCEV456...', type: 'RC Certificate', addedAt: 1724002000 },
      { cid: 'QmWarranty789...', type: 'Warranty Certificate', addedAt: 1724003000 },
    ],
    ownershipHistory: [
      { from: '0x0000000000000000000000000000000000000000', to: '0x3c4d5e6f...', txHash: '0xjkl012...', timestamp: 1724000000, event: 'Original Registration' },
    ],
    txHash: '0xghi789abc123456012345678901234567890abcdef1234567890abcdef789012',
  },
  {
    id: 4,
    vehicleId: '4',
    vin: 'MBLFA8AH1GF234567',
    vinHash: '0x9b4d7f2a5c8e1b4d7f0a3c6e9b2d5f8a1c4e7b0d3f6a9c2e5b8d1f4a7c0e3',
    make: 'Hyundai',
    model: 'Creta SX(O) Diesel',
    year: 2020,
    color: 'Typhoon Silver',
    fuelType: 'Diesel',
    transmission: 'Manual',
    odometer: 67300,
    registrationNo: 'TN 09 GH 3456',
    metadataCID: 'QmAbCdEfGhIjKlMnOpQrStUvWxYz1234567890abcdefghij',
    owner: '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f',
    verifier: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    riskScore: 35,
    verified: false, // Pending verification
    createdAt: 1718000000,
    listingPrice: '980000000000000000000000', // 980,000 MockINR
    sellerName: 'Vikram Nair',
    location: 'Chennai, Tamil Nadu',
    description: 'Four-year-old Creta in excellent condition. Regular servicing done. Minor scratches on rear bumper. Price negotiable.',
    evidence: [
      { cid: 'QmRCCreta123...', type: 'RC Certificate', addedAt: 1718001000 },
    ],
    ownershipHistory: [
      { from: '0x0000000000000000000000000000000000000000', to: '0x5e6f7a8b...', txHash: '0xmno345...', timestamp: 1580000000, event: 'Original Registration' },
    ],
    txHash: '0xjkl012def456789012345678901234567890abcdef1234567890abcdef012345',
  },
];

export function getVehicleById(id) {
  return MOCK_VEHICLES.find(v => String(v.id) === String(id) || v.vehicleId === String(id));
}

export function getVerifiedVehicles() {
  return MOCK_VEHICLES.filter(v => v.verified);
}

export function getPendingVehicles() {
  return MOCK_VEHICLES.filter(v => !v.verified);
}
