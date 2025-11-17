const express = require('express');
const router = express.Router();
const providerController = require('../controllers/ProviderController');

// GET all providers
router.get('/', providerController.getProviders);

// GET single provider
router.get('/:id', providerController.getProviderById);

module.exports = router;