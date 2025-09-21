const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const Comment = require('../models/Comment');
const Post = require('../models/Post');

// @desc    Get comments for a post
// @route   GET /api/posts/:postId/comments
// @access  Public
exports.getComments = asyncHandler(async (req, res, next) => {
  const comments = await Comment.find({ 
    post: req.params.postId,
    parentComment: null // Only get top-level comments
  })
  .populate('author', 'username avatar')
  .populate({
    path: 'replies',
    populate: {
      path: 'author',
      select: 'username avatar'
    }
  });

  res.status(200).json({
    success: true,
    count: comments.length,
    data: comments
  });
});

// @desc    Add comment to post
// @route   POST /api/posts/:postId/comments
// @access  Private
exports.addComment = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.postId);

  if (!post) {
    return next(
      new ErrorResponse(`No post with the id of ${req.params.postId}`, 404)
    );
  }

  // Add user to req.body
  req.body.author = req.user.id;
  req.body.post = req.params.postId;

  const comment = await Comment.create(req.body);

  // Add comment to post
  post.comments.push(comment._id);
  await post.save();

  // Populate author details
  await comment.populate('author', 'username avatar').execPopulate();

  res.status(201).json({
    success: true,
    data: comment
  });
});

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
exports.updateComment = asyncHandler(async (req, res, next) => {
  let comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(
      new ErrorResponse(`No comment with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is comment owner or admin
  if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this comment`,
        401
      )
    );
  }

  comment = await Comment.findByIdAndUpdate(
    req.params.id,
    { 
      content: req.body.content,
      isEdited: true
    },
    {
      new: true,
      runValidators: true
    }
  )
  .populate('author', 'username avatar');

  res.status(200).json({
    success: true,
    data: comment
  });
});

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
exports.deleteComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(
      new ErrorResponse(`No comment with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is comment owner or admin
  if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this comment`,
        401
      )
    );
  }

  // Remove comment from post
  await Post.findByIdAndUpdate(comment.post, {
    $pull: { comments: comment._id }
  });

  // Delete comment and its replies
  await Comment.deleteMany({
    $or: [
      { _id: comment._id },
      { parentComment: comment._id }
    ]
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Reply to comment
// @route   POST /api/comments/:id/replies
// @access  Private
exports.addReply = asyncHandler(async (req, res, next) => {
  const parentComment = await Comment.findById(req.params.id);
  
  if (!parentComment) {
    return next(
      new ErrorResponse(`No comment with the id of ${req.params.id}`, 404)
    );
  }

  // Add user, post, and parent comment to req.body
  req.body.author = req.user.id;
  req.body.post = parentComment.post;
  req.body.parentComment = req.params.id;

  const reply = await Comment.create(req.body);
  
  // Populate author details
  await reply.populate('author', 'username avatar').execPopulate();

  res.status(201).json({
    success: true,
    data: reply
  });
});

// @desc    Like a comment
// @route   PUT /api/comments/:id/like
// @access  Private
exports.likeComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(
      new ErrorResponse(`No comment with the id of ${req.params.id}`, 404)
    );
  }

  // Check if the comment has already been liked
  if (comment.likes.includes(req.user.id)) {
    return next(new ErrorResponse('Comment already liked', 400));
  }

  comment.likes.push(req.user.id);
  await comment.save();

  res.status(200).json({
    success: true,
    data: comment.likes
  });
});

// @desc    Unlike a comment
// @route   PUT /api/comments/:id/unlike
// @access  Private
exports.unlikeComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(
      new ErrorResponse(`No comment with the id of ${req.params.id}`, 404)
    );
  }

  // Check if the comment has been liked
  if (!comment.likes.includes(req.user.id)) {
    return next(new ErrorResponse('Comment has not been liked', 400));
  }

  comment.likes = comment.likes.filter(
    (like) => like.toString() !== req.user.id.toString()
  );
  
  await comment.save();

  res.status(200).json({
    success: true,
    data: comment.likes
  });
});
