
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCQE4vWcRqo6rfyES8GZvoFPiKzzzgKX-g",
  authDomain: "mern-blog--auth.firebaseapp.com",
  projectId: "mern-blog--auth",
  storageBucket: "mern-blog--auth.appspot.com",
  messagingSenderId: "427929426695",
  appId: "1:427929426695:web:7a2f5f2de8797b4e3c03a2"
};


const app = initializeApp(firebaseConfig);


//provider

const provider = new GoogleAuthProvider();

const auth = getAuth()

export const authWithGoogle = async() => {
    let user = null;
    await signInWithPopup(auth, provider)
    .then(result => {
        user =  result.user
    })
    .catch(err =>{
        console.log(err)
    })

    return user;

}

