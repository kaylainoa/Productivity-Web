// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtGn7KQbuO6HHnFDcM_uyUEWyM40jgQ88",
  authDomain: "wicse-productivity-web.firebaseapp.com",
  projectId: "wicse-productivity-web",
  storageBucket: "wicse-productivity-web.firebasestorage.app",
  messagingSenderId: "204834732007",
  appId: "1:204834732007:web:34b7b77f9b3fb5a81c2f42",
  measurementId: "G-WTFQ2WHYZZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth, analytics };