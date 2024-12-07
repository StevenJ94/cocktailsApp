// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCo9GanLw51kcSy8EX-mHvlfg1Zl-HpVHs",
  authDomain: "cocktails-e061d.firebaseapp.com",
  projectId: "cocktails-e061d",
  storageBucket: "cocktails-e061d.firebasestorage.app",
  messagingSenderId: "417432019568",
  appId: "1:417432019568:web:5b5f86ebe4182a59cf0ab5",
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export default appFirebase;
