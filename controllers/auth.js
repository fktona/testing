const admin = require('firebase-admin');
const { signInWithEmailAndPassword ,sendPasswordResetEmail ,sendEmailVerification , signInWithCustomToken } = require("firebase/auth"); 
const { getAuth, signOut } = require("firebase/auth");
const firebase = require('firebase/app');



  const register = async (req, res) => {
  const { fullname, username, password, email  } = req.body;
  const db = admin.firestore();

  try {
    
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    
    if (!email.match(emailRegex)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const checkUsername = await db.collection('users').where('username', '==', username).get();
    checkUsername.forEach((doc) => {    
      if (doc.exists) {
        return res.status(400).json({ message: 'Username already exists' });
      }
    
    });
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: username,
      emailVerified: false,
      fullname: fullname,

    });
   // sendEmailVerification(getAuth().currentUser, userRecord.email);

    console.log('Successfully created new user:', userRecord);

    
     //.then(() => {
    //   res.status(200).json({ message: 'Email verification sent successfully' });
    // }).catch((error) => {
    //   res.status(500).json({ message: 'Error sending email verification', error: error.message });
    // } );

    
    
    const userData = {
      id: userRecord.uid,
      fullname,
      username,
      email,
     
    };

   
   
       const customToken = await admin.auth().createCustomToken(userRecord.uid);
       console.log(customToken)
       signInWithCustomToken(getAuth(),customToken).then((userCredential) => {
        sendEmailVerification(getAuth().currentUser, userCredential.email);
       })
       
       const userDetailsRef = db.collection('users');
       
       const userId = userData.id; 
       await userDetailsRef.doc(userId).set(userData);
   
    
    
    res.status(201).json({ message: 'User created successfully' , data: userRecord,
      token: customToken
    });
    console.log(userRecord);
  } catch (error) {
    console.error('Error creating new user:', error);

    if (error.code === 'auth/email-already-exists') {
      res.status(400).json({ message: 'Email already exists', error: error.message });
    } else {
      res.status(400).json({ message: 'Could not create user', error: error.message });
    }
  }
};







const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    
    if (!email.match(emailRegex)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    
    
    const userRecord = await admin.auth().getUserByEmail(email);

    if (!userRecord.emailVerified) {
      return res.status(400).json({ message: 'Email not verified' });
    }
           
    await signInWithEmailAndPassword(getAuth(), email, password)

    const customToken = await admin.auth().createCustomToken(userRecord.uid);
       console.log(customToken)
    
    res.status(200).json({ message: 'Login successful', data: userRecord , token: customToken });
    
  } catch (error) {
    console.error('Error during login:', error);

    if (error.code === 'auth/user-not-found') {
      res.status(401).json({ message: 'User Not Found ' });
    } else if (error.code === 'auth/wrong-password') {
      res.status(401).json({ message: 'Wrong password' });
    } else {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
};
const verifyToken = async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
    
  }

  signInWithCustomToken(getAuth(),token).then((userCredential) => {
  
    userCredential.user.getIdToken().then((idToken) => {
      console.log(idToken)  
      
    });
    res.status(200).json({ message: 'Token is valid', data: userCredential });
  }).catch((error) => {
    res.status(401).json({ message: 'Token is invalid', error: error.message });
  })
}


  const reset_password = async (req, res) => {
  const { email } = req.body;

  try {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

    if (!email.match(emailRegex)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }
       const resetLink = await sendPasswordResetEmail(getAuth() , email);

   

    res.status(200).json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error('Error sending password reset email:', error);

    if (error.code === 'auth/user-not-found') {
      res.status(404).json({ message: 'User Not Found' });
    } else {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
};


module.exports = {
  register,
  login,
  reset_password,
  verifyToken
};
