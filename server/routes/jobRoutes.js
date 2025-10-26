const express = require('express');
const { createJob, getJobs, getJobById, updateJob, deleteJob, applyToJob } = require('../controllers/jobController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/', protect, createJob);
router.get('/', getJobs);
router.get('/:id', getJobById);
router.put('/:id', protect, updateJob);
router.delete('/:id', protect, deleteJob);
router.post('/:id/apply', protect, applyToJob);

module.exports = router;