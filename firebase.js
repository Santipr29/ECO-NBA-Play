import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, orderBy, query, onSnapshot, where, setDoc, doc, getDoc} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
  UserCredential
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCI1veTV4rnpeg-Fn220rwVvDh1ihOpf4U",
  authDomain: "dca-perez.firebaseapp.com",
  projectId: "dca-perez",
  storageBucket: "dca-perez.appspot.com",
  messagingSenderId: "116722604539",
  appId: "1:116722604539:web:62b7afc51095347ef1535e",
  measurementId: "G-M6EX5SP9ML"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const signUp = async(email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log(user);
    return user;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(errorCode, errorMessage);
    return error;
  }
}

export const logIn = async(email, password) => {
setPersistence(auth, browserSessionPersistence)
  .then(() => {
    return signInWithEmailAndPassword(auth, email, password);
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
    return error
});
}

const db = getFirestore(app);

export const addUsersDB = async() => {
try {
    user.uid = UserCredential
    await setDoc(doc(db, "users", user.uid),{
        first:"",
        last:"",
        email:"",
        img:"",
        score:"",
    })
    console.log("Document written with ID: ", user.uid);
    return true
  } catch (e) {
    console.error("Error adding document: ", e);
    return false
}}

export const getUsersDB = async () => {
    const users = [];

    const q=query(collection(db,"users"), orderBy("score"))
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(doc.id, " => ", data);
      users.push(data);
    });
    return users
};