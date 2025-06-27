import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { toast } from 'react-toastify';

const { 
  FiBriefcase, FiGlobe, FiCalendar, FiEye, FiMousePointer, 
  FiUpload, FiSave, FiEdit2, FiImage, FiExternalLink,
  FiBarChart3, FiTrendingUp, FiActivity, FiDollarSign
} = FiIcons;

const SponsorDashboard = () => {
  const { user } = useAuth();
  const { sponsorAds, updateSponsorAd, uploadFile } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [editingAd, setEditingAd] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Get sponsor's ads
  const myAds = sponsorAds?.filter(ad => ad.sponsor_id === user?.id) || [];
  
  // Mock analytics data
  const analytics = {
    totalImpressions: 12543,
    totalClicks: 234,
    clickRate: 1.87,
    activeAds: myAds.filter(ad => ad.status === 'active').length
  };

  const [adFormData, setAdFormData] = useState({
    ad_text: '',
    website_url: user?.website_url || '',
    ad_start_date: '',
    ad_end_date: '',
    logo: user?.logo || '',
    status: 'active'
  });

  const handleAdUpdate = async (adId, updates) => {
    try {
      await updateSponsorAd(adId, updates);
      toast.success('Ad updated successfully!');
      setEditingAd(null);
    } catch (error) {
      toast.error('Failed to update ad');
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    setUploading(true);
    try {
      const logoUrl = await uploadFile(file, 'sponsor-logos');
      setAdFormData(prev => ({ ...prev, logo: logoUrl }));
      toast.success('Logo uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload logo');
    } finally {
      setUploading(false);
    }
  };

  const getPackageColor = (packageType) => {
    switch (packageType) {
      case 'bronze': return 'bg-orange-100 text-orange-800';
      case 'silver': return 'bg-gray-100 text-gray-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'custom': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isAdActive = (ad) => {
    const now = new Date();
    const startDate = new Date(ad.ad_start_date);
    const endDate = new Date(ad.ad_end_date);
    return now >= startDate && now <= endDate && ad.status === 'active';
  };

  const canEditAd = (ad) => {
    const endDate = new Date(ad.ad_end_date);
    return new Date() <= endDate;
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { name: 'Total Impressions', value: analytics.totalImpressions.toLocaleString(), icon: FiEye, color: 'blue' },
          { name: 'Total Clicks', value: analytics.totalClicks.toLocaleString(), icon: FiMousePointer, color: 'green' },
          { name: 'Click Rate', value: `${analytics.clickRate}%`, icon: FiTrendingUp, color: 'purple' },
          { name: 'Active Ads', value: analytics.activeAds.toString(), icon: FiActivity, color: 'orange' }
        ].map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-soft p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 bg-${stat.color}-50 rounded-lg`}>
                <SafeIcon icon={stat.icon} className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Current Package Info */}
      <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Sponsorship Package</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              {user?.logo ? (
                <img src={user.logo} alt="Company Logo" className="w-12 h-12 object-contain" />
              ) : (
                <SafeIcon icon={FiBriefcase} className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{user?.company_name}</h4>
              <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full capitalize ${getPackageColor(user?.package_type)}`}>
                {user?.package_type} Package
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Contact</p>
            <p className="font-medium">{user?.full_name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'Ad banner updated', time: '2 hours ago', type: 'update' },
            { action: 'Logo uploaded', time: '1 day ago', type: 'upload' },
            { action: 'Campaign started', time: '3 days ago', type: 'start' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <SafeIcon icon={FiActivity} className="h-4 w-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const MyAdsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">My Advertisements</h3>
        {user?.website_url && (
          <a
            href={user.website_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-primary-600 hover:text-primary-700"
          >
            <SafeIcon icon={FiExternalLink} className="h-4 w-4 mr-1" />
            Visit Website
          </a>
        )}
      </div>

      {myAds.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-soft border border-gray-100">
          <SafeIcon icon={FiBriefcase} className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Advertisements Yet</h3>
          <p className="text-gray-600">Contact our marketing team to create your first ad campaign.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {myAds.map((ad) => (
            <div key={ad.id} className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {ad.logo && (
                    <img src={ad.logo} alt="Ad Logo" className="w-12 h-12 object-contain rounded" />
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900">{ad.ad_text || 'Advertisement'}</h4>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      isAdActive(ad) ? 'bg-green-100 text-green-800' : 
                      ad.status === 'expired' ? 'bg-red-100 text-red-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {isAdActive(ad) ? 'Active' : ad.status}
                    </span>
                  </div>
                </div>
                {canEditAd(ad) && (
                  <button
                    onClick={() => setEditingAd(ad)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiEdit2} className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Start Date:</span>
                    <p className="font-medium">{new Date(ad.ad_start_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">End Date:</span>
                    <p className="font-medium">{new Date(ad.ad_end_date).toLocaleDateString()}</p>
                  </div>
                </div>
                
                {ad.website_url && (
                  <div>
                    <span className="text-gray-600 text-sm">Website:</span>
                    <a 
                      href={ad.website_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block text-blue-600 hover:text-blue-700 truncate"
                    >
                      {ad.website_url}
                    </a>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{(ad.impressions || 0).toLocaleString()}</div>
                    <div className="text-xs text-gray-600">Impressions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{ad.clicks || 0}</div>
                    <div className="text-xs text-gray-600">Clicks</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Ad Modal */}
      {editingAd && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setEditingAd(null)} />
            <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Advertisement</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ad Text</label>
                    <textarea
                      value={editingAd.ad_text}
                      onChange={(e) => setEditingAd({...editingAd, ad_text: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows={3}
                      placeholder="Enter your ad message"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                    <input
                      type="url"
                      value={editingAd.website_url}
                      onChange={(e) => setEditingAd({...editingAd, website_url: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
                    <div className="flex items-center space-x-4">
                      {editingAd.logo && (
                        <img src={editingAd.logo} alt="Current Logo" className="w-12 h-12 object-contain rounded" />
                      )}
                      <div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                        >
                          <SafeIcon icon={FiUpload} className="h-4 w-4 mr-2" />
                          {uploading ? 'Uploading...' : 'Upload New Logo'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setEditingAd(null)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleAdUpdate(editingAd.id, {
                      ad_text: editingAd.ad_text,
                      website_url: editingAd.website_url,
                      logo: adFormData.logo || editingAd.logo
                    })}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    <SafeIcon icon={FiSave} className="h-4 w-4 mr-2 inline" />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const AnalyticsTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Performance Analytics</h3>
      
      <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
        <h4 className="font-medium text-gray-900 mb-4">Monthly Performance</h4>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <SafeIcon icon={FiBarChart3} className="h-12 w-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">Analytics chart will be displayed here</p>
            <p className="text-sm text-gray-400 mt-1">Showing impressions and clicks over time</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
          <h4 className="font-medium text-gray-900 mb-4">Top Performing Ads</h4>
          <div className="space-y-3">
            {myAds.slice(0, 3).map((ad, index) => (
              <div key={ad.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">{ad.ad_text || `Ad ${index + 1}`}</span>
                <div className="text-right">
                  <div className="text-sm font-bold">{ad.clicks || 0} clicks</div>
                  <div className="text-xs text-gray-500">{((ad.clicks || 0) / (ad.impressions || 1) * 100).toFixed(1)}% CTR</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
          <h4 className="font-medium text-gray-900 mb-4">Engagement Metrics</h4>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Average CTR</span>
              <span className="font-medium">{analytics.clickRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Best Performing Day</span>
              <span className="font-medium">Monday</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Peak Hours</span>
              <span className="font-medium">2-4 PM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
            {user?.logo ? (
              <img src={user.logo} alt="Company Logo" className="w-12 h-12 object-contain" />
            ) : (
              <SafeIcon icon={FiBriefcase} className="h-8 w-8" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-1">Sponsor Dashboard</h1>
            <p className="text-purple-100">{user?.company_name} • {user?.package_type} Package</p>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-100">
        <nav className="flex space-x-1 p-2">
          {[
            { id: 'overview', name: 'Overview', icon: FiBarChart3 },
            { id: 'ads', name: 'My Ads', icon: FiImage },
            { id: 'analytics', name: 'Analytics', icon: FiTrendingUp }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
      >
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'ads' && <MyAdsTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
      </motion.div>
    </div>
  );
};

export default SponsorDashboard;