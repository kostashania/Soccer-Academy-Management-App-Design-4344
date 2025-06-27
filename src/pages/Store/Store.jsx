import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import AddProductModal from '../../components/modals/AddProductModal';
import { toast } from 'react-toastify';

const { 
  FiShoppingBag, FiPackage, FiTrendingUp, FiAlertTriangle, FiPlus, 
  FiSearch, FiFilter, FiShoppingCart, FiEye, FiEdit2, FiTrash2 
} = FiIcons;

const Store = () => {
  const { t } = useTheme();
  const { user } = useAuth();
  const { products, addToCart, cartItems, deleteProduct } = useApp();
  const [activeTab, setActiveTab] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const storeStats = [
    {
      name: t('inventory'),
      value: products.length.toString(),
      change: '+12',
      changeType: 'positive',
      icon: FiPackage,
    },
    {
      name: t('lowStock'),
      value: products.filter(p => p.status === 'low-stock').length.toString(),
      change: '-2',
      changeType: 'negative',
      icon: FiAlertTriangle,
    },
    {
      name: 'Total Sales',
      value: `€${products.reduce((sum, p) => sum + (p.sold * p.price), 0).toLocaleString()}`,
      change: '+18%',
      changeType: 'positive',
      icon: FiTrendingUp,
    },
    {
      name: t('bestSellers'),
      value: products.filter(p => p.sold > 50).length.toString(),
      change: '+3',
      changeType: 'positive',
      icon: FiShoppingBag,
    },
  ];

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'apparel', name: 'Apparel' },
    { id: 'equipment', name: 'Equipment' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'nutrition', name: 'Nutrition' },
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

  const handleAddToCart = (product) => {
    if (product.stock <= 0) {
      toast.error('Product is out of stock!');
      return;
    }
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowAddModal(true);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId);
      toast.success('Product deleted successfully!');
    }
  };

  const canManageProducts = user?.role === 'admin';

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
          <p className="text-gray-600 mt-1">
            {canManageProducts ? 'Manage inventory and merchandise' : 'Browse and purchase academy merchandise'}
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          {cartItems.length > 0 && (
            <div className="flex items-center space-x-2 bg-primary-50 px-3 py-2 rounded-lg">
              <SafeIcon icon={FiShoppingCart} className="h-4 w-4 text-primary-600" />
              <span className="text-sm font-medium text-primary-700">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
              </span>
            </div>
          )}
          {canManageProducts && (
            <button
              onClick={() => {
                setEditingProduct(null);
                setShowAddModal(true);
              }}
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <SafeIcon icon={FiPlus} className="h-4 w-4 mr-2" />
              Add Product
            </button>
          )}
        </div>
      </motion.div>

      {/* Stats Grid - Only for admin */}
      {canManageProducts && (
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
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-2">from last month</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

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
              {canManageProducts && (
                <div className="absolute top-3 left-3 flex space-x-1">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="p-1.5 bg-white bg-opacity-90 text-gray-700 rounded-lg hover:bg-opacity-100 transition-colors"
                  >
                    <SafeIcon icon={FiEdit2} className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="p-1.5 bg-white bg-opacity-90 text-red-600 rounded-lg hover:bg-opacity-100 transition-colors"
                  >
                    <SafeIcon icon={FiTrash2} className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-2">SKU: {product.sku}</p>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-gray-900">€{product.price}</span>
                <span className="text-sm text-gray-600">{product.stock} in stock</span>
              </div>
              
              {canManageProducts && (
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>Sold: {product.sold}</span>
                  <span className="capitalize">{product.category}</span>
                </div>
              )}
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock <= 0}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SafeIcon icon={FiShoppingCart} className="h-4 w-4 mr-1" />
                  {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <SafeIcon icon={FiEye} className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Product Modal */}
      <AddProductModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
      />
    </div>
  );
};

export default Store;