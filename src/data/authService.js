import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, db } from "./firebase";

// Registrar usuario y guardar datos
export const registerUser = async (firstName, lastName, email, password) => {
    try {
        // Crear el usuario con email y contraseña
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Actualizar displayName con el nombre y apellido
        await updateProfile(user, {
            displayName: `${firstName} ${lastName}`,
        });

        // Guardar datos adicionales en Realtime Database
        await set(ref(db, `users/${user.uid}`), {
            firstName,
            lastName,
            email,
        });

        return user;
    } catch (error) {
        throw new Error(error.message);
    }
};
