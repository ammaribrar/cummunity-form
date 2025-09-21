const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserProfile,
  updateProfile,
  updatePassword,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// User profile routes
router.get('/me', getUserProfile);
router.put('/me/update', updateProfile);
router.put('/me/updatepassword', updatePassword);

// Admin routes
router.use(authorize('admin'));
router
  .route('/')
  .get(getUsers)
  .post(createUser);

router
  .route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
