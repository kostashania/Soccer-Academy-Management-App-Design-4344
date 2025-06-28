import React from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useApp } from '../../contexts/AppContext';

const { FiGlobe, FiExternalLink } = FiIcons;

const PlatformPage = () => {
  const { platformButtons = [] } = useApp();

  const handleButtonClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform</h1>
        <p className="text-gray-600">Quick access to external platforms and tools</p>
      </div>

      {platformButtons.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
          <SafeIcon icon={FiGlobe} className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No platform links available yet.</p>
          <p className="text-sm text-gray-400 mt-1">Contact your administrator to add platform links.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {platformButtons.map((button) => (
            <button
              key={button.id}
              onClick={() => handleButtonClick(button.url)}
              className="flex items-center justify-between p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-primary-300 group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-primary-50 rounded-lg group-hover:bg-primary-100 transition-colors">
                  <SafeIcon icon={FiGlobe} className="h-6 w-6 text-primary-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900 group-hover:text-primary-700 transition-colors">
                    {button.text}
                  </p>
                  <p className="text-sm text-gray-500 truncate max-w-32">
                    {button.url}
                  </p>
                </div>
              </div>
              <SafeIcon 
                icon={FiExternalLink} 
                className="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors" 
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlatformPage;