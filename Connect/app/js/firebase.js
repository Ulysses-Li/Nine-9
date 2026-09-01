import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { initializeFirestore } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDeoH-qJ_oyBd6r8O0HinbPMnINTYpZCW8",
  authDomain: "jic-business-cards.firebaseapp.com",
  projectId: "jic-business-cards",
  storageBucket: "jic-business-cards.firebasestorage.app",
  messagingSenderId: "859880553377",
  appId: "1:859880553377:web:e76e50a93ec98dccc4e9e0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true
});

export { auth, db, firebaseConfig };
