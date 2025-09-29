const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');


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


router.get('/stats', auth, adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const inactiveUsers = totalUsers - activeUsers;


    const serverUptime = process.uptime();


    const systemStats = {
      serverUptime: Math.floor(serverUptime),
      totalFiles: 0,
      totalStorageUsed: 0
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


router.put('/users/:id/status', auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }


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


router.delete('/users/:id', auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }


    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ msg: 'Cannot delete your own account' });
    }



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