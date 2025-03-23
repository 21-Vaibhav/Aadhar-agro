// api/create-order.js
require('dotenv').config();

const Razorpay = require('razorpay');
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
    const { amount, currency = 'INR', orderId, receipt } = req.body;

    if (!amount || !orderId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    console.log(`Received Order Request: amount=${amount}, orderId=${orderId}, userId=${userId}`);

    // Initialize Razorpay instance
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: receipt || `receipt_${orderId}`,
      notes: {
        orderId: orderId,
        userId: userId
      }
    });

    console.log('Order Created:', order);

    return res.status(200).json({
      id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      stack: error.stack
    });
  }
};