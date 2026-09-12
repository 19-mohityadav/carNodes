const express = require('express');
const router = express.Router({ mergeParams: true });
const documentController = require('../controllers/document.controller');
const { authenticate, requireRole } = require('../middleware/auth');

router.post('/', authenticate, requireRole('SELLER'), documentController.addDocument);
router.get('/', authenticate, documentController.getDocuments);

module.exports = router;
