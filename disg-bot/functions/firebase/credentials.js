//=== Firebase Database Link ===================================================
const firebase = require("firebase-admin");
const serviceAccount = require("./../firebase-disg-service-key.json");
firebase.initializeApp({
    apiKey: "AIzaSyAoa44KA10-7GxuSoKNWDrnStcBBa0Ru7w",
    authDomain: "dialectbotreclutamiento-shginm.firebaseapp.com",
    databaseURL: "https://dialectbotreclutamiento-shginm.firebaseio.com",
    projectId: "dialectbotreclutamiento-shginm",
    storageBucket: "dialectbotreclutamiento-shginm.appspot.com",
    messagingSenderId: "691851747789",
    appId: "1:691851747789:web:39b2aef8c42d2fb4b4e484"  ,
   credential: firebase.credential.cert(serviceAccount),
});
module.exports = firebase
