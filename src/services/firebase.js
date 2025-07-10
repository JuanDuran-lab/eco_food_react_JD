import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBN8QJGd-92LEKgZXCZDrZJPtrPZLOAGT4",
  authDomain: "eco-food-fab2f.firebaseapp.com",
  projectId: "eco-food-fab2f",
  storageBucket: "eco-food-fab2f.appspot.com",
  messagingSenderId: "147803103451",
  appId: "1:147803103451:web:668c8ac8f9d819b1506cfe"
};

// Instancia principal
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Instancia secundaria (para registrar sin cerrar sesión admin)
const secondaryApp = initializeApp(firebaseConfig, "Secondary");
export const secondaryAuth = getAuth(secondaryApp);
