const express = require('express');
const router = express.Router();
const {
  getServicesByCategory,
  getServiceById
} = require('../controllers/ServiceController');

router.get('/category/:categoryId', getServicesByCategory);
router.get('/:id', getServiceById);

module.exports = router;