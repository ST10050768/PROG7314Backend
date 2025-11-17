const express = require('express');
const router = express.Router();
const { getAllCategories } = require('../controllers/CategoryController');

router.get('/', getAllCategories);

module.exports = router;