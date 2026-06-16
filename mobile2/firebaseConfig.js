// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBu3UloERXzpfGsNTJDxclX_VVp6m3UKwg",
  authDomain: "gerenciador-de-medicamen-611fc.firebaseapp.com",
  projectId: "gerenciador-de-medicamen-611fc",
  storageBucket: "gerenciador-de-medicamen-611fc.firebasestorage.app",
  messagingSenderId: "895069344990",
  appId: "1:895069344990:web:6ebc7dc03bdc761a9f1e4f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const database = getFirestore(app);