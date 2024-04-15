//Firebase Configuration Information
const firebaseConfig = {
    apiKey: "AIzaSyDwMJ7P-M6V0G9WuNAF-wi2kqC_hYfQU7A",
    authDomain: "your-daily-manager.firebaseapp.com",
    databaseURL: "https://your-daily-manager-default-rtdb.firebaseio.com",
    projectId: "your-daily-manager",
    storageBucket: "your-daily-manager.appspot.com",
    messagingSenderId: "1005772940945",
    appId: "1:1005772940945:web:5eae59eeb55036865b0130",
    measurementId: "G-DVZGNW7B05"
}

//Firebase Initilization
firebase.initializeApp(firebaseConfig);

//Firebase Variables for Firebase Funcitons
const auth = firebase.auth()
const database = firebase.database()