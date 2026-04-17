const express = require("express");
const {
  createBlog, getAllBlogs, getAdminBlogs, getFeaturedBlogs, getTrendingBlogs,
  getSingleBlog, updateBlog, deleteBlog, likeBlog, addComment, deleteComment,
  approveComment, incrementViews, getBlogsByUser, getMyBlogs, getMyBookmarks,
  toggleBookmark, getRelatedBlogs, approveBlog, getBlogStats
} = require("../controller/blogController");
const { protect, adminOnly, editorOrAbove, canPublish } = require("../middleware/authMiddleware");
const router = express.Router();

// PUBLIC
router.get("/", getAllBlogs);
router.get("/featured", getFeaturedBlogs);
router.get("/trending", getTrendingBlogs);
router.get("/user/:userId", getBlogsByUser);
router.get("/:id/related", getRelatedBlogs);
router.get("/:id", getSingleBlog);
router.put("/:id/view", incrementViews);

// PROTECTED USER
router.post("/", protect, canPublish, createBlog);
router.put("/:id", protect, updateBlog);
router.delete("/:id", protect, deleteBlog);
router.put("/:id/like", protect, likeBlog);
router.put("/:id/bookmark", protect, toggleBookmark);
router.post("/:id/comment", protect, addComment);
router.delete("/:blogId/comment/:commentId", protect, deleteComment);
router.get("/my/posts", protect, getMyBlogs);
router.get("/my/bookmarks", protect, getMyBookmarks);

// EDITOR/ADMIN
router.get("/admin/all", protect, editorOrAbove, getAdminBlogs);
router.put("/:id/approve", protect, editorOrAbove, approveBlog);
router.put("/:blogId/comment/:commentId/approve", protect, editorOrAbove, approveComment);
router.get("/admin/stats", protect, editorOrAbove, getBlogStats);

module.exports = router;
