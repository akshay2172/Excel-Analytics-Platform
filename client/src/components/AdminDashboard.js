// components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const auth = useSelector(state => state.auth);
  const navigate = useNavigate();

 
  useEffect(() => {
    if (!auth.user || auth.user.role !== 'admin') {
      navigate('/');
    }
  }, [auth, navigate]);


  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const [usersRes, statsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setUsers(usersRes.data.users);
      setStats(usersRes.data.statistics);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      setActionLoading(prev => ({ ...prev, [userId]: true }));
      const token = localStorage.getItem('token');
      
      await axios.put(`http://localhost:5000/api/admin/users/${userId}/status`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUsers(users.map(user => 
        user._id === userId 
          ? { ...user, isActive: !currentStatus }
          : user
      ));
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update user status');
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const changeUserRole = async (userId, newRole) => {
    try {
      setActionLoading(prev => ({ ...prev, [userId]: true }));
      const token = localStorage.getItem('token');
      
      await axios.put(`http://localhost:5000/api/admin/users/${userId}/role`, 
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers(users.map(user => 
        user._id === userId ? { ...user, role: newRole } : user
      ));
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update user role');
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const confirmDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const deleteUser = async () => {
    if (!userToDelete) return;

    try {
      setActionLoading(prev => ({ ...prev, [userToDelete._id]: true }));
      const token = localStorage.getItem('token');
      
      await axios.delete(`http://localhost:5000/api/admin/users/${userToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUsers(users.filter(user => user._id !== userToDelete._id));
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to delete user');
    } finally {
      setActionLoading(prev => ({ ...prev, [userToDelete._id]: false }));
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">
          <i className="fas fa-spinner fa-spin mr-2"></i>
          Loading Admin Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
     
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-green-400">
              <i className="fas fa-shield-alt mr-2"></i>
              Admin Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Welcome, {auth.user?.email}</span>
              <button
                onClick={() => navigate('/')}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Back to App
              </button>
            </div>
          </div>
        </div>
      </header>

      
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {['dashboard', 'users', 'system'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition ${
                  activeTab === tab
                    ? 'border-green-500 text-green-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <i className={`fas fa-${getTabIcon(tab)} mr-2`}></i>
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

   
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
            <i className="fas fa-exclamation-circle mr-2"></i>
            {error}
          </div>
        )}

        {activeTab === 'dashboard' && <DashboardStats stats={stats} />}
        {activeTab === 'users' && (
          <UsersManagement
            users={filteredUsers}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            toggleUserStatus={toggleUserStatus}
            changeUserRole={changeUserRole}
            confirmDeleteUser={confirmDeleteUser}
            actionLoading={actionLoading}
            currentUserId={auth.user?._id}
          />
        )}
        {activeTab === 'system' && <SystemInfo stats={stats} />}
      </main>

     
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
            <p className="text-gray-300 mb-4">
              Are you sure you want to delete user <strong>{userToDelete?.email}</strong>? 
              This action cannot be undone and will permanently delete all their data.
            </p>
            <div className="flex space-x-4 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={deleteUser}
                disabled={actionLoading[userToDelete?._id]}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition disabled:opacity-50"
              >
                {actionLoading[userToDelete?._id] ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


function getTabIcon(tab) {
  const icons = {
    dashboard: 'tachometer-alt',
    users: 'users',
    system: 'cog'
  };
  return icons[tab] || 'circle';
}


function DashboardStats({ stats }) {
  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers || 0,
      icon: 'users',
      color: 'blue'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers || 0,
      icon: 'user-check',
      color: 'green'
    },
    {
      title: 'Admin Users',
      value: stats.adminUsers || 0,
      icon: 'shield-alt',
      color: 'purple'
    },
    {
      title: 'Inactive Users',
      value: stats.inactiveUsers || 0,
      icon: 'user-slash',
      color: 'red'
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">System Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{card.title}</p>
                <p className="text-3xl font-bold mt-2">{card.value}</p>
              </div>
              <div className={`text-${card.color}-400 text-2xl`}>
                <i className={`fas fa-${card.icon}`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


function UsersManagement({ 
  users, 
  searchTerm, 
  setSearchTerm, 
  toggleUserStatus, 
  changeUserRole, 
  confirmDeleteUser, 
  actionLoading,
  currentUserId 
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pl-10 text-white focus:outline-none focus:border-green-500"
          />
          <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Last Login
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {users.map((user) => {
              const isCurrentUser = user._id === currentUserId;
              return (
                <tr key={user._id} className="hover:bg-gray-750 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-white">{user.email}</div>
                      <div className="text-sm text-gray-400">{user.name || 'No name'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.isActive 
                        ? 'bg-green-900 text-green-300' 
                        : 'bg-red-900 text-red-300'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-purple-900 text-purple-300' 
                        : 'bg-blue-900 text-blue-300'
                    }`}>
                      {user.role}
                      {isCurrentUser && ' (You)'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {user.lastLogin 
                      ? new Date(user.lastLogin).toLocaleDateString() 
                      : 'Never'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => toggleUserStatus(user._id, user.isActive)}
                      disabled={actionLoading[user._id] || isCurrentUser}
                      className={`px-3 py-1 rounded text-xs ${
                        user.isActive 
                          ? 'bg-red-600 hover:bg-red-700' 
                          : 'bg-green-600 hover:bg-green-700'
                      } transition disabled:opacity-50`}
                      title={isCurrentUser ? "Cannot deactivate yourself" : ""}
                    >
                      {actionLoading[user._id] ? '...' : user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    
                    <button
                      onClick={() => changeUserRole(user._id, user.role === 'admin' ? 'user' : 'admin')}
                      disabled={actionLoading[user._id] || isCurrentUser}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs transition disabled:opacity-50"
                      title={isCurrentUser ? "Cannot change your own role" : ""}
                    >
                      Make {user.role === 'admin' ? 'User' : 'Admin'}
                    </button>
                    
                    <button
                      onClick={() => confirmDeleteUser(user)}
                      disabled={actionLoading[user._id] || isCurrentUser}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs transition disabled:opacity-50"
                      title={isCurrentUser ? "Cannot delete yourself" : ""}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {users.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No users found
          </div>
        )}
      </div>
    </div>
  );
}


function SystemInfo({ stats }) {
  const formatBytes = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

 
  const serverUptime = stats.systemStats?.serverUptime || 0;
  
 
  const formatUptime = (seconds) => {
    if (!seconds) return '0 hours';
    const hours = Math.floor(seconds / 3600);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ${hours % 24} hour${hours % 24 !== 1 ? 's' : ''}`;
    }
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">System Information</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-bold mb-4">Server Status</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Status:</span>
              <span className="text-green-400">Online</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Uptime:</span>
              <span>{formatUptime(serverUptime)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Files:</span>
              <span>{stats.systemStats?.totalFiles || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Storage Used:</span>
              <span>{formatBytes(stats.systemStats?.totalStorageUsed || 0)}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-bold mb-4">User Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">New Users Today:</span>
              <span>{stats.userStats?.newUsersToday || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Recent Logins (7d):</span>
              <span>{stats.userStats?.recentLogins || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Users:</span>
              <span>{stats.totalUsers || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Active Users:</span>
              <span>{stats.activeUsers || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}