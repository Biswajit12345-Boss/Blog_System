const Blog = require("../model/Blog");

// ==============================
// 🔥 CREATE BLOG
// ==============================
const createBlog = async (req, res) => {
    try {
        const { title, description, videoUrl, thumbnail } = req.body;

        if (!videoUrl) {
            return res.status(400).json({
                message: "Video URL is required",
                status: false,
            });
        }

        const blog = await Blog.create({
            user: req.user._id,
            title,
            description,
            videoUrl,
            thumbnail,
        });

        res.status(201).json({
            message: "Blog created successfully",
            data: blog,
            status: true,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error creating blog",
            error: error.message,
            status: false,
        });
    }
};
// ==============================
// 📖 GET ALL BLOGS (Published)
// ==============================
const getAllBlogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 6;
        const skip = (page - 1) * limit;

        const search = req.query.search
            ? {
                title: { $regex: req.query.search, $options: "i" },
            }
            : {};

        const blogs = await Blog.find({
            status: "published",
            ...search,
        })
            .populate("user", "name email")
            .populate("comments.user", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Blog.countDocuments({
            status: "published",
            ...search,
        });

        res.json({
            data: blogs,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            status: true,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching blogs",
            error: error.message,
            status: false,
        });
    }
};

// ==============================
// 📖 GET SINGLE BLOG
// ==============================
const getSingleBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate("user", "name email")
            .populate("comments.user", "name");

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found",
                status: false,
            });
        }

        res.json({
            message: "Blog fetched successfully",
            data: blog,
            status: true,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching blog",
            error: error.message,
            status: false,
        });
    }
};

// ==============================
// ✏️ UPDATE BLOG (Owner Only)
// ==============================
const updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found",
                status: false,
            });
        }

        if (blog.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Not authorized",
                status: false,
            });
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json({
            message: "Blog updated successfully",
            data: updatedBlog,
            status: true,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating blog",
            error: error.message,
            status: false,
        });
    }
};

// ==============================
// ❌ DELETE BLOG (Owner/Admin)
// ==============================
const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found",
                status: false,
            });
        }

        if (
            blog.user.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                message: "Not authorized",
                status: false,
            });
        }

        await blog.deleteOne();

        res.json({
            message: "Blog deleted successfully",
            status: true,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting blog",
            error: error.message,
            status: false,
        });
    }
};

// ==============================
// ❤️ LIKE / UNLIKE BLOG
// ==============================
const likeBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found",
                status: false,
            });
        }

        const userId = req.user._id;

        const alreadyLiked = blog.likes.includes(userId);

        if (alreadyLiked) {
            blog.likes.pull(userId);
        } else {
            blog.likes.push(userId);
        }

        await blog.save();

        res.json({
            message: alreadyLiked ? "Unliked blog" : "Liked blog",
            likesCount: blog.likes.length,
            status: true,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error liking blog",
            error: error.message,
            status: false,
        });
    }
};

// ==============================
// 💬 ADD COMMENT
// ==============================
const addComment = async (req, res) => {
    try {
        const { comment } = req.body;

        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found",
                status: false,
            });
        }

        blog.comments.push({
            user: req.user._id,
            comment,
        });

        await blog.save();

        await blog.populate("comments.user", "name");

        res.json({
            message: "Comment added",
            comments: blog.comments,
            status: true,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error adding comment",
            error: error.message,
            status: false,
        });
    }
};

// ==============================
// 🗑 DELETE COMMENT
// ==============================
const deleteComment = async (req, res) => {
    try {
        const { blogId, commentId } = req.params;

        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found",
                status: false,
            });
        }

        const comment = blog.comments.id(commentId);

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found",
                status: false,
            });
        }

        if (
            comment.user.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                message: "Not authorized",
                status: false,
            });
        }

        comment.deleteOne();
        await blog.save();

        res.json({
            message: "Comment deleted",
            status: true,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting comment",
            error: error.message,
            status: false,
        });
    }
};

// ==============================
// 👁 INCREMENT VIEWS
// ==============================
const incrementViews = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            { $inc: { views: 1 } },
            { new: true }
        );

        res.json({
            message: "View count updated",
            views: blog.views,
            status: true,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating views",
            error: error.message,
            status: false,
        });
    }
};


// ==============================
// 👤 GET BLOGS BY USER
// ==============================
const getBlogsByUser = async (req, res) => {
    try {
        const blogs = await Blog.find({
            user: req.params.userId,
            status: "published",
        })
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.json({
            message: "User blogs fetched",
            blogs,
            status: true,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching user blogs",
            error: error.message,
            status: false,
        });
    }
};

const toggleBookmark = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        const userId = req.user._id;

        const bookmarked = blog.bookmarks.includes(userId);

        if (bookmarked) {
            blog.bookmarks.pull(userId);
        } else {
            blog.bookmarks.push(userId);
        }

        await blog.save();

        res.json({
            bookmarks: blog.bookmarks,
            status: true,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error bookmarking",
            error: error.message,
        });
    }
};

module.exports = {
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
    toggleBookmark
};