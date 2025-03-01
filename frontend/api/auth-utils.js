// api/auth-utils.js
require('dotenv').config();

const admin = require('firebase-admin');

// Initialize Firebase Admin
//commit 
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    })
  });
}

/**
 * Verify Firebase ID token
 * @param {string} token - Firebase Auth ID token
 * @returns {Promise<Object>} Decoded token
 */
const verifyIdToken = async (token) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying auth token:', error);
    throw new Error('Unauthorized: Invalid token');
  }
};

module.exports = {
  verifyIdToken
};