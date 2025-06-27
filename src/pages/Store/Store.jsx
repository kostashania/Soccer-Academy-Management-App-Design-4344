import React from 'react';
import { FiShoppingCart, FiEye } from 'react-icons/fi';
import { useData } from '../../contexts/DataContext';
import { toast } from 'react-toastify';

const Store = () => {
  const { products, addToCart, cartItems } = useData();

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Store</h1>
          <p className="text-gray-600">Browse and purchase academy merchandise</p>
        </div>
        {cartItemCount > 0 && (
          <a
            href="#/cart"
            className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100"
          >
            <FiShoppingCart className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">{cartItemCount} items</span>
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold mb-1">{product.name}</h3>
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold">€{product.price.toFixed(2)}</span>
                <span className="text-sm text-gray-600">{product.stock} in stock</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock <= 0}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <FiShoppingCart className="h-4 w-4 mr-1" />
                  {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <button className="px-3 py-2 border rounded-lg hover:bg-gray-50">
                  <FiEye className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Store;