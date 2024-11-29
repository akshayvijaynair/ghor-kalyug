// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { setLogLevel } from "firebase/firestore";


const firebaseConfig = {
    apiKey: import.meta.env.apiKey,
    authDomain: import.meta.env.authDomain,
    projectId: import.meta.env.projectId,
    storageBucket: import.meta.env.storageBucket,
    messagingSenderId: import.meta.env.messagingSenderId,
    appId: import.meta.env.appId,
    measurementId: import.meta.env.measurementId
  };
  
setLogLevel("debug");
// Initialize Firebase
export const app = initializeApp(firebaseConfig); 
export const auth = getAuth(app); 
