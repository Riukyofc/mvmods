import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBLjGjXUrooqb5Ogkjwlj6YHnlYR4nqVrE",
  authDomain: "mvmods-1ab81.firebaseapp.com",
  projectId: "mvmods-1ab81",
  storageBucket: "mvmods-1ab81.firebasestorage.app",
  messagingSenderId: "99153915975",
  appId: "1:99153915975:web:be4e0072e4c5e121104162",
  measurementId: "G-619CE0T8ZT"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
