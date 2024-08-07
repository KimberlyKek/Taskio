// Import the functions you need from the SDKs you need
import { initializeApp} from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCcoHkhBWiksS4dyhvt-nnOuaL8JvX8nLc",
  authDomain: "taskio-ec16d.firebaseapp.com",
  projectId: "taskio-ec16d",
  storageBucket: "taskio-ec16d.appspot.com",
  messagingSenderId: "887423498561",
  appId: "1:887423498561:web:208db6a58d312b7f4809c0",
  measurementId: "G-NYT47B7FG1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export default app;