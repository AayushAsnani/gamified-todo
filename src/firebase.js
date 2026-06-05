import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCXJ3A40AkoaeqP8AcW5ij1vpgLukDNxiM",
  authDomain: "gamified-todo-3ce3b.firebaseapp.com",
  projectId: "gamified-todo-3ce3b",
  storageBucket: "gamified-todo-3ce3b.firebasestorage.app",
  messagingSenderId: "461922597328",
  appId: "1:461922597328:web:57be108aa714ad381fe1d5",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
