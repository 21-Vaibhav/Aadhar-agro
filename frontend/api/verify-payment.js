// api/verify-payment.js
require('dotenv').config();

const crypto = require('crypto');
const { verifyIdToken } = require('./auth-utils');

module.exports = async (req, res) => {
  // Get the origin from request headers
  const origin = req.headers.origin;
  
  // CORS headers - allow specific origins
  res.setHeader('Access-Control-Allow-Origin', origin || 'https://www.aadharagro.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Verify Firebase auth token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    }
    
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await verifyIdToken(token);
    const userId = decodedToken.uid;
    
    // Parse request body
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      firebaseOrderId 
    } = req.body;
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !firebaseOrderId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Verify payment signature
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(payload)
      .digest('hex');
    
    const isSignatureValid = expectedSignature === razorpay_signature;
    
    if (!isSignatureValid) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }
    
    // If signature is valid, return success
    return res.status(200).json({ 
      success: true,
      orderId: firebaseOrderId,
      message: 'Payment verified successfully' 
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};