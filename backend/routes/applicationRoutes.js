const express = require('express');
const {
  createApplication,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus
} = require('../controllers/applicationController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateToken, createApplication);
router.get('/my', authenticateToken, getMyApplications);
router.get('/', authenticateToken, authorizeRoles('admin'), getAllApplications);
router.patch('/:id/status', authenticateToken, authorizeRoles('admin'), updateApplicationStatus);

module.exports = router;
