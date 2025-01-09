import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Configuración de Firebase (usa tus credenciales de Firebase Console)
const firebaseConfig = {
    apiKey: "AIzaSyBo-3Xsur1zYrxATIKf9Qd4N83_8Ga-Urk",
    authDomain: "cotizacionesapp-abf77.firebaseapp.com",
    databaseURL: "https://cotizacionesapp-abf77-default-rtdb.firebaseio.com",
    projectId: "cotizacionesapp-abf77",
    storageBucket: "cotizacionesapp-abf77.firebasestorage.app",
    messagingSenderId: "21791803749",
    appId: "1:21791803749:web:a60ee0c869541ed12ab98c",
    measurementId: "G-R30NN5S5K8"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db };
