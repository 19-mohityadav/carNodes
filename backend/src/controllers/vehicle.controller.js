const vehicleService = require('../services/vehicle.service');

const getAllVehicles = async (req, res, next) => {
  try {
    const filters = {
      status: req.query.status,
      verified: req.query.verified
    };
    const vehicles = await vehicleService.getVehicles(filters);
    res.status(200).json({
      success: true,
      message: 'Vehicles retrieved successfully',
      data: { vehicles }
    });
  } catch (error) {
    next(error);
  }
};

const getVehicleById = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.getVehicleById(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Vehicle details retrieved successfully',
      data: { vehicle }
    });
  } catch (error) {
    next(error);
  }
};

const createVehicle = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.createVehicle(req.body, req.user);
    res.status(201).json({
      success: true,
      message: 'Vehicle created successfully',
      data: { vehicle }
    });
  } catch (error) {
    next(error);
  }
};

const verifyVehicle = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.verifyVehicle(req.params.id, req.body, req.user);
    res.status(200).json({
      success: true,
      message: `Vehicle verification status updated to ${vehicle.verification_status}`,
      data: { vehicle }
    });
  } catch (error) {
    next(error);
  }
};

const updateListingStatus = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.updateListingStatus(req.params.id, req.body, req.user);
    res.status(200).json({
      success: true,
      message: `Vehicle listing status updated to ${vehicle.listing_status}`,
      data: { vehicle }
    });
  } catch (error) {
    next(error);
  }
};

const transferOwnership = async (req, res, next) => {
  try {
    const result = await vehicleService.transferOwnership(req.params.id, req.user);
    res.status(200).json({
      success: true,
      message: 'Ownership transferred successfully in database. Blockchain synchronization pending.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  verifyVehicle,
  updateListingStatus,
  transferOwnership
};
