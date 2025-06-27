import React, { useState } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import Dashboard from '../Dashboard/Dashboard';
import { useApp } from '../../contexts/AppContext';
import { toast } from 'react-toastify';

const { FiUsers, FiBarChart3, FiPackage, FiDollarSign, FiMegaphone, FiSettings, FiHome, FiPlus, FiEdit2, FiTrash2, FiMapPin, FiTag, FiX } = FiIcons;

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

  const resetForm = () => {
    setFormData({ name: '', email: '', role: 'player', phone: '', address: '' });
    setEditingUser(null);
    setShowAddModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        updateUser(editingUser.id, formData);
        toast.success('User updated successfully!');
      } else {
        addUser(formData);
        toast.success('User added successfully!');
      }
      resetForm();
    } catch (error) {
      toast.error('Error saving user');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      address: user.address || ''
    });
    setShowAddModal(true);
  };

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        deleteUser(userId);
        toast.success('User deleted successfully!');
      } catch (error) {
        toast.error('Error deleting user');
      }
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
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={resetForm} />
            <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-lg font-semibold">
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h3>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                  <SafeIcon icon={FiX} className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                    onClick={resetForm}
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
    googleMapsLink: ''
  });

  const resetForm = () => {
    setFormData({ name: '', address: '', googleMapsLink: '' });
    setEditingLocation(null);
    setShowAddModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (editingLocation) {
        updateLocation(editingLocation.id, formData);
        toast.success('Location updated successfully!');
      } else {
        addLocation(formData);
        toast.success('Location added successfully!');
      }
      resetForm();
    } catch (error) {
      toast.error('Error saving location');
    }
  };

  const handleEdit = (location) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      address: location.address,
      googleMapsLink: location.googleMapsLink || ''
    });
    setShowAddModal(true);
  };

  const handleDelete = (locationId) => {
    if (window.confirm('Delete this location?')) {
      try {
        deleteLocation(locationId);
        toast.success('Location deleted!');
      } catch (error) {
        toast.error('Error deleting location');
      }
    }
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
                  onClick={() => handleEdit(location)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <SafeIcon icon={FiEdit2} className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(location.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-2">{location.address}</p>
            {location.googleMapsLink && (
              <a
                href={location.googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View on Google Maps
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Add/Edit Location Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={resetForm} />
            <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-lg font-semibold">
                  {editingLocation ? 'Edit Location' : 'Add New Location'}
                </h3>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                  <SafeIcon icon={FiX} className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                  placeholder="Google Maps Link (optional)"
                  value={formData.googleMapsLink}
                  onChange={(e) => setFormData({...formData, googleMapsLink: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={resetForm}
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

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setEditingCategory(null);
    setShowAddModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        updateProductCategory(editingCategory.id, formData);
        toast.success('Category updated successfully!');
      } else {
        addProductCategory(formData);
        toast.success('Category added successfully!');
      }
      resetForm();
    } catch (error) {
      toast.error('Error saving category');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description
    });
    setShowAddModal(true);
  };

  const handleDelete = (categoryId) => {
    if (window.confirm('Delete this category?')) {
      try {
        deleteProductCategory(categoryId);
        toast.success('Category deleted!');
      } catch (error) {
        toast.error('Error deleting category');
      }
    }
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
                  onClick={() => handleEdit(category)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <SafeIcon icon={FiEdit2} className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
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
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={resetForm} />
            <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-lg font-semibold">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h3>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                  <SafeIcon icon={FiX} className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                    onClick={resetForm}
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
      )}
    </div>
  );
};

// Sponsors Management Component
const SponsorsManagement = () => {
  const { sponsors, sponsorPackages, addSponsor, updateSponsor, deleteSponsor, getSponsorPackageById } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    logo: '',
    packageId: '',
    startDate: '',
    endDate: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      logo: '',
      packageId: '',
      startDate: '',
      endDate: ''
    });
    setEditingSponsor(null);
    setShowAddModal(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const selectedPackage = getSponsorPackageById(formData.packageId);
      const sponsorData = {
        ...formData,
        packageType: selectedPackage?.type,
        amount: selectedPackage?.price,
        contactEmail: formData.email
      };

      if (editingSponsor) {
        updateSponsor(editingSponsor.id, sponsorData);
        toast.success('Sponsor updated successfully!');
      } else {
        addSponsor(sponsorData);
        toast.success('Sponsor added successfully!');
      }
      resetForm();
    } catch (error) {
      toast.error('Error saving sponsor');
    }
  };

  const handleEdit = (sponsor) => {
    setEditingSponsor(sponsor);
    setFormData({
      name: sponsor.name,
      email: sponsor.email || sponsor.contactEmail,
      phone: sponsor.phone || '',
      logo: sponsor.logo || '',
      packageId: sponsor.packageId || '',
      startDate: sponsor.startDate,
      endDate: sponsor.endDate
    });
    setShowAddModal(true);
  };

  const handleDelete = (sponsorId) => {
    if (window.confirm('Delete this sponsor?')) {
      try {
        deleteSponsor(sponsorId);
        toast.success('Sponsor deleted!');
      } catch (error) {
        toast.error('Error deleting sponsor');
      }
    }
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
        {sponsors.map((sponsor) => {
          const packageInfo = getSponsorPackageById(sponsor.packageId);
          return (
            <div key={sponsor.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-3">
                  {sponsor.logo && (
                    <img src={sponsor.logo} alt={sponsor.name} className="w-10 h-10 object-cover rounded" />
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{sponsor.name}</h3>
                    <p className="text-sm text-gray-600">{sponsor.email || sponsor.contactEmail}</p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEdit(sponsor)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <SafeIcon icon={FiEdit2} className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(sponsor.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {packageInfo && (
                <span className={`inline-block px-2 py-1 text-xs rounded-full mb-2 ${packageInfo.color}`}>
                  {packageInfo.name}
                </span>
              )}
              <p className="text-lg font-bold text-green-600">€{sponsor.amount?.toLocaleString()}</p>
              <p className="text-sm text-gray-600">{sponsor.startDate} - {sponsor.endDate}</p>
              <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                sponsor.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {sponsor.status}
              </span>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Sponsor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={resetForm} />
            <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-lg font-semibold">
                  {editingSponsor ? 'Edit Sponsor' : 'Add New Sponsor'}
                </h3>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                  <SafeIcon icon={FiX} className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <input
                  type="text"
                  placeholder="Company Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
                <input
                  type="email"
                  placeholder="Contact Email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="url"
                  placeholder="Logo URL (optional)"
                  value={formData.logo}
                  onChange={(e) => setFormData({...formData, logo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <select
                  value={formData.packageId}
                  onChange={(e) => setFormData({...formData, packageId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                >
                  <option value="">Select Package</option>
                  {sponsorPackages.map(pkg => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} - €{pkg.price} ({pkg.durationLabel})
                    </option>
                  ))}
                </select>
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
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={resetForm}
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