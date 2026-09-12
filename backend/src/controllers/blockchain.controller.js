const blockchainService = require('../services/blockchain.service');

const getBlockchainInfo = async (req, res, next) => {
  try {
    const info = await blockchainService.getNetworkInfo();
    res.status(200).json({
      success: true,
      message: 'Blockchain node and contract deployment info retrieved successfully',
      data: info
    });
  } catch (error) {
    next(error);
  }
};

const syncVehicleBlockchain = async (req, res, next) => {
  try {
    const { txHash, tokenId, ipfsCid } = req.body;
    const vehicle = await blockchainService.syncVehicleOnChain(req.params.id, { txHash, tokenId, ipfsCid });
    res.status(200).json({
      success: true,
      message: 'Vehicle blockchain state updated successfully',
      data: { vehicle }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBlockchainInfo,
  syncVehicleBlockchain
};
