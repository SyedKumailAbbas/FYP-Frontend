// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDe-Z-bapn4_WOB39NGcIy_CAv3wJ7hY3M",
  authDomain: "fyp-3bd97.firebaseapp.com",
  projectId: "fyp-3bd97",
  storageBucket: "fyp-3bd97.firebasestorage.app",
  messagingSenderId: "171758742350",
  appId: "1:171758742350:web:b6d3332293cce7e3e08c1f",
  measurementId: "G-P9VQWSFC2V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);