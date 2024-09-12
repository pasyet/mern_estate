// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-estate-b7aef.firebaseapp.com",
    projectId: "mern-estate-b7aef",
    storageBucket: "mern-estate-b7aef.appspot.com",
    messagingSenderId: "110583598328",
    appId: "1:110583598328:web:4e92528b3bf9c31177bf0d"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);