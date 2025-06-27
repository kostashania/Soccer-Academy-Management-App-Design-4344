import React, { useState } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import Dashboard from '../Dashboard/Dashboard';
import { useApp } from '../../contexts/AppContext';
import { toast } from 'react-toastify';

const { FiUsers, FiBarChart3, FiPackage, FiDollarSign, FiMegaphone, FiSettings, FiHome, FiPlus, FiEdit2, FiTrash2, FiMapPin, FiTag } = FiIcons;

// Users Management Component
const UsersManagement = () => {
  const { users, addUser, updateUser, deleteUser } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'player',
    phone: '',
    address: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      updateUser(editingUser.id, formData);
      toast.success('User updated successfully!');
    } else {
      addUser(formData);
      toast.success('User added successfully!');
    }
    setShowAddModal(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'player', phone: '', address: '' });
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData(user);
    setShowAddModal(true);
  };

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId);
      toast.success('User deleted successfully!');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-soft p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Users Management</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <SafeIcon icon={FiPlus} className="h-4 w-4 mr-2" />
          Add User
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Role</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-100">
                <td className="py-4 px-4 font-medium text-gray-900">{user.name}</td>
                <td className="py-4 px-4 text-gray-600">{user.email}</td>
                <td className="py-4 px-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full capitalize">
                    {user.role}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    {user.status || 'Active'}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <SafeIcon icon={FiEdit2} className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowAddModal(false)} />
            <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="player">Player</option>
                    <option value="parent">Parent</option>
                    <option value="coach">Coach</option>
                    <option value="admin">Admin</option>
                  </select>
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg"
                    >
                      {editingUser ? 'Update' : 'Add'} User
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Locations Management Component
const LocationsManagement = () => {
  const { locations, addLocation, updateLocation, deleteLocation } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    googleMapsLink: '',
    capacity: '',
    type: 'field'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingLocation) {
      updateLocation(editingLocation.id, { ...formData, capacity: parseInt(formData.capacity) });
      toast.success('Location updated successfully!');
    } else {
      addLocation({ ...formData, capacity: parseInt(formData.capacity) });
      toast.success('Location added successfully!');
    }
    setShowAddModal(false);
    setEditingLocation(null);
    setFormData({ name: '', address: '', googleMapsLink: '', capacity: '', type: 'field' });
  };

  return (
    <div className="bg-white rounded-xl shadow-soft p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Locations Management</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <SafeIcon icon={FiPlus} className="h-4 w-4 mr-2" />
          Add Location
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {locations.map((location) => (
          <div key={location.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900">{location.name}</h3>
              <div className="flex space-x-1">
                <button
                  onClick={() => {
                    setEditingLocation(location);
                    setFormData(location);
                    setShowAddModal(true);
                  }}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <SafeIcon icon={FiEdit2} className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Delete this location?')) {
                      deleteLocation(location.id);
                      toast.success('Location deleted!');
                    }
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">{location.address}</p>
            <p className="text-sm text-gray-600">Capacity: {location.capacity}</p>
            <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {location.type}
            </span>
          </div>
        ))}
      </div>

      {/* Add/Edit Location Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowAddModal(false)} />
            <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {editingLocation ? 'Edit Location' : 'Add New Location'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Location Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                  <input
                    type="url"
                    placeholder="Google Maps Link"
                    value={formData.googleMapsLink}
                    onChange={(e) => setFormData({...formData, googleMapsLink: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="Capacity"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="field">Field</option>
                    <option value="stadium">Stadium</option>
                    <option value="indoor">Indoor</option>
                  </select>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg"
                    >
                      {editingLocation ? 'Update' : 'Add'} Location
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Categories Management Component
const CategoriesManagement = () => {
  const { productCategories, addProductCategory, updateProductCategory, deleteProductCategory } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCategory) {
      updateProductCategory(editingCategory.id, formData);
      toast.success('Category updated successfully!');
    } else {
      addProductCategory(formData);
      toast.success('Category added successfully!');
    }
    setShowAddModal(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
  };

  return (
    <div className="bg-white rounded-xl shadow-soft p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Categories Management</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <SafeIcon icon={FiPlus} className="h-4 w-4 mr-2" />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {productCategories.map((category) => (
          <div key={category.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900">{category.name}</h3>
              <div className="flex space-x-1">
                <button
                  onClick={() => {
                    setEditingCategory(category);
                    setFormData(category);
                    setShowAddModal(true);
                  }}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <SafeIcon icon={FiEdit2} className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Delete this category?')) {
                      deleteProductCategory(category.id);
                      toast.success('Category deleted!');
                    }
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600">{category.description}</p>
          </div>
        ))}
      </div>

      {/* Add/Edit Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowAddModal(false)} />
            <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Category Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    rows={3}
                  />
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg"
                    >
                      {editingCategory ? 'Update' : 'Add'} Category
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sponsors Management Component
const SponsorsManagement = () => {
  const { sponsors, addSponsor, updateSponsor, deleteSponsor } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    contactEmail: '',
    amount: '',
    startDate: '',
    endDate: '',
    status: 'active',
    benefits: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingSponsor) {
      updateSponsor(editingSponsor.id, { ...formData, amount: parseFloat(formData.amount) });
      toast.success('Sponsor updated successfully!');
    } else {
      addSponsor({ ...formData, amount: parseFloat(formData.amount) });
      toast.success('Sponsor added successfully!');
    }
    setShowAddModal(false);
    setEditingSponsor(null);
    setFormData({ name: '', logo: '', contactEmail: '', amount: '', startDate: '', endDate: '', status: 'active', benefits: '' });
  };

  return (
    <div className="bg-white rounded-xl shadow-soft p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Sponsors Management</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <SafeIcon icon={FiPlus} className="h-4 w-4 mr-2" />
          Add Sponsor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sponsors.map((sponsor) => (
          <div key={sponsor.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-3">
                {sponsor.logo && (
                  <img src={sponsor.logo} alt={sponsor.name} className="w-10 h-10 object-cover rounded" />
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">{sponsor.name}</h3>
                  <p className="text-sm text-gray-600">{sponsor.contactEmail}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => {
                    setEditingSponsor(sponsor);
                    setFormData(sponsor);
                    setShowAddModal(true);
                  }}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <SafeIcon icon={FiEdit2} className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Delete this sponsor?')) {
                      deleteSponsor(sponsor.id);
                      toast.success('Sponsor deleted!');
                    }
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="text-lg font-bold text-green-600">€{sponsor.amount?.toLocaleString()}</p>
            <p className="text-sm text-gray-600">{sponsor.startDate} - {sponsor.endDate}</p>
            <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
              sponsor.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {sponsor.status}
            </span>
          </div>
        ))}
      </div>

      {/* Add/Edit Sponsor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowAddModal(false)} />
            <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {editingSponsor ? 'Edit Sponsor' : 'Add New Sponsor'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Sponsor Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                  <input
                    type="url"
                    placeholder="Logo URL"
                    value={formData.logo}
                    onChange={(e) => setFormData({...formData, logo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="email"
                    placeholder="Contact Email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Sponsorship Amount (€)"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      placeholder="Start Date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                    <input
                      type="date"
                      placeholder="End Date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="expired">Expired</option>
                  </select>
                  <textarea
                    placeholder="Benefits/Description"
                    value={formData.benefits}
                    onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    rows={3}
                  />
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg"
                    >
                      {editingSponsor ? 'Update' : 'Add'} Sponsor
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const location = useLocation();

  const adminTabs = [
    { name: 'Overview', href: '/admin', icon: FiHome, exact: true },
    { name: 'Users', href: '/admin/users', icon: FiUsers },
    { name: 'Analytics', href: '/admin/analytics', icon: FiBarChart3 },
    { name: 'Inventory', href: '/admin/inventory', icon: FiPackage },
    { name: 'Locations', href: '/admin/locations', icon: FiMapPin },
    { name: 'Categories', href: '/admin/categories', icon: FiTag },
    { name: 'Finance', href: '/admin/finance', icon: FiDollarSign },
    { name: 'Sponsors', href: '/admin/sponsors', icon: FiMegaphone },
    { name: 'Settings', href: '/admin/settings', icon: FiSettings },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-indigo-100">Complete control and management of your soccer academy</p>
      </div>

      <div className="bg-white rounded-xl shadow-soft border border-gray-100">
        <nav className="flex space-x-1 p-2 overflow-x-auto">
          {adminTabs.map((tab) => {
            const isActive = tab.exact 
              ? location.pathname === '/dashboard' || location.pathname === tab.href
              : location.pathname.startsWith(tab.href);
            return (
              <NavLink
                key={tab.name}
                to={tab.href}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  isActive ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <SafeIcon icon={tab.icon} className="h-4 w-4 mr-2" />
                {tab.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<UsersManagement />} />
          <Route path="/analytics" element={<div>Analytics Coming Soon</div>} />
          <Route path="/inventory" element={<div>Inventory Management - Use Store page</div>} />
          <Route path="/locations" element={<LocationsManagement />} />
          <Route path="/categories" element={<CategoriesManagement />} />
          <Route path="/finance" element={<div>Finance Coming Soon</div>} />
          <Route path="/sponsors" element={<SponsorsManagement />} />
          <Route path="/settings" element={<div>Settings Coming Soon</div>} />
        </Routes>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;