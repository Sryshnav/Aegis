import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCDvyKcPVadZc-boEi9TZWTgbFVsMTg15o",
    authDomain: "aegisreal-8b7a3.firebaseapp.com",
    databaseURL: "https://aegisreal-8b7a3-default-rtdb.firebaseio.com",
    projectId: "aegisreal-8b7a3",
    storageBucket: "aegisreal-8b7a3.firebasestorage.app",
    messagingSenderId: "139906334092",
    appId: "1:139906334092:web:8719071c1c95a15aeb2aa9",
    measurementId: "G-Q6Y9CG8GBR"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
