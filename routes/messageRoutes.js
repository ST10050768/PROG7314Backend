const express = require('express');
const router = express.Router();
const messageController = require('../controllers/MessageController');

// Create a new thread
router.post('/thread', messageController.createThread);

// GET messages for a thread
router.get('/thread/:threadId', messageController.getMessages);

// POST send a message
router.post('/send', messageController.sendMessage);

router.patch('/:messageId/seen', messageController.markMessageSeen);


module.exports = router;