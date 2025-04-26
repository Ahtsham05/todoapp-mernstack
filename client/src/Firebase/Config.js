// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA7JndJBGkpv3YmiYLIqL3lZkKGQyMAXgU",
  authDomain: "todoapp-6c1e5.firebaseapp.com",
  projectId: "todoapp-6c1e5",
  storageBucket: "todoapp-6c1e5.firebasestorage.app",
  messagingSenderId: "1089416963763",
  appId: "1:1089416963763:web:0119bb54d903fe4d1cb2c6",
  measurementId: "G-HF028TFG5D"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app)
export const provider = new GoogleAuthProvider();
export const auth = getAuth();