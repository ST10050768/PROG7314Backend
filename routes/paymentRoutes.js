const express = require('express');
const router = express.Router();
const { initiateMockPayment } = require('../controllers/PaymentController');

router.post('/mock', initiateMockPayment);

module.exports = router;