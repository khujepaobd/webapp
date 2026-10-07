// Khuje Pao
// Firebase Configuration

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDQTgeca7E_Rz2-ZbKxHLdJ0MUYnkm1xjw",
  authDomain: "khujepaobd.firebaseapp.com",
  projectId: "khujepaobd",
  storageBucket: "khujepaobd.firebasestorage.app",
  messagingSenderId: "871604700890",
  appId: "1:871604700890:web:0637c86dda084b714b07e3",
  measurementId: "G-WY7DR7KP3K"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export {
  app,
  auth
};