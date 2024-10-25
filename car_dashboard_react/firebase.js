import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAhD7liFP3-j2RPuDzv2nD3whCaCZ7JgZE",
    authDomain: "car-dashboard-f0dcb.firebaseapp.com",
    databaseURL: "https://car-dashboard-f0dcb-default-rtdb.firebaseio.com",
    projectId: "car-dashboard-f0dcb",
    storageBucket: "car-dashboard-f0dcb.appspot.com",
    messagingSenderId: "150478124218",
    appId: "1:150478124218:web:bd60dc7f749982f8657e83"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();

export { db, ref, onValue };
