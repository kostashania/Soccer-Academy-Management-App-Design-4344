import React, { useState, useRef } from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import { toast } from 'react-toastify';

const { FiBriefcase, FiGlobe, FiCalendar, FiEye, FiMousePointer, FiUpload, FiSave, FiEdit2, FiImage, FiExternalLink, FiBarChart2, FiTrendingUp, FiActivity, FiDollarSign } = FiIcons;

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
          <div
            key={stat.name}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 animate-slideUp"
            style={{ animationDelay: `${index * 0.1}s` }}
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
          </div>
        ))}
      </div>

      {/* Current Package Info */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
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
            <p className="font-medium">{user?.first_name || user?.full_name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white animate-fadeIn">
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
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <nav className="flex space-x-1 p-2">
          {[
            { id: 'overview', name: 'Overview', icon: FiBarChart2 },
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
      <div className="animate-fadeIn">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'ads' && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">My Advertisements - Coming Soon</h3>
            <p className="text-gray-600">Advertisement management features will be available soon.</p>
          </div>
        )}
        {activeTab === 'analytics' && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Analytics - Coming Soon</h3>
            <p className="text-gray-600">Detailed analytics and reporting features will be available soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SponsorDashboard;