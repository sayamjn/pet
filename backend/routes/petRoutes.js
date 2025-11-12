const express = require('express');
const {
  getPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
  updatePetStatus
} = require('../controllers/petController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.get('/', getPets);
router.get('/:id', getPetById);
router.post('/', authenticateToken, authorizeRoles('admin'), createPet);
router.put('/:id', authenticateToken, authorizeRoles('admin'), updatePet);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deletePet);
router.patch('/:id/status', authenticateToken, authorizeRoles('admin'), updatePetStatus);

module.exports = router;
