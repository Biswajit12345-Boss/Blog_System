const express = require("express");
const {
    createBlog,
    getAllBlogs,
    getSingleBlog,
    updateBlog,
    deleteBlog,
    likeBlog,
    addComment,
    deleteComment,
    incrementViews,
    getBlogsByUser,
    toggleBookmark,
} = require("../controller/blogController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// PUBLIC
router.get("/", getAllBlogs);
router.get("/:id", getSingleBlog);
router.put("/:id/view", incrementViews);

// USER
router.post("/", protect, createBlog);
router.put("/:id", protect, updateBlog);
router.delete("/:id", protect, deleteBlog);
router.put("/:id/like", protect, likeBlog);
router.post("/:id/comment", protect, addComment);
router.delete("/:blogId/comment/:commentId", protect, deleteComment);

router.get("/admin/all", protect, adminOnly, getAllBlogs);
router.get("/user/:userId", getBlogsByUser);
router.put("/:id/bookmark", protect, toggleBookmark);

module.exports = router;