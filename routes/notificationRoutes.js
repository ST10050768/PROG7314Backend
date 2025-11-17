const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/NotificationController');

router.post('/refresh-token', NotificationController.refreshToken);

module.exports = router;