// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { setLogLevel } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyBDOO-k008k7DIISIyr-1AzT3uK8jMVaoM",
    authDomain: "ghor-kalyug.firebaseapp.com",
    projectId: "ghor-kalyug",
    storageBucket: "ghor-kalyug.firebasestorage.app",
    messagingSenderId: "934734027946",
    appId: "1:934734027946:web:80be4718db8a283f6704d3",
    measurementId: "G-4CT335C3ZL"
  };
  
setLogLevel("debug");
// Initialize Firebase
export const app = initializeApp(firebaseConfig); 
export const auth = getAuth(app); 
