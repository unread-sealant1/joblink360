const express = require('express');
const { adminLogin, getAllUsers, deleteUserAdmin, getAllJobs, deleteJobAdmin, getDashboardStats } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');
const router = express.Router();

router.post('/login', adminLogin);
router.get('/stats', protect, admin, getDashboardStats);
router.get('/users', protect, admin, getAllUsers);
router.delete('/users/:id', protect, admin, deleteUserAdmin);
router.get('/jobs', protect, admin, getAllJobs);
router.delete('/jobs/:id', protect, admin, deleteJobAdmin);

module.exports = router;