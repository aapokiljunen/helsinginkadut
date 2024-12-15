import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase"; 

export const getUsernameFromFirestore = async (): Promise<string | null> => {
  const user = auth.currentUser;

  if (user) {
    const userDocRef = doc(db, "users", user.uid); 
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData?.username || null; 
    }
  }
  return null; 
};
