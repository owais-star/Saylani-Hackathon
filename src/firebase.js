import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDWlV7UVxlfRPMiWfB4_wUkH86hBJ773fc",
  authDomain: "favouritecuisines.firebaseapp.com",
  databaseURL: "https://favouritecuisines-default-rtdb.firebaseio.com",
  projectId: "favouritecuisines",
  storageBucket: "favouritecuisines.appspot.com",
  messagingSenderId: "982457233795",
  appId: "1:982457233795:web:c384e9c7f0d835fbe786b6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage(app);

export { auth, db, app, storage }