// routes/adminRoutes.js - FIX THE IMPORT
const express = require('express');
const router = express.Router();
const User = require('../models/User');
// Remove this incorrect import:
// const File = require('./file'); // ❌ WRONG
// Add proper file model import (if you have one) or remove file-related code

const auth = require('../middleware/auth');

// Admin middleware
const adminAuth = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admin rights required.' });
    }
    next();
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all users with statistics
router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    
    res.json({
      users,
      statistics: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        adminUsers,
        regularUsers: totalUsers - adminUsers
      }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get dashboard statistics - FIX FILE-RELATED ERRORS
// In your admin routes file (routes/admin.js or similar)
router.get('/stats', auth, adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const inactiveUsers = totalUsers - activeUsers;
    
    // Calculate server uptime (in seconds)
    const serverUptime = process.uptime(); // This is valid on server-side
    
    // Add any other system stats you want to track
    const systemStats = {
      serverUptime: Math.floor(serverUptime),
      totalFiles: 0, // You can track files if you have file uploads
      totalStorageUsed: 0 // Track storage usage
    };
    
    const userStats = {
      newUsersToday: await User.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }),
      recentLogins: await User.countDocuments({
        lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      })
    };

    res.json({
      statistics: {
        totalUsers,
        activeUsers,
        adminUsers,
        inactiveUsers,
        systemStats,
        userStats
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Toggle user active status - ADD SECURITY CHECKS
router.put('/users/:id/status', auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Prevent self-deactivation
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ msg: 'Cannot deactivate your own account' });
    }
    
    user.isActive = !user.isActive;
    await user.save();
    
    res.json({ 
      msg: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: user._id,
        isActive: user.isActive,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Change user role - ADD SECURITY CHECKS
router.put('/users/:id/role', auth, adminAuth, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ msg: 'Invalid role' });
    }
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Prevent self-role change
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ msg: 'Cannot change your own role' });
    }
    
    user.role = role;
    await user.save();
    
    res.json({ 
      msg: `User role updated to ${role}`,
      user: {
        id: user._id,
        role: user.role,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete user - ADD SECURITY CHECKS
router.delete('/users/:id', auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Prevent self-deletion
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ msg: 'Cannot delete your own account' });
    }
    
    // Remove file deletion code or handle properly
    // await File.deleteMany({ userId: req.params.id });
    
    await User.findByIdAndDelete(req.params.id);
    
    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.put('/update-login/:id', auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    user.lastLogin = new Date();
    user.loginCount = (user.loginCount || 0) + 1;
    await user.save();
    
    res.json({ msg: 'Login updated successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;