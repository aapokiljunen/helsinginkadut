import { addDoc, collection, doc, getDoc, getDocs, limit, orderBy, query, Timestamp, where } from "firebase/firestore";
import { auth, db } from "./firebase";
import getCurrentMinuteAndSecond from "./Generators";

export const getUsernameFromFirestore = async (): Promise<string | null> => {
    if (!auth.currentUser) return null;
    try {
        const userDoc = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
            return docSnap.data().username || null;
        }
        return null;
    } catch (error) {
        console.error("Error fetching username: ", error);
        return null;
    }
};


export const saveResultToFirestore = async (userId: string, score: SVGAnimatedNumber) => {
    try {
        const resultsRef = collection(db, "results");
        const username = (await getUsernameFromFirestore()) || `Anonyymi${getCurrentMinuteAndSecond()}`;

        await addDoc(resultsRef, {
            userId,
            score,
            username,
            timestamp: new Date().toISOString(),
        });
        console.log("Tulos tallennettu Firestoreen" + userId + score + username);
    } catch (error) {
        console.error("Virhe tallennettaessa tulosta:", error);
    }
};


export interface Result {
    username: string;
    score: number;
    timestamp: string;
}


export const getHighScores = async (): Promise<Result[]> => {
    try {
        const highScoresQuery = query(collection(db, 'results'), orderBy('score', 'desc'), limit(10));
        const snapshot = await getDocs(highScoresQuery);
        return snapshot.docs.map(doc => doc.data() as Result);
    } catch (error) {
        console.error('Virhe haettaessa parhaimpia tuloksia:', error);
        return [];
    }
};

export const getUserResults = async (): Promise<Result[]> => {
    if (!auth.currentUser) {
        return [];
    }

    try {
        const userQuery = query(
            collection(db, 'results'),
            where('userId', '==', auth.currentUser?.uid),  
            orderBy('score', 'desc')  
        );
        const snapshot = await getDocs(userQuery);
        return snapshot.docs.map(doc => doc.data() as Result);
    } catch (error) {
        console.error('Virhe haettaessa käyttäjän tuloksia:', error);
        return [];
    }
};