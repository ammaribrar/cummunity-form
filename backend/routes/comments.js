const express = require('express');
const {
  getComments,
  addComment,
  updateComment,
  deleteComment,
  addReply,
  likeComment,
  unlikeComment,
} = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

// Public routes
router.get('/', getComments);

// Protected routes
router.use(protect);

router.post('/', addComment);
router.put('/:id', updateComment);
router.delete('/:id', deleteComment);
router.post('/:id/replies', addReply);
router.put('/:id/like', likeComment);
router.put('/:id/unlike', unlikeComment);

module.exports = router;
