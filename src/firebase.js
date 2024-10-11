// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Importar Firestore
import { getStorage } from "firebase/storage"; // Importar Storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrRDJGuSzhF8l04w_OxjeKcxfN2MwMn3o",
  authDomain: "pelotaris-9f298.firebaseapp.com",
  projectId: "pelotaris-9f298",
  storageBucket: "pelotaris-9f298.appspot.com",
  messagingSenderId: "398887289084",
  appId: "1:398887289084:web:fa5270ce1bde35b4cad779",
  measurementId: "G-9H40JRP27P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore and Storage
const db = getFirestore(app); // Inicializa Firestore
const storage = getStorage(app); // Inicializa Storage

export { db, storage }; // Exporta db y storage para usarlos en otros archivos
