//=== Firebase Database Link ===================================================
const firebase = require("firebase-admin");
const serviceAccount = require("./../firebase-disg-service-key.json");
firebase.initializeApp({
    apiKey: "AIzaSyDSYtJxzHLYuT1Z3aiHYnh2OaLO4HHG1sE",
    authDomain: "bot-disg.firebaseapp.com",
    databaseURL: "https://bot-disg.firebaseio.com",
    projectId: "bot-disg",
    storageBucket: "bot-disg.appspot.com",
    messagingSenderId: "1078689859564",
    credential: firebase.credential.cert(serviceAccount),
});
module.exports = firebase
