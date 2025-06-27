import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useApp } from '../../contexts/AppContext';
import { toast } from 'react-toastify';

const { FiX, FiDollarSign, FiUser, FiCreditCard, FiFileText, FiPackage } = FiIcons;

const AddPaymentModal = ({ isOpen, onClose, payment = null }) => {
  const { addPayment, updatePayment, users = [], students = [], products = [] } = useApp();
  
  const [formData, setFormData] = useState({
    studentName: payment?.studentName || '',
    parentName: payment?.parentName || '',
    amount: payment?.amount || '',
    method: payment?.method || 'card',
    description: payment?.description || '',
    status: payment?.status || 'pending',
    paymentType: 'subscription', // subscription, store_item, manual
    productId: '',
    quantity: 1
  });

  const [availableStudents, setAvailableStudents] = useState([]);
  const [selectedParent, setSelectedParent] = useState(null);

  // Safe array access with fallbacks
  const parents = Array.isArray(users) ? users.filter(user => user.role === 'parent') : [];
  const allStudents = [
    ...(Array.isArray(students) ? students : []),
    ...(Array.isArray(users) ? users.filter(user => user.role === 'player') : [])
  ];

  // Update available students when parent is selected
  useEffect(() => {
    if (formData.parentName) {
      const parent = parents.find(p => p.name === formData.parentName);
      if (parent) {
        setSelectedParent(parent);
        // Get children for this parent
        const parentStudents = allStudents.filter(student => 
          student.parentId === parent.id || 
          (student.role === 'player' && student.parentName === parent.name)
        );
        setAvailableStudents(parentStudents);
      }
    } else {
      setAvailableStudents(allStudents);
      setSelectedParent(null);
    }
  }, [formData.parentName, parents, allStudents]);

  // Auto-fill parent when student is selected
  useEffect(() => {
    if (formData.studentName && !formData.parentName) {
      const student = allStudents.find(s => s.name === formData.studentName);
      if (student) {
        // Find parent for this student
        const parent = parents.find(p => 
          p.id === student.parentId || p.name === student.parentName
        );
        if (parent) {
          setFormData(prev => ({
            ...prev,
            parentName: parent.name
          }));
        }
      }
    }
  }, [formData.studentName, parents, allStudents]);

  // Update amount when product is selected
  useEffect(() => {
    if (formData.paymentType === 'store_item' && formData.productId && Array.isArray(products)) {
      const product = products.find(p => p.id === formData.productId);
      if (product) {
        const totalAmount = product.price * formData.quantity;
        setFormData(prev => ({
          ...prev,
          amount: totalAmount.toFixed(2),
          description: `Store purchase: ${product.name} (x${formData.quantity})`
        }));
      }
    }
  }, [formData.paymentType, formData.productId, formData.quantity, products]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.studentName || !formData.parentName || !formData.amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    const paymentData = {
      ...formData,
      amount: parseFloat(formData.amount),
      currency: 'EUR'
    };

    if (payment) {
      updatePayment(payment.id, paymentData);
      toast.success('Payment updated successfully!');
    } else {
      addPayment(paymentData);
      toast.success('Payment added successfully!');
    }

    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      studentName: '',
      parentName: '',
      amount: '',
      method: 'card',
      description: '',
      status: 'pending',
      paymentType: 'subscription',
      productId: '',
      quantity: 1
    });
    onClose();
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
              onClick={resetForm}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {payment ? 'Edit Payment' : 'Add New Payment'}
                  </h3>
                  <button
                    onClick={resetForm}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={FiX} className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Payment Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Type *
                  </label>
                  <select
                    name="paymentType"
                    value={formData.paymentType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="subscription">Subscription/Monthly Fee</option>
                    <option value="store_item">Store Item Purchase</option>
                    <option value="manual">Manual/Other</option>
                  </select>
                </div>

                {/* Store Item Selection */}
                {formData.paymentType === 'store_item' && Array.isArray(products) && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product *
                      </label>
                      <div className="relative">
                        <SafeIcon icon={FiPackage} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <select
                          name="productId"
                          value={formData.productId}
                          onChange={handleInputChange}
                          className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          required
                        >
                          <option value="">Select a product</option>
                          {products.map(product => (
                            <option key={product.id} value={product.id}>
                              {product.name} - €{product.price}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        min="1"
                      />
                    </div>
                  </>
                )}

                {/* Parent Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent Name *
                  </label>
                  <div className="relative">
                    <SafeIcon icon={FiUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleInputChange}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    >
                      <option value="">Select parent</option>
                      {parents.map(parent => (
                        <option key={parent.id} value={parent.name}>
                          {parent.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Student Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student Name *
                  </label>
                  <div className="relative">
                    <SafeIcon icon={FiUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleInputChange}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    >
                      <option value="">Select student</option>
                      {availableStudents.map(student => (
                        <option key={student.id} value={student.name}>
                          {student.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedParent && (
                    <p className="text-xs text-gray-500 mt-1">
                      Showing children of {selectedParent.name}
                    </p>
                  )}
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (€) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">€</span>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      className="pl-8 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                      disabled={formData.paymentType === 'store_item' && formData.productId}
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <div className="relative">
                    <SafeIcon icon={FiCreditCard} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                      name="method"
                      value={formData.method}
                      onChange={handleInputChange}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="card">Credit Card</option>
                      <option value="bank">Bank Transfer</option>
                      <option value="cash">Cash</option>
                      <option value="stripe">Stripe</option>
                    </select>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <div className="relative">
                    <SafeIcon icon={FiFileText} className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Payment description"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    {payment ? 'Update Payment' : 'Add Payment'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddPaymentModal;