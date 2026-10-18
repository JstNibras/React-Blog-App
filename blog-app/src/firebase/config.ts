import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAD3w4bQBO0lFStqBjka_VwF1B26Ged-Fs",
    authDomain: "blog-app-300.firebaseapp.com",
    projectId: "blog-app-300",
    appId: "1:835421863437:web:b49c3d494fe640b0ab9f44"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app);


// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyAD3w4bQBO0lFStqBjka_VwF1B26Ged-Fs",
//   authDomain: "blog-app-300.firebaseapp.com",
//   projectId: "blog-app-300",
//   storageBucket: "blog-app-300.firebasestorage.app",
//   messagingSenderId: "835421863437",
//   appId: "1:835421863437:web:b49c3d494fe640b0ab9f44",
//   measurementId: "G-NYN5P0TP8S"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);