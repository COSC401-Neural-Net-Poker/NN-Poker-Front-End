import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCPKlZhO3bwWT03Q6QjelQ_yyF_P1OPo-M",
  authDomain: "nn-poker.firebaseapp.com",
  projectId: "nn-poker",
  storageBucket: "nn-poker.appspot.com",
  messagingSenderId: "927627331489",
  appId: "1:927627331489:web:cb081e385407e269756de0"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();