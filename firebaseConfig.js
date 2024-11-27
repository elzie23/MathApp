import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyC1Cn9ssh6Jh2iYJHdrcVmjC1ovmc8bzw8",
    authDomain: "mathapp-fc9f9.firebaseapp.com",
    projectId: "mathapp-fc9f9",
    storageBucket: "mathapp-fc9f9.appspot.com",
    messagingSenderId: "512359028040",
    appId: "1:512359028040:web:a83fe19dc84762b60c4f7d",
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);//vrijednost se mijenja ali ostaje referenca na objekt

  export { auth, firestore };