const express = require('express');
const { sendConnectionRequest, respondToConnection, getConnections, getNetworkUsers } = require('../controllers/connectionController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/send', protect, sendConnectionRequest);
router.post('/respond', protect, respondToConnection);
router.get('/', protect, getConnections);
router.get('/network', protect, getNetworkUsers);

module.exports = router;