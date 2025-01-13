import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, db } from "./firebase";

export const registerUser = async (firstName, lastName, email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, {
            displayName: `${firstName} ${lastName}`,
        });

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
