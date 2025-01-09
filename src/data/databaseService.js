import { ref, get } from "firebase/database";
import { db } from "./firebase.js";

// Obtener datos del usuario por ID
export const getUserData = async (userId) => {
  try {
    const snapshot = await get(ref(db, `users/${userId}`));
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw new Error("No se encontraron datos para este usuario");
    }
  } catch (error) {
    throw new Error("Error al obtener los datos del usuario");
  }
};
