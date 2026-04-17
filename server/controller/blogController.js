const Blog = require("../model/Blog");

const createBlog = async (req, res) => {
  try {
    const { title, description, content, coverImage, category, tags, status, metaTitle, metaDescription, scheduledAt } = req.body;
    let finalStatus = status || 'published';
    if (req.user.role === 'contributor') finalStatus = 'pending';
    const blog = await Blog.create({
      user: req.user._id, title, description, content: content || '',
      coverImage: coverImage || '', category: category || 'Other',
      tags: Array.isArray(tags) ? tags : (tags || '').split(',').map(t => t.trim()).filter(Boolean),
      status: finalStatus, metaTitle, metaDescription,
      scheduledAt: scheduledAt || null,
    });
    await blog.populate('user', 'name email avatar role');
    res.status(201).json({ message: "Blog created", data: blog, status: true });
  } catch (error) { res.status(500).json({ message: "Error creating blog", error: error.message, status: false }); }
};

const getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    const filter = { status: "published" };
    if (req.query.search) filter.$or = [
      { title: { $regex: req.query.search, $options: "i" } },
      { description: { $regex: req.query.search, $options: "i" } },
      { tags: { $in: [new RegExp(req.query.search, 'i')] } }
    ];
    if (req.query.category && req.query.category !== 'All') filter.category = req.query.category;
    if (req.query.tag) filter.tags = req.query.tag;
    if (req.query.author) filter.user = req.query.author;
    const sort = req.query.sort === 'popular' ? { views: -1 } : req.query.sort === 'liked' ? { 'likes.length': -1 } : { createdAt: -1 };
    const [blogs, total] = await Promise.all([
      Blog.find(filter).populate("user", "name email avatar role").populate("comments.user", "name avatar").sort(sort).skip(skip).limit(limit),
      Blog.countDocuments(filter)
    ]);
    res.json({ data: blogs, totalPages: Math.ceil(total / limit), currentPage: page, total, status: true });
  } catch (error) { res.status(500).json({ message: "Error fetching blogs", error: error.message, status: false }); }
};

const getAdminBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) filter.title = { $regex: req.query.search, $options: 'i' };
    if (req.query.category) filter.category = req.query.category;
    const [blogs, total] = await Promise.all([
      Blog.find(filter).populate("user", "name email avatar role").sort({ createdAt: -1 }).skip(skip).limit(limit),
      Blog.countDocuments(filter)
    ]);
    res.json({ data: blogs, totalPages: Math.ceil(total / limit), currentPage: page, total, status: true });
  } catch (error) { res.status(500).json({ message: error.message, status: false }); }
};

const getFeaturedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: "published" }).populate("user", "name email avatar").sort({ views: -1, createdAt: -1 }).limit(5);
    res.json({ data: blogs, status: true });
  } catch (error) { res.status(500).json({ message: "Error", error: error.message, status: false }); }
};

const getTrendingBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: "published" }).populate("user", "name email avatar").sort({ views: -1 }).limit(6);
    res.json({ data: blogs, status: true });
  } catch (error) { res.status(500).json({ message: "Error", error: error.message, status: false }); }
};

const getSingleBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { slug: id };
    const blog = await Blog.findOne(query).populate("user", "name email avatar bio website socialLinks").populate("comments.user", "name avatar");
    if (!blog) return res.status(404).json({ message: "Blog not found", status: false });
    res.json({ data: blog, status: true });
  } catch (error) { res.status(500).json({ message: error.message, status: false }); }
};

const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found", status: false });
    const canEdit = blog.user.toString() === req.user._id.toString() || ['admin','editor'].includes(req.user.role);
    if (!canEdit) return res.status(403).json({ message: "Not authorized", status: false });
    if (req.body.tags && !Array.isArray(req.body.tags)) {
      req.body.tags = req.body.tags.split(',').map(t => t.trim()).filter(Boolean);
    }
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('user', 'name email avatar');
    res.json({ message: "Blog updated", data: updatedBlog, status: true });
  } catch (error) { res.status(500).json({ message: error.message, status: false }); }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found", status: false });
    const canDelete = blog.user.toString() === req.user._id.toString() || ['admin','editor'].includes(req.user.role);
    if (!canDelete) return res.status(403).json({ message: "Not authorized", status: false });
    await blog.deleteOne();
    res.json({ message: "Blog deleted", status: true });
  } catch (error) { res.status(500).json({ message: error.message, status: false }); }
};

const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found", status: false });
    const userId = req.user._id;
    const alreadyLiked = blog.likes.includes(userId);
    if (alreadyLiked) blog.likes.pull(userId); else blog.likes.push(userId);
    await blog.save();
    res.json({ liked: !alreadyLiked, likesCount: blog.likes.length, status: true });
  } catch (error) { res.status(500).json({ message: error.message, status: false }); }
};

const addComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found", status: false });
    blog.comments.push({ user: req.user._id, comment });
    await blog.save();
    await blog.populate("comments.user", "name avatar");
    res.json({ comments: blog.comments, status: true });
  } catch (error) { res.status(500).json({ message: error.message, status: false }); }
};

const deleteComment = async (req, res) => {
  try {
    const { blogId, commentId } = req.params;
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found", status: false });
    const comment = blog.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found", status: false });
    const canDelete = comment.user.toString() === req.user._id.toString() || ['admin','editor'].includes(req.user.role);
    if (!canDelete) return res.status(403).json({ message: "Not authorized", status: false });
    comment.deleteOne();
    await blog.save();
    res.json({ message: "Comment deleted", status: true });
  } catch (error) { res.status(500).json({ message: error.message, status: false }); }
};

const approveComment = async (req, res) => {
  try {
    const { blogId, commentId } = req.params;
    const blog = await Blog.findById(blogId);
    const comment = blog.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    comment.approved = !comment.approved;
    await blog.save();
    res.json({ approved: comment.approved, status: true });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const incrementViews = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true });
    res.json({ views: blog?.views || 0, status: true });
  } catch (error) { res.status(500).json({ message: error.message, status: false }); }
};

const getBlogsByUser = async (req, res) => {
  try {
    const blogs = await Blog.find({ user: req.params.userId, status: 'published' }).populate("user", "name email avatar").sort({ createdAt: -1 });
    res.json({ blogs, status: true });
  } catch (error) { res.status(500).json({ message: error.message, status: false }); }
};

const getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ user: req.user._id }).populate("user", "name email avatar").sort({ createdAt: -1 });
    res.json({ blogs, status: true });
  } catch (error) { res.status(500).json({ message: error.message, status: false }); }
};

const getMyBookmarks = async (req, res) => {
  try {
    const blogs = await Blog.find({ bookmarks: req.user._id, status: 'published' }).populate("user", "name email avatar").sort({ createdAt: -1 });
    res.json({ data: blogs, status: true });
  } catch (error) { res.status(500).json({ message: error.message, status: false }); }
};

const toggleBookmark = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Not found", status: false });
    const userId = req.user._id;
    const bookmarked = blog.bookmarks.includes(userId);
    if (bookmarked) blog.bookmarks.pull(userId); else blog.bookmarks.push(userId);
    await blog.save();
    res.json({ bookmarked: !bookmarked, status: true });
  } catch (error) { res.status(500).json({ message: error.message, status: false }); }
};

const getRelatedBlogs = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Not found", status: false });
    const related = await Blog.find({ _id: { $ne: blog._id }, status: 'published', $or: [{ category: blog.category }, { tags: { $in: blog.tags } }] }).populate("user", "name email avatar").limit(3);
    res.json({ data: related, status: true });
  } catch (error) { res.status(500).json({ message: error.message, status: false }); }
};

const approveBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, { status: 'published', approvedBy: req.user._id }, { new: true });
    res.json({ data: blog, status: true });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const getBlogStats = async (req, res) => {
  try {
    const [byCategory, byStatus, recentActivity] = await Promise.all([
      Blog.aggregate([{ $group: { _id: '$category', count: { $sum: 1 }, views: { $sum: '$views' } } }, { $sort: { count: -1 } }]),
      Blog.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Blog.find({ status: 'published' }).populate('user', 'name avatar').sort({ createdAt: -1 }).limit(5).select('title views likes createdAt user'),
    ]);
    res.json({ byCategory, byStatus, recentActivity, status: true });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = {
  createBlog, getAllBlogs, getAdminBlogs, getFeaturedBlogs, getTrendingBlogs,
  getSingleBlog, updateBlog, deleteBlog, likeBlog, addComment, deleteComment,
  approveComment, incrementViews, getBlogsByUser, getMyBlogs, getMyBookmarks,
  toggleBookmark, getRelatedBlogs, approveBlog, getBlogStats
};
