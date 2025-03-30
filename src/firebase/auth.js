import { auth, db } from "./firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const adminRef = collection(db, "admin");
    const q = query(adminRef, where("email", "==", email)); 

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const adminDoc = querySnapshot.docs[0]; 
      return { user, adminData: adminDoc.data() };
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};


export const registerUser = async (email, password, additionalData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const usersRef = collection(db, "admin"); 
    await addDoc(usersRef, {
      uid: user.uid,
      email: user.email,
      ...additionalData,
    });

    return user;  
  } catch (error) {
    throw error;
  }
};