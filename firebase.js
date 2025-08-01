// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAC3OBuV8LxNuP1WND-8mB8yqz_IgxzzNQ",
  authDomain: "honeybunapp-5f96e.firebaseapp.com",
  projectId: "honeybunapp-5f96e",
  storageBucket: "honeybunapp-5f96e.appspot.com",
  messagingSenderId: "920031816754",
  appId: "1:920031816754:web:8ecbb7368afb284ec4602b"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
