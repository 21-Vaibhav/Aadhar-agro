// src/services/razorpayService.js
import { getAuth } from 'firebase/auth';

// Replace with your API endpoint URLs
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://aadhar-agro.vercel.app/api' 
  : 'http://localhost:3000/api';

/**
 * Create a Razorpay order
 * @param {number} amount - Amount in INR
 * @param {string} orderId - Firebase order document ID
 * @returns {Promise<Object>} Razorpay order details
 */
export const createRazorpayOrder = async (amount, orderId) => {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    const token = await currentUser.getIdToken();
    
    const response = await fetch(`${API_URL}/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        amount,
        orderId,
        receipt: `order_${orderId}`
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create Razorpay order');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
};

/**
 * Verify Razorpay payment
 * @param {Object} paymentData - Razorpay payment response
 * @param {string} firebaseOrderId - Firebase order document ID
 * @returns {Promise<Object>} Verification result
 */
export const verifyRazorpayPayment = async (paymentData, firebaseOrderId) => {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    const token = await currentUser.getIdToken();
    
    const response = await fetch(`${API_URL}/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ...paymentData,
        firebaseOrderId
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to verify payment');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};

/**
 * Load Razorpay script dynamically
 * @returns {Promise<void>}
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      return resolve();
    }
    
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = resolve;
    script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
    document.body.appendChild(script);
  });
};