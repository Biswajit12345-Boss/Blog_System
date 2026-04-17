const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, getMe, updateProfile, getAllUsers, updateUserRole, deleteUser, getStats } = require('../controller/authController');
const { protect, adminOnly, editorOrAbove } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.get('/stats', protect, adminOnly, getStats);
router.get('/allusers', protect, editorOrAbove, getAllUsers);
router.put('/users/:id/role', protect, adminOnly, updateUserRole);
router.delete('/users/:id', protect, adminOnly, deleteUser);

module.exports = router;
