// app/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // 👈 Import Auth
import { getAnalytics } from "firebase/analytics";

// ✅ Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnS35OXOtW2D0EWtZ314CZ7FhfaIeMbrQ",
  authDomain: "coaching-management-3e149.firebaseapp.com",
  projectId: "coaching-management-3e149",
  storageBucket: "coaching-management-3e149.firebasestorage.app",
  messagingSenderId: "180423335375",
  appId: "1:180423335375:web:b0186e8b3a55f23dd506ba",
  measurementId: "G-RHKXPFVKCV"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize Firebase Auth
export const auth = getAuth(app);

// ✅ (Optional) Initialize Analytics — only works in browser environment
export const analytics =
  typeof window !== "undefined" ? getAnalytics(app) : null;
