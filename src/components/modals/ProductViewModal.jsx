import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useApp } from '../../contexts/AppContext';
import { toast } from 'react-toastify';

const { FiX, FiShoppingCart, FiPackage, FiTag, FiInfo } = FiIcons;

const ProductViewModal = ({ isOpen, onClose, product }) => {
  const { addToCart, getCategoryById } = useApp();

  if (!product) return null;

  const category = getCategoryById(product.category);

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast.error('Product is out of stock!');
      return;
    }
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
    onClose();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in-stock': return 'bg-green-100 text-green-800';
      case 'low-stock': return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={onClose}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Product Details</h3>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiX} className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Image */}
                  <div className="space-y-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(product.status)}`}>
                        {product.status.replace('-', ' ')}
                      </span>
                      <span className="text-sm text-gray-600">SKU: {product.sku}</span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
                      <p className="text-3xl font-bold text-primary-600">€{product.price.toFixed(2)}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <SafeIcon icon={FiTag} className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Category:</span>
                        <span className="text-sm font-medium capitalize">{category?.name || product.category}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <SafeIcon icon={FiPackage} className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">Stock:</span>
                        <span className="text-sm font-medium">{product.stock} available</span>
                      </div>

                      {product.size && (
                        <div className="flex items-center space-x-2">
                          <SafeIcon icon={FiInfo} className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">Size:</span>
                          <span className="text-sm font-medium">{product.size}</span>
                        </div>
                      )}

                      {product.sold > 0 && (
                        <div className="flex items-center space-x-2">
                          <SafeIcon icon={FiInfo} className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">Sold:</span>
                          <span className="text-sm font-medium">{product.sold} units</span>
                        </div>
                      )}
                    </div>

                    {product.description && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
                      </div>
                    )}

                    {(product.customField1 || product.customField2) && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Additional Information</h4>
                        <div className="space-y-1">
                          {product.customField1 && (
                            <p className="text-sm text-gray-600">{product.customField1}</p>
                          )}
                          {product.customField2 && (
                            <p className="text-sm text-gray-600">{product.customField2}</p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="pt-4">
                      <button
                        onClick={handleAddToCart}
                        disabled={product.stock <= 0}
                        className="w-full flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <SafeIcon icon={FiShoppingCart} className="h-5 w-5 mr-2" />
                        {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProductViewModal;