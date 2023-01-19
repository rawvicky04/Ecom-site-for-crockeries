// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2Nm5BsZO2Dhdd-uNRyK0_3H_IGtCHjgU",
  authDomain: "ecom-project-a8cc3.firebaseapp.com",
  projectId: "ecom-project-a8cc3",
  storageBucket: "ecom-project-a8cc3.appspot.com",
  messagingSenderId: "452945245926",
  appId: "1:452945245926:web:bb11906631c19467266d27"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export {db, auth};