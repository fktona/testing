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
  apiKey: "AIzaSyAXBqGT9USQBS2mq-kO_H2rDIjgxNVaqzQ",
  authDomain: "cryzpto.firebaseapp.com",
  projectId: "cryzpto",
  storageBucket: "cryzpto.appspot.com",
  messagingSenderId: "588859320644",
  appId: "1:588859320644:web:e415ac4ad3446b17c30f11"
};


const app = initializeApp(firebaseConfig);

 admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),

  
});




app.use('/api/auth', auth);


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
