// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Debug environment variables without exposing values
//random comment
const debugEnvVars = () => {
  const envVars = [
    'REACT_APP_FIREBASE_API_KEY',
    'REACT_APP_FIREBASE_AUTH_DOMAIN',
    'REACT_APP_FIREBASE_PROJECT_ID',
    'REACT_APP_FIREBASE_STORAGE_BUCKET',
    'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
    'REACT_APP_FIREBASE_APP_ID',
    'REACT_APP_FIREBASE_MEASUREMENT_ID'
  ];

  console.log('Environment Variables Status:');
  envVars.forEach(varName => {
    console.log(`${varName} is ${process.env[varName] ? 'set' : 'missing'}`);
  });
};

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

let app, analytics, db, auth, storage;

// Initialize Firebase
try {
  debugEnvVars();
  app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
  
  analytics = getAnalytics(app);
  console.log('Analytics initialized');
  
  db = getFirestore(app);
  console.log('Firestore initialized');
  
  auth = getAuth(app);
  console.log('Authentication initialized');
  
  storage = getStorage(app);
  console.log('Storage initialized');
} catch (error) {
  console.error('Error initializing Firebase:', error.message);
  console.error('Full error:', error);
  throw error;
}

export { app, analytics, db, auth, storage };
