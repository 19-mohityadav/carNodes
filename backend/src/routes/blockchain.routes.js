const express = require('express');
const router = express.Router();
const blockchainController = require('../controllers/blockchain.controller');

// Public route to get smart contract addresses & network status
router.get('/info', blockchainController.getBlockchainInfo);

module.exports = router;
