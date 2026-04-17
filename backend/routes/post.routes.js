// backend/routes/post.routes.js
const express = require('express');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth.middleware');
const { memberOrAdmin } = require('../middleware/role.middleware');
const upload = require('../middleware/upload');

const router = express.Router();

// GET /api/posts — Public: all published posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({ status: 'published' })
      .populate('author', 'name profilePic')
      .populate('upvotes', 'name')
      .populate('downvotes', 'name')
      .populate('commentCount')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/posts/:id — Public: single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name profilePic').populate('upvotes', 'name').populate('downvotes', 'name').populate('commentCount');
    if (!post || post.status === 'removed') return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/posts — create new post (member/admin)
router.post('/', protect, memberOrAdmin, upload.single('image'), async (req, res) => {
  try {
    const { title, body } = req.body;
    const image = req.file ? req.file.filename : '';

    const post = await Post.create({
      title,
      body,
      image,
      author: req.user._id
    });

    await post.populate('author', 'name profilePic');
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/posts/:id — edit post (owner or admin)
router.put('/:id', protect, memberOrAdmin, upload.single('image'), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const isOwner = post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Not authorized' });

    if (req.body.title) post.title = req.body.title;
    if (req.body.body) post.body = req.body.body;
    if (req.file) post.image = req.file.filename;

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/posts/:id — delete post (owner or admin)
router.delete('/:id', protect, memberOrAdmin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const isOwner = post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) return res.status(403).json({ message: 'Not authorized' });

    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/posts/:id/vote — toggle vote (member/admin)
router.post('/:id/vote', protect, memberOrAdmin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const userId = req.user._id;
    const { vote } = req.body; // 'up' or 'down'

    if (vote === 'up') {
      if (post.upvotes.includes(userId)) {
        post.upvotes.pull(userId);
      } else {
        post.upvotes.push(userId);
        post.downvotes.pull(userId); // remove downvote if exists
      }
    } else if (vote === 'down') {
      if (post.downvotes.includes(userId)) {
        post.downvotes.pull(userId);
      } else {
        post.downvotes.push(userId);
        post.upvotes.pull(userId); // remove upvote if exists
      }
    }

    await post.save();
    await post.populate('upvotes', 'name');
    await post.populate('downvotes', 'name');

    const score = post.upvotes.length - post.downvotes.length;
    res.json({ upvotes: post.upvotes, downvotes: post.downvotes, score });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;