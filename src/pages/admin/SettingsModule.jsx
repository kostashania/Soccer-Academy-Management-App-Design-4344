import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useApp } from '../../contexts/AppContext';
import { toast } from 'react-toastify';

const { FiSettings, FiSave, FiPlus, FiEdit2, FiTrash2, FiUpload, FiCreditCard, FiUsers, FiDollarSign, FiX } = FiIcons;

const SettingsModule = () => {
  const { 
    clubSettings = {}, 
    updateClubSettings, 
    ageGroups = [], 
    addAgeGroup, 
    updateAgeGroup, 
    deleteAgeGroup,
    roleFields = {},
    updateRoleFields
  } = useApp();

  const [activeTab, setActiveTab] = useState('general');
  const [generalSettings, setGeneralSettings] = useState({
    clubName: clubSettings.clubName || 'Soccer Academy',
    clubLogo: clubSettings.clubLogo || '',
    defaultCurrency: clubSettings.defaultCurrency || 'EUR',
    contactEmail: clubSettings.contactEmail || 'admin@academy.com',
    contactPhone: clubSettings.contactPhone || '+30 123 456 7890',
    address: clubSettings.address || 'Athens, Greece',
    notifications: clubSettings.notifications || {
      emailNotifications: true,
      smsReminders: false,
      pushNotifications: true
    }
  });

  const [subscriptionSettings, setSubscriptionSettings] = useState({
    ageGroups: ageGroups.length > 0 ? ageGroups : [
      { id: '1', name: 'U6', description: 'Under 6 years', monthlyPrice: 80, discountRules: { secondChild: 10 } },
      { id: '2', name: 'U8', description: 'Under 8 years', monthlyPrice: 90, discountRules: { secondChild: 15 } },
      { id: '3', name: 'U10', description: 'Under 10 years', monthlyPrice: 100, discountRules: { secondChild: 15 } },
      { id: '4', name: 'U12', description: 'Under 12 years', monthlyPrice: 110, discountRules: { secondChild: 20 } }
    ]
  });

  const [paymentSettings, setPaymentSettings] = useState({
    stripePublishableKey: clubSettings.stripePublishableKey || '',
    stripeSecretKey: clubSettings.stripeSecretKey || '',
    acceptedMethods: clubSettings.acceptedMethods || {
      creditCard: true,
      bankTransfer: true,
      cash: true,
      stripe: false
    }
  });

  const [roleCustomFields, setRoleCustomFields] = useState({
    coach: roleFields.coach || [
      { id: '1', name: 'Certification Category', type: 'text', required: true },
      { id: '2', name: 'License Number', type: 'text', required: false }
    ],
    sponsor: roleFields.sponsor || [
      { id: '1', name: 'Website URL', type: 'url', required: false },
      { id: '2', name: 'Company Logo', type: 'file', required: false },
      { id: '3', name: 'Bio/Description', type: 'textarea', required: false }
    ],
    parent: roleFields.parent || [
      { id: '1', name: 'Emergency Contact', type: 'text', required: true },
      { id: '2', name: 'Employment Info', type: 'text', required: false }
    ]
  });

  const [showAgeGroupModal, setShowAgeGroupModal] = useState(false);
  const [editingAgeGroup, setEditingAgeGroup] = useState(null);
  const [ageGroupForm, setAgeGroupForm] = useState({
    name: '',
    description: '',
    monthlyPrice: 0,
    secondChildDiscount: 0
  });

  const handleSaveGeneral = () => {
    if (updateClubSettings) {
      updateClubSettings(generalSettings);
    }
    toast.success('General settings saved successfully!');
  };

  const handleSavePayments = () => {
    if (updateClubSettings) {
      updateClubSettings(paymentSettings);
    }
    toast.success('Payment settings saved successfully!');
  };

  const handleSaveRoles = () => {
    if (updateRoleFields) {
      updateRoleFields(roleCustomFields);
    }
    toast.success('Role settings saved successfully!');
  };

  const handleAgeGroupSubmit = (e) => {
    e.preventDefault();
    const groupData = {
      ...ageGroupForm,
      discountRules: { secondChild: ageGroupForm.secondChildDiscount }
    };

    if (editingAgeGroup) {
      if (updateAgeGroup) {
        updateAgeGroup(editingAgeGroup.id, groupData);
      }
      toast.success('Age group updated successfully!');
    } else {
      if (addAgeGroup) {
        addAgeGroup(groupData);
      }
      const newGroups = [...subscriptionSettings.ageGroups, { id: Date.now().toString(), ...groupData }];
      setSubscriptionSettings({ ...subscriptionSettings, ageGroups: newGroups });
      toast.success('Age group added successfully!');
    }

    setShowAgeGroupModal(false);
    setEditingAgeGroup(null);
    setAgeGroupForm({ name: '', description: '', monthlyPrice: 0, secondChildDiscount: 0 });
  };

  const handleDeleteAgeGroup = (groupId) => {
    if (window.confirm('Are you sure you want to delete this age group?')) {
      if (deleteAgeGroup) {
        deleteAgeGroup(groupId);
      }
      const newGroups = subscriptionSettings.ageGroups.filter(g => g.id !== groupId);
      setSubscriptionSettings({ ...subscriptionSettings, ageGroups: newGroups });
      toast.success('Age group deleted successfully!');
    }
  };

  const addCustomField = (role) => {
    const newField = {
      id: Date.now().toString(),
      name: '',
      type: 'text',
      required: false
    };
    setRoleCustomFields({
      ...roleCustomFields,
      [role]: [...(roleCustomFields[role] || []), newField]
    });
  };

  const updateCustomField = (role, fieldId, updates) => {
    setRoleCustomFields({
      ...roleCustomFields,
      [role]: roleCustomFields[role].map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    });
  };

  const removeCustomField = (role, fieldId) => {
    setRoleCustomFields({
      ...roleCustomFields,
      [role]: roleCustomFields[role].filter(field => field.id !== fieldId)
    });
  };

  const tabs = [
    { id: 'general', name: 'General', icon: FiSettings },
    { id: 'subscriptions', name: 'Subscriptions', icon: FiUsers },
    { id: 'payments', name: 'Payments', icon: FiCreditCard },
    { id: 'roles', name: 'Roles & Fields', icon: FiUsers }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600 mt-1">Configure your academy settings</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-100">
        <nav className="flex space-x-1 p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <SafeIcon icon={tab.icon} className="h-4 w-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-soft p-6 border border-gray-100"
      >
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Club Name</label>
                <input
                  type="text"
                  value={generalSettings.clubName}
                  onChange={(e) => setGeneralSettings({...generalSettings, clubName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default Currency</label>
                <select
                  value={generalSettings.defaultCurrency}
                  onChange={(e) => setGeneralSettings({...generalSettings, defaultCurrency: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                <input
                  type="email"
                  value={generalSettings.contactEmail}
                  onChange={(e) => setGeneralSettings({...generalSettings, contactEmail: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                <input
                  type="tel"
                  value={generalSettings.contactPhone}
                  onChange={(e) => setGeneralSettings({...generalSettings, contactPhone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Club Logo</label>
              <div className="flex items-center space-x-4">
                {generalSettings.clubLogo && (
                  <img src={generalSettings.clubLogo} alt="Club Logo" className="w-16 h-16 object-cover rounded-lg" />
                )}
                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <SafeIcon icon={FiUpload} className="h-4 w-4 mr-2" />
                  Upload Logo
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                value={generalSettings.address}
                onChange={(e) => setGeneralSettings({...generalSettings, address: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveGeneral}
                className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <SafeIcon icon={FiSave} className="h-4 w-4 mr-2" />
                Save General Settings
              </button>
            </div>
          </div>
        )}

        {/* Subscription Settings */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Age Groups & Pricing</h3>
              <button
                onClick={() => setShowAgeGroupModal(true)}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <SafeIcon icon={FiPlus} className="h-4 w-4 mr-2" />
                Add Age Group
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subscriptionSettings.ageGroups.map((group) => (
                <div key={group.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{group.name}</h4>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => {
                          setEditingAgeGroup(group);
                          setAgeGroupForm({
                            name: group.name,
                            description: group.description,
                            monthlyPrice: group.monthlyPrice,
                            secondChildDiscount: group.discountRules?.secondChild || 0
                          });
                          setShowAgeGroupModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <SafeIcon icon={FiEdit2} className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAgeGroup(group.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{group.description}</p>
                  <p className="text-lg font-bold text-primary-600">€{group.monthlyPrice}/month</p>
                  {group.discountRules?.secondChild && (
                    <p className="text-sm text-green-600">2nd child: {group.discountRules.secondChild}% off</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Settings */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Payment Configuration</h3>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Stripe Configuration</h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stripe Publishable Key</label>
                  <input
                    type="text"
                    value={paymentSettings.stripePublishableKey}
                    onChange={(e) => setPaymentSettings({...paymentSettings, stripePublishableKey: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="pk_test_..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stripe Secret Key</label>
                  <input
                    type="password"
                    value={paymentSettings.stripeSecretKey}
                    onChange={(e) => setPaymentSettings({...paymentSettings, stripeSecretKey: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="sk_test_..."
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Accepted Payment Methods</h4>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(paymentSettings.acceptedMethods).map(([method, enabled]) => (
                  <label key={method} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={(e) => setPaymentSettings({
                        ...paymentSettings,
                        acceptedMethods: {
                          ...paymentSettings.acceptedMethods,
                          [method]: e.target.checked
                        }
                      })}
                      className="rounded"
                    />
                    <span className="text-sm font-medium capitalize">
                      {method.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSavePayments}
                className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <SafeIcon icon={FiSave} className="h-4 w-4 mr-2" />
                Save Payment Settings
              </button>
            </div>
          </div>
        )}

        {/* Roles & Custom Fields */}
        {activeTab === 'roles' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Role Custom Fields</h3>
            
            {Object.entries(roleCustomFields).map(([role, fields]) => (
              <div key={role} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-900 capitalize">{role} Fields</h4>
                  <button
                    onClick={() => addCustomField(role)}
                    className="flex items-center px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700"
                  >
                    <SafeIcon icon={FiPlus} className="h-3 w-3 mr-1" />
                    Add Field
                  </button>
                </div>
                
                <div className="space-y-3">
                  {fields.map((field) => (
                    <div key={field.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded">
                      <input
                        type="text"
                        value={field.name}
                        onChange={(e) => updateCustomField(role, field.id, { name: e.target.value })}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded"
                        placeholder="Field name"
                      />
                      <select
                        value={field.type}
                        onChange={(e) => updateCustomField(role, field.id, { type: e.target.value })}
                        className="px-2 py-1 border border-gray-300 rounded"
                      >
                        <option value="text">Text</option>
                        <option value="email">Email</option>
                        <option value="url">URL</option>
                        <option value="tel">Phone</option>
                        <option value="textarea">Textarea</option>
                        <option value="file">File</option>
                      </select>
                      <label className="flex items-center space-x-1">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => updateCustomField(role, field.id, { required: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-sm">Required</span>
                      </label>
                      <button
                        onClick={() => removeCustomField(role, field.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <SafeIcon icon={FiTrash2} className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex justify-end">
              <button
                onClick={handleSaveRoles}
                className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <SafeIcon icon={FiSave} className="h-4 w-4 mr-2" />
                Save Role Settings
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Add/Edit Age Group Modal */}
      {showAgeGroupModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowAgeGroupModal(false)} />
            <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-lg font-semibold">
                  {editingAgeGroup ? 'Edit Age Group' : 'Add Age Group'}
                </h3>
                <button onClick={() => setShowAgeGroupModal(false)} className="text-gray-400 hover:text-gray-600">
                  <SafeIcon icon={FiX} className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleAgeGroupSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={ageGroupForm.name}
                    onChange={(e) => setAgeGroupForm({...ageGroupForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <input
                    type="text"
                    value={ageGroupForm.description}
                    onChange={(e) => setAgeGroupForm({...ageGroupForm, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Price (€)</label>
                  <input
                    type="number"
                    value={ageGroupForm.monthlyPrice}
                    onChange={(e) => setAgeGroupForm({...ageGroupForm, monthlyPrice: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">2nd Child Discount (%)</label>
                  <input
                    type="number"
                    value={ageGroupForm.secondChildDiscount}
                    onChange={(e) => setAgeGroupForm({...ageGroupForm, secondChildDiscount: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    min="0"
                    max="100"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAgeGroupModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg"
                  >
                    {editingAgeGroup ? 'Update' : 'Add'} Group
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

export default SettingsModule;