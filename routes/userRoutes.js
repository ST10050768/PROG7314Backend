const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { syncFirebaseUser } = require('../controllers/UserController');
const { deleteCustomerAccount } = require('../controllers/UserController');

router.post('/sync', auth, syncFirebaseUser);
router.delete('/me', auth, deleteCustomerAccount);


module.exports = router;