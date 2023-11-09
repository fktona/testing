const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const serviceAccount = require('./secret.json');
const auth = require('./route/auth');
const { initializeApp} = require("firebase/app");
//require('dotenv').config()





const app = express();
app.use(express.json());
app.use(cors());

const firebaseConfig = {
    apiKey: "AIzaSyDgmSblmAd2F6cKZWfQ_ZKjXM_AnK6vr7g",
    authDomain: "zur-backend.firebaseapp.com",
    databaseURL: "https://zur-backend-default-rtdb.firebaseio.com",
    projectId: "zur-backend",
    storageBucket: "zur-backend.appspot.com",
    messagingSenderId: "243050586741",
    appId: "1:243050586741:web:63bd2f41a8744199a5ce3c"
  };
   initializeApp(firebaseConfig);

 admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),

  
});




app.use('/api/auth', auth);


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});