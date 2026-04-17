const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (await User.findOne({ email })) return res.status(400).json({ message: 'User already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role: role || 'subscriber' });
    res.status(201).json({ _id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, bio: user.bio, token: generateToken(user.id, user.role) });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: 'Invalid credentials' });
    if (user.isBlocked) return res.status(403).json({ message: 'Account suspended' });
    await User.findByIdAndUpdate(user._id, { lastActive: Date.now() });
    res.json({ _id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, bio: user.bio, socialLinks: user.socialLinks, token: generateToken(user.id, user.role) });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const logoutUser = (req, res) => res.status(200).json({ message: 'Logged out successfully' });

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const updateProfile = async (req, res) => {
  try {
    const { name, bio, website, avatar, socialLinks } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { name, bio, website, avatar, socialLinks }, { new: true, select: '-password' });
    res.status(200).json(user);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const getAllUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find(filter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      User.countDocuments(filter)
    ]);
    res.status(200).json({ success: true, users, total, totalPages: Math.ceil(total / limit), currentPage: parseInt(page) });
  } catch (error) { res.status(500).json({ success: false, message: 'Failed to fetch users' }); }
};

const updateUserRole = async (req, res) => {
  try {
    const { role, isBlocked } = req.body;
    const update = {};
    if (role) update.role = role;
    if (isBlocked !== undefined) update.isBlocked = isBlocked;
    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true, select: '-password' });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

const getStats = async (req, res) => {
  try {
    const Blog = require('../model/Blog');
    const [totalUsers, totalBlogs, usersByRole, recentUsers] = await Promise.all([
      User.countDocuments(),
      Blog.countDocuments({ status: 'published' }),
      User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
      User.find().select('-password').sort({ createdAt: -1 }).limit(5),
    ]);
    const totalViews = await Blog.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]);
    const totalLikes = await Blog.aggregate([{ $group: { _id: null, total: { $sum: { $size: '$likes' } } } }]);
    // Monthly blog data for chart
    const monthlyBlogs = await Blog.aggregate([
      { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, count: { $sum: 1 }, views: { $sum: '$views' } } },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);
    res.json({
      totalUsers, totalBlogs,
      totalViews: totalViews[0]?.total || 0,
      totalLikes: totalLikes[0]?.total || 0,
      usersByRole, recentUsers, monthlyBlogs
    });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

module.exports = { registerUser, loginUser, logoutUser, getMe, updateProfile, getAllUsers, updateUserRole, deleteUser, getStats };
