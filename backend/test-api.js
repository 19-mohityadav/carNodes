process.env.USE_MEMORY_DB = 'true';
process.env.JWT_SECRET = 'test_secret_key_123';

const http = require('http');
const app = require('./src/app');

let server;
let baseUrl;

async function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, baseUrl);
    const reqOpts = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };

    const req = http.request(url, reqOpts, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const json = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, body: json });
        } catch (e) {
          resolve({ status: res.statusCode, body: body });
        }
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  } else {
    console.log(`  ✓ ${message}`);
  }
}

async function runTests() {
  console.log('==================================================');
  console.log('  CarNodes API Verification Test Suite');
  console.log('==================================================\n');

  // Start HTTP server on random port
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://localhost:${port}`;
      console.log(`[Test Runner] Test server started on ${baseUrl}\n`);
      resolve();
    });
  });

  try {
    // 1. Health check
    console.log('1. Testing /api/health endpoint...');
    const healthRes = await request('/api/health');
    assert(healthRes.status === 200, 'Health endpoint status is 200');
    assert(healthRes.body.success === true, 'Health check returns success: true');
    assert(healthRes.body.service === 'CarNodes API', 'Health check service name matches');

    // 2. Register Seller
    console.log('\n2. Testing Seller registration...');
    const sellerRegRes = await request('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Alice Seller',
        email: 'seller@example.com',
        password: 'password123',
        role: 'SELLER',
        phone: '9876543210'
      }
    });
    assert(sellerRegRes.status === 201, 'Seller registration returns 201 Created');
    assert(sellerRegRes.body.data.user.role === 'SELLER', 'User role is SELLER');
    assert(sellerRegRes.body.data.token !== undefined, 'JWT token returned on registration');
    const sellerToken = sellerRegRes.body.data.token;
    const sellerId = sellerRegRes.body.data.user.id;

    // 3. Register Buyer
    console.log('\n3. Testing Buyer registration...');
    const buyerRegRes = await request('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Bob Buyer',
        email: 'buyer@example.com',
        password: 'password123',
        role: 'BUYER',
        phone: '9123456789'
      }
    });
    assert(buyerRegRes.status === 201, 'Buyer registration returns 201 Created');
    assert(buyerRegRes.body.data.user.role === 'BUYER', 'User role is BUYER');
    const buyerToken = buyerRegRes.body.data.token;
    const buyerId = buyerRegRes.body.data.user.id;

    // 4. Register Authority
    console.log('\n4. Testing Authority registration...');
    const authRegRes = await request('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Charlie Authority',
        email: 'authority@example.com',
        password: 'password123',
        role: 'AUTHORITY',
        phone: '9998887770'
      }
    });
    assert(authRegRes.status === 201, 'Authority registration returns 201 Created');
    assert(authRegRes.body.data.user.role === 'AUTHORITY', 'User role is AUTHORITY');
    const authorityToken = authRegRes.body.data.token;

    // 5. Login
    console.log('\n5. Testing user login...');
    const loginRes = await request('/api/auth/login', {
      method: 'POST',
      body: {
        email: 'seller@example.com',
        password: 'password123'
      }
    });
    assert(loginRes.status === 200, 'Login returns 200 OK');
    assert(loginRes.body.data.token !== undefined, 'Token returned on login');
    assert(loginRes.body.data.user.password_hash === undefined, 'Password hash is NOT exposed');

    // 6. Invalid login failure
    console.log('\n6. Testing invalid login failure...');
    const invalidLoginRes = await request('/api/auth/login', {
      method: 'POST',
      body: {
        email: 'seller@example.com',
        password: 'wrongpassword'
      }
    });
    assert(invalidLoginRes.status === 401, 'Invalid login returns 401 Unauthorized');
    assert(invalidLoginRes.body.success === false, 'Invalid login returns success: false');

    // 7. Unauthorized vehicle creation by BUYER
    console.log('\n7. Testing vehicle creation by BUYER (should fail 403)...');
    const buyerCreateRes = await request('/api/vehicles', {
      method: 'POST',
      headers: { Authorization: `Bearer ${buyerToken}` },
      body: {
        vin: 'VINBUYER001',
        registrationNumber: 'REG001',
        make: 'Honda',
        model: 'Civic',
        year: 2022,
        price: 1500000
      }
    });
    assert(buyerCreateRes.status === 403, 'Buyer vehicle creation returns 403 Forbidden');

    // 8. Seller creates vehicle
    console.log('\n8. Testing vehicle creation by SELLER...');
    const createVehicleRes = await request('/api/vehicles', {
      method: 'POST',
      headers: { Authorization: `Bearer ${sellerToken}` },
      body: {
        vin: 'CAR123456789',
        registrationNumber: 'WB12AB1234',
        make: 'Toyota',
        model: 'Fortuner',
        year: 2024,
        price: 3500000,
        description: 'Well maintained SUV'
      }
    });
    assert(createVehicleRes.status === 201, 'Seller vehicle creation returns 201 Created');
    const vehicle = createVehicleRes.body.data.vehicle;
    assert(vehicle.verification_status === 'PENDING', 'Initial verification status is PENDING');
    assert(vehicle.listing_status === 'UNLISTED', 'Initial listing status is UNLISTED');
    assert(vehicle.seller_id === sellerId, 'Seller ID matches authenticated user');
    const vehicleId = vehicle.id;

    // 9. Document creation by Seller
    console.log('\n9. Testing document metadata creation by SELLER...');
    const docRes = await request(`/api/vehicles/${vehicleId}/documents`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${sellerToken}` },
      body: {
        documentType: 'RC',
        fileName: 'vehicle-rc.pdf'
      }
    });
    assert(docRes.status === 201, 'Document metadata creation returns 201 Created');
    assert(docRes.body.data.document.document_type === 'RC', 'Document type matches');

    // 10. Document retrieval
    console.log('\n10. Testing document metadata retrieval...');
    const getDocsRes = await request(`/api/vehicles/${vehicleId}/documents`, {
      headers: { Authorization: `Bearer ${sellerToken}` }
    });
    assert(getDocsRes.status === 200, 'Get documents returns 200 OK');
    assert(getDocsRes.body.data.documents.length === 1, 'Document list contains 1 item');

    // 11. Listing unverified vehicle by SELLER (should fail 400)
    console.log('\n11. Testing listing an unverified vehicle (should fail 400)...');
    const listUnverifiedRes = await request(`/api/vehicles/${vehicleId}/list`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${sellerToken}` },
      body: { listingStatus: 'LISTED' }
    });
    assert(listUnverifiedRes.status === 400, 'Listing unverified vehicle returns 400 Bad Request');

    // 12. Non-authority verification attempt (should fail 403)
    console.log('\n12. Testing verification by SELLER (should fail 403)...');
    const sellerVerifyRes = await request(`/api/vehicles/${vehicleId}/verify`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${sellerToken}` },
      body: { verificationStatus: 'VERIFIED', notes: 'Unauthorized verify' }
    });
    assert(sellerVerifyRes.status === 403, 'Seller verification attempt returns 403 Forbidden');

    // 13. Authority verifies vehicle
    console.log('\n13. Testing vehicle verification by AUTHORITY...');
    const verifyRes = await request(`/api/vehicles/${vehicleId}/verify`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${authorityToken}` },
      body: {
        verificationStatus: 'VERIFIED',
        notes: 'Documents and physical inspection verified'
      }
    });
    assert(verifyRes.status === 200, 'Authority verification returns 200 OK');
    assert(verifyRes.body.data.vehicle.verification_status === 'VERIFIED', 'Status updated to VERIFIED');

    // 14. Seller lists verified vehicle
    console.log('\n14. Testing vehicle listing by SELLER after verification...');
    const listRes = await request(`/api/vehicles/${vehicleId}/list`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${sellerToken}` },
      body: { listingStatus: 'LISTED' }
    });
    assert(listRes.status === 200, 'Listing verified vehicle returns 200 OK');
    assert(listRes.body.data.vehicle.listing_status === 'LISTED', 'Listing status updated to LISTED');

    // 15. Buyer views marketplace vehicles
    console.log('\n15. Testing marketplace vehicle retrieval by BUYER...');
    const getVehiclesRes = await request('/api/vehicles?status=LISTED');
    assert(getVehiclesRes.status === 200, 'Get marketplace vehicles returns 200 OK');
    assert(getVehiclesRes.body.data.vehicles.length >= 1, 'Marketplace vehicles list contains listed vehicle');

    // 16. Unauthorized transfer by SELLER (should fail 403)
    console.log('\n16. Testing vehicle transfer by SELLER (should fail 403)...');
    const sellerTransferRes = await request(`/api/vehicles/${vehicleId}/transfer`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${sellerToken}` }
    });
    assert(sellerTransferRes.status === 403, 'Seller transfer attempt returns 403 Forbidden');

    // 17. Buyer transfers ownership
    console.log('\n17. Testing ownership transfer by BUYER...');
    const transferRes = await request(`/api/vehicles/${vehicleId}/transfer`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${buyerToken}` }
    });
    assert(transferRes.status === 200, 'Ownership transfer returns 200 OK');
    assert(transferRes.body.data.vehicle.listing_status === 'SOLD', 'Vehicle status updated to SOLD');
    assert(transferRes.body.data.vehicle.current_owner_id === buyerId, 'Current owner updated to BUYER');
    assert(transferRes.body.data.blockchainStatus === 'PENDING', 'blockchainStatus returns PENDING');

    // 18. Duplicate VIN creation failure
    console.log('\n18. Testing duplicate VIN creation failure (should fail 409)...');
    const dupVinRes = await request('/api/vehicles', {
      method: 'POST',
      headers: { Authorization: `Bearer ${sellerToken}` },
      body: {
        vin: 'CAR123456789', // duplicate VIN
        registrationNumber: 'REG999',
        make: 'Toyota',
        model: 'Camry',
        year: 2023,
        price: 2000000
      }
    });
    assert(dupVinRes.status === 409, 'Duplicate VIN creation returns 409 Conflict');

    // 19. Duplicate Registration Number creation failure
    console.log('\n19. Testing duplicate registration number creation failure (should fail 409)...');
    const dupRegRes = await request('/api/vehicles', {
      method: 'POST',
      headers: { Authorization: `Bearer ${sellerToken}` },
      body: {
        vin: 'VINNEW123456',
        registrationNumber: 'WB12AB1234', // duplicate Reg Num
        make: 'Toyota',
        model: 'Camry',
        year: 2023,
        price: 2000000
      }
    });
    assert(dupRegRes.status === 409, 'Duplicate registration number creation returns 409 Conflict');

    // 20. Blockchain info endpoint
    console.log('\n20. Testing /api/blockchain/info endpoint...');
    const bcInfoRes = await request('/api/blockchain/info');
    assert(bcInfoRes.status === 200, 'Blockchain info endpoint status is 200');
    assert(bcInfoRes.body.success === true, 'Blockchain info returns success: true');
    assert(bcInfoRes.body.data.contracts.VehiclePassport !== undefined, 'VehiclePassport contract address present');
    assert(bcInfoRes.body.data.contracts.VehicleRegistry !== undefined, 'VehicleRegistry contract address present');
    assert(bcInfoRes.body.data.contracts.VehicleEscrow !== undefined, 'VehicleEscrow contract address present');
    assert(bcInfoRes.body.data.contracts.MockINR !== undefined, 'MockINR contract address present');

    console.log('\n==================================================');
    console.log(' 🎉 ALL 20 API VERIFICATION TESTS PASSED SUCCESSFULLY!');
    console.log('==================================================');

  } catch (error) {
    console.error('\n❌ Test suite failed:', error);
    process.exitCode = 1;
  } finally {
    if (server) {
      server.close();
    }
  }
}

runTests();
