// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADU2LCLeXPNE1ehjZDVsbGe90BmdZpY0U",
  authDomain: "aadhar-agro.firebaseapp.com",
  projectId: "aadhar-agro",
  storageBucket: "aadhar-agro.firebasestorage.app",
  messagingSenderId: "122850525653",
  appId: "1:122850525653:web:e7a5b2269e2d614d9a3d5c",
  measurementId: "G-33CQSQBQXJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, analytics, db, auth, storage };