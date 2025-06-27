import React from 'react';
import { FiShoppingCart, FiPlus, FiMinus, FiTrash2, FiCreditCard } from 'react-icons/fi';
import { useData } from '../../contexts/DataContext';
import { toast } from 'react-toastify';

const Cart = () => {
  const { cartItems, updateCartQuantity, removeFromCart, clearCart } = useData();

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      toast.success('Item removed from cart');
    } else {
      updateCartQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    toast.success('Checkout successful! Order placed.');
    clearCart();
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <FiShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
        <a
          href="#/store"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FiShoppingCart className="h-5 w-5 mr-2" />
          Continue Shopping
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Shopping Cart</h1>
          <p className="text-gray-600">{cartItems.length} items in your cart</p>
        </div>
        <button
          onClick={clearCart}
          className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm p-6 border">
              <div className="flex items-center space-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-lg font-bold text-blue-600 mt-1">
                    €{item.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <FiMinus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <FiPlus className="h-4 w-4" />
                  </button>
                </div>
                <div className="text-right">
                  <p className="font-bold">€{(item.price * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="mt-2 p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border h-fit">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium">€{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-medium">Free</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span className="font-medium">€{(total * 0.24).toFixed(2)}</span>
            </div>
            <hr />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>€{(total * 1.24).toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FiCreditCard className="h-5 w-5 mr-2" />
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;