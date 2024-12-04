import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyCEH3UGkIswQuRwGV6eHF_puJbF5BwxpS8",
    authDomain: "clone-2024-e431a.firebaseapp.com",
    projectId: "clone-2024-e431a",
    storageBucket: "clone-2024-e431a.appspot.com",
    messagingSenderId: "187003130717",
    appId: "1:187003130717:web:48f83f1682f748aa54ceb4",
    measurementId: "G-XRK4WGMTET"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth };