const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle.controller');
const { authenticate, requireRole } = require('../middleware/auth');
const documentRoutes = require('./document.routes');

// Public / Marketplace routes
router.get('/', vehicleController.getAllVehicles);
router.get('/:id', vehicleController.getVehicleById);

// Protected routes
router.post('/', authenticate, requireRole('SELLER', 'AUTHORITY'), vehicleController.createVehicle);
router.patch('/:id/verify', authenticate, requireRole('AUTHORITY'), vehicleController.verifyVehicle);
router.patch('/:id/list', authenticate, requireRole('SELLER'), vehicleController.updateListingStatus);
router.post('/:id/transfer', authenticate, requireRole('BUYER'), vehicleController.transferOwnership);

// Mount Document sub-routes under /api/vehicles/:id/documents
router.use('/:id/documents', documentRoutes);

module.exports = router;
