import firebase from 'firebase'


const firebaseConfig = {
    apiKey: "AIzaSyBc4VQ39MI9LqE87igyDeY0PDhR2qh8u3U",
    authDomain: "reactinsta-20182.firebaseapp.com",
    databaseURL: "https://reactinsta-20182.firebaseio.com",
    projectId: "reactinsta-20182",
    storageBucket: "reactinsta-20182.appspot.com",
    messagingSenderId: "394291356203",
    appId: "1:394291356203:web:a0f44fdb3be303a87a806e",
    measurementId: "G-2ZJDB9WZ59"
  };
  firebase.initializeApp(firebaseConfig);

  export const f =firebase;
  export const database= firebase.database();
  export const auth = firebase.auth();
  export const storage = firebase.storage();