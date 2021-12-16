// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import "firebase/firestore";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBSKAvLXQ8H5XIUUzPy2AOiCzRaE_vSEz8",
  authDomain: "costshare-a0d1e.firebaseapp.com",
  projectId: "costshare-a0d1e",
  storageBucket: "costshare-a0d1e.appspot.com",
  messagingSenderId: "719435901879",
  appId: "1:719435901879:web:58617f2aa4c5167d65d632",
};

// Initialize Firebase
let app = firebase.initializeApp(firebaseConfig);

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const auth = firebase.auth();

const db = getFirestore();

export { auth, db };
