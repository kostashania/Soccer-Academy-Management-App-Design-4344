import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useTheme } from '../../contexts/ThemeContext';

const { 
  FiShoppingBag, FiPackage, FiTrendingUp, FiAlertTriangle, 
  FiPlus, FiSearch, FiFilter, FiShoppingCart, FiEye 
} = FiIcons;

const Store = () => {
  const { t } = useTheme();
  const [activeTab, setActiveTab] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const storeStats = [
    {
      name: t('inventory'),
      value: '234',
      change: '+12',
      changeType: 'positive',
      icon: FiPackage,
    },
    {
      name: t('lowStock'),
      value: '5',
      change: '-2',
      changeType: 'negative',
      icon: FiAlertTriangle,
    },
    {
      name: 'Total Sales',
      value: '€3,450',
      change: '+18%',
      changeType: 'positive',
      icon: FiTrendingUp,
    },
    {
      name: t('bestSellers'),
      value: '12',
      change: '+3',
      changeType: 'positive',
      icon: FiShoppingBag,
    },
  ];

  const products = [
    {
      id: 1,
      name: 'Training Jersey',
      category: 'apparel',
      sku: 'TJ-001',
      price: 35,
      stock: 45,
      sold: 89,
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop',
      status: 'in-stock'
    },
    {
      id: 2,
      name: 'Soccer Boots',
      category: 'equipment',
      sku: 'SB-002',
      price: 85,
      stock: 23,
      sold: 67,
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300&h=300&fit=crop',
      status: 'in-stock'
    },
    {
      id: 3,
      name: 'Training Shorts',
      category: 'apparel',
      sku: 'TS-003',
      price: 25,
      stock: 78,
      sold: 123,
      image: 'https://images.unsplash.com/photo-1506629905607-d9c7e5b4c0b2?w=300&h=300&fit=crop',
      status: 'in-stock'
    },
    {
      id: 4,
      name: 'Soccer Ball',
      category: 'equipment',
      sku: 'SB-004',
      price: 45,
      stock: 5,
      sold: 234,
      image: 'https://images.unsplash.com/photo-1614632537190-23e4b2efe8c0?w=300&h=300&fit=crop',
      status: 'low-stock'
    },
    {
      id: 5,
      name: 'Water Bottle',
      category: 'accessories',
      sku: 'WB-005',
      price: 12,
      stock: 156,
      sold: 89,
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=300&fit=crop',
      status: 'in-stock'
    },
    {
      id: 6,
      name: 'Shin Guards',
      category: 'equipment',
      sku: 'SG-006',
      price: 28,
      stock: 0,
      sold: 45,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
      status: 'out-of-stock'
    },
  ];

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'apparel', name: 'Apparel' },
    { id: 'equipment', name: 'Equipment' },
    { id: 'accessories', name: 'Accessories' },
  ];

  const recentOrders = [
    {
      id: 1,
      customerName: 'Mike Johnson',
      items: ['Training Jersey', 'Soccer Boots'],
      total: '€120',
      date: '2024-03-15',
      status: 'completed'
    },
    {
      id: 2,
      customerName: 'Sarah Smith',
      items: ['Water Bottle', 'Shin Guards'],
      total: '€40',
      date: '2024-03-14',
      status: 'pending'
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'in-stock': return 'bg-green-100 text-green-800';
      case 'low-stock': return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('store')}</h1>
          <p className="text-gray-600 mt-1">Manage inventory and merchandise</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <SafeIcon icon={FiPlus} className="h-4 w-4 mr-2" />
            Add Product
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {storeStats.map((stat, index) => (
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
              <div className="p-3 bg-primary-50 rounded-lg">
                <SafeIcon icon={stat.icon} className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span
                className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 ml-2">from last month</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-soft border border-gray-100">
        <nav className="flex space-x-1 p-2">
          {[
            { id: 'products', name: 'Products' },
            { id: 'orders', name: 'Orders' },
            { id: 'analytics', name: 'Analytics' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
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
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <SafeIcon icon={FiFilter} className="h-4 w-4 mr-2" />
                  More Filters
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden hover:shadow-medium transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(product.status)}`}>
                        {product.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">SKU: {product.sku}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-gray-900">€{product.price}</span>
                      <span className="text-sm text-gray-600">{product.stock} in stock</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <span>Sold: {product.sold}</span>
                      <span className="capitalize">{product.category}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="flex-1 flex items-center justify-center px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                        <SafeIcon icon={FiShoppingCart} className="h-4 w-4 mr-1" />
                        Add to Cart
                      </button>
                      <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <SafeIcon icon={FiEye} className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-xl shadow-soft border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-6 font-medium text-gray-600">Order ID</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-600">Customer</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-600">Items</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-600">Total</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-600">Date</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium text-gray-900">#{order.id}</td>
                      <td className="py-4 px-6 text-gray-600">{order.customerName}</td>
                      <td className="py-4 px-6 text-gray-600">{order.items.join(', ')}</td>
                      <td className="py-4 px-6 font-semibold text-gray-900">{order.total}</td>
                      <td className="py-4 px-6 text-gray-600">{order.date}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
              <div className="space-y-4">
                {products.slice(0, 5).map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-500 w-6">#{index + 1}</span>
                      <img src={product.image} alt={product.name} className="w-8 h-8 rounded object-cover mx-3" />
                      <span className="font-medium text-gray-900">{product.name}</span>
                    </div>
                    <span className="text-sm text-gray-600">{product.sold} sold</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales by Category</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Equipment</span>
                  <div className="flex items-center">
                    <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
                      <div className="w-16 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">67%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Apparel</span>
                  <div className="flex items-center">
                    <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
                      <div className="w-8 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">33%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Accessories</span>
                  <div className="flex items-center">
                    <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
                      <div className="w-6 h-2 bg-purple-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">25%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Store;