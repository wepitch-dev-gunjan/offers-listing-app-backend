import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCGUops3aJj5Oyw7IRu_TzhdfSvPsjudb0",
  authDomain: "rushotp-32f88.firebaseapp.com",
  projectId: "rushotp-32f88",
  storageBucket: "rushotp-32f88.appspot.com",
  messagingSenderId: "501386812805",
  appId: "1:501386812805:web:1153569b7704117c3ab8ec",
  measurementId: "G-14L93XCWMD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Firebase Cloud Messaging and get a reference to the service
const messaging = getMessaging(app);
