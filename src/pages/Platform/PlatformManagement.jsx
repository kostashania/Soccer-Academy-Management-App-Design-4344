import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useApp } from '../../contexts/AppContext';
import { toast } from 'react-toastify';

const {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiExternalLink,
  FiSave,
  FiX,
  FiGlobe,
  FiSettings
} = FiIcons;

const PlatformManagement = () => {
  const { platformButtons = [], addPlatformButton, updatePlatformButton, deletePlatformButton } = useApp();
  const [isAddingButton, setIsAddingButton] = useState(false);
  const [editingButton, setEditingButton] = useState(null);
  const [formData, setFormData] = useState({ text: '', url: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.text || !formData.url) {
      toast.error('Please fill in all fields');
      return;
    }

    // Basic URL validation
    try {
      new URL(formData.url);
    } catch {
      toast.error('Please enter a valid URL');
      return;
    }

    if (editingButton) {
      updatePlatformButton(editingButton.id, formData);
      setEditingButton(null);
      toast.success('Platform button updated successfully!');
    } else {
      addPlatformButton(formData);
      setIsAddingButton(false);
      toast.success('Platform button added successfully!');
    }
    
    setFormData({ text: '', url: '' });
  };

  const startEdit = (button) => {
    setEditingButton(button);
    setFormData({ text: button.text, url: button.url });
    setIsAddingButton(false);
  };

  const cancelEdit = () => {
    setEditingButton(null);
    setIsAddingButton(false);
    setFormData({ text: '', url: '' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this platform button?')) {
      deletePlatformButton(id);
      toast.success('Platform button deleted successfully!');
    }
  };

  const testLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Management</h1>
          <p className="text-gray-600">Configure external platform links for all users</p>
        </div>
        <button
          onClick={() => setIsAddingButton(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <SafeIcon icon={FiPlus} className="h-4 w-4" />
          <span>Add Platform Button</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {(isAddingButton || editingButton) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <h3 className="text-lg font-semibold mb-4">
            {editingButton ? 'Edit Platform Button' : 'Add New Platform Button'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button Text *
                </label>
                <input
                  type="text"
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., Google Drive"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL *
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="https://drive.google.com"
                  required
                />
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <SafeIcon icon={FiSave} className="h-4 w-4" />
                <span>{editingButton ? 'Update' : 'Add'} Button</span>
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Platform Buttons List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            Current Platform Buttons ({platformButtons.length})
          </h3>
        </div>
        <div className="p-6">
          {platformButtons.length === 0 ? (
            <div className="text-center py-8">
              <SafeIcon icon={FiSettings} className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No platform buttons configured yet.</p>
              <p className="text-sm text-gray-400 mt-1">Click "Add Platform Button" to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {platformButtons.map((button) => (
                <motion.div
                  key={button.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary-50 rounded-lg">
                      <SafeIcon icon={FiGlobe} className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{button.text}</p>
                      <p className="text-sm text-gray-500 break-all">{button.url}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => testLink(button.url)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Test Link"
                    >
                      <SafeIcon icon={FiExternalLink} className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => startEdit(button)}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <SafeIcon icon={FiEdit} className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(button.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">Usage Instructions</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Platform buttons will appear for all users in the Platform menu</li>
          <li>• All links open in new tabs for better user experience</li>
          <li>• Use descriptive button text to help users identify the platform</li>
          <li>• Test links before saving to ensure they work correctly</li>
          <li>• You can add unlimited platform buttons</li>
        </ul>
      </div>
    </div>
  );
};

export default PlatformManagement;