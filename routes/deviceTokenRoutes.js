const express = require('express');
const router = express.Router();
const deviceTokenController = require('../controllers/DeviceTokenController');

// Register a device token
router.post('/register', deviceTokenController.registerToken);

// Remove a device token
router.post('/remove', deviceTokenController.removeToken);

module.exports = router;