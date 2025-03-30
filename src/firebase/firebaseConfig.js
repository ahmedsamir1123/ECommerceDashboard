import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
    apiKey: "AIzaSyB6GvDXEG5n2XVk_fyJajva_0qgFktR7yw",
    authDomain: "ecommerce-44f95.firebaseapp.com",
    projectId: "ecommerce-44f95",
    storageBucket: "ecommerce-44f95.firebasestorage.app",
    messagingSenderId: "962709123230",
    appId: "1:962709123230:web:0654b550eec363a4a34b8f",
    measurementId: "G-ZWLQJT8JWY"
  };

  

const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
  