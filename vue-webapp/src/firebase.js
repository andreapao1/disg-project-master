import { initializeApp } from "firebase";

const app = initializeApp({
  apiKey: "AIzaSyBf6fM-NPpdpQ6M1_WXsYDKu5xshnOryjA",
    authDomain: "dialectbotreclutamiento.firebaseapp.com",
    databaseURL: "https://dialectbotreclutamiento.firebaseio.com",
    projectId: "dialectbotreclutamiento",
    storageBucket: "dialectbotreclutamiento.appspot.com",
    messagingSenderId: "436017582027",
    appId: "1:436017582027:web:5c1db8448a23694f51304e",
    measurementId: "G-3RDYHM8WWV"
});

export const db = app.database();
export const usersRef = db.ref("usuarios_fb");

export const errorMessages = {
  "auth/wrong-password": "Contraseña incorrecta",
  "auth/invalid-email": "Formato de correo incorrecto",
  "auth/email-already-in-use": "Correo ya en uso",
  "auth/network-request-failed": "No estas conectado a la red"
};