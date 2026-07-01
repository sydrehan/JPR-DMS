import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your team's configuration
const firebaseConfig = {
  apiKey: "AIzaSyDaf5M7asQoW40--Y_ZgzYnTjTy_xejATc",
  authDomain: "deepsightsih2025.firebaseapp.com",
  databaseURL: "https://deepsightsih2025-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "deepsightsih2025",
  storageBucket: "deepsightsih2025.firebasestorage.app",
  messagingSenderId: "989062053496",
  appId: "1:989062053496:web:39338919d68043d0b5378d",
  measurementId: "G-193XLZVDXJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and export it
export const db = getDatabase(app);
