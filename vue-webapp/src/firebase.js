import { initializeApp } from "firebase";

const app = initializeApp({
  apiKey: "AIzaSyAoa44KA10-7GxuSoKNWDrnStcBBa0Ru7w",
  authDomain: "dialectbotreclutamiento-shginm.firebaseapp.com",
  databaseURL: "https://dialectbotreclutamiento-shginm.firebaseio.com",
  projectId: "dialectbotreclutamiento-shginm",
  storageBucket: "dialectbotreclutamiento-shginm.appspot.com",
  messagingSenderId: "691851747789",
  appId: "1:691851747789:web:39b2aef8c42d2fb4b4e484"
});

export const db = app.database();
export const usersRef = db.ref("usuarios_fb");

export const errorMessages = {
  "auth/wrong-password": "Contraseña incorrecta",
  "auth/invalid-email": "Formato de correo incorrecto",
  "auth/email-already-in-use": "Correo ya en uso",
  "auth/network-request-failed": "No estas conectado a la red"
};
