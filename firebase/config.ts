import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDeJKAY5E5NKr1ofMacU_MXzsobz7rqS0s",
  authDomain: "e-commerse-ca830.firebaseapp.com",
  projectId: "e-commerse-ca830",
  storageBucket: "e-commerse-ca830.appspot.com",
  messagingSenderId: "882236401861",
  appId: "1:882236401861:web:74242d6b7a779ff17d28ac"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
