import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {Facebook} from 'expo';
import firebase from 'firebase';
// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCBGW3jj9J1wkllqs2cAB-zc6mgFhUNcNk",
  authDomain: "fir-47si.firebaseapp.com",
  databaseURL: "https://fir-47si.firebaseio.com",
  projectId: "fir-47si",
  storageBucket: "fir-47si.appspot.com",
  messagingSenderId: "284518651853"
};

firebase.initializeApp(firebaseConfig);

export default class App extends React.Component {


  componentDidMount() {
    firebase.auth().signOut();
    this.checkIfUserLoggedIn();
  }

  checkIfUserLoggedIn() {
    var _this = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.warn('user already logged in');
      } else {
        console.warn('Prompt log in');
        _this.registerWithEmail(); //Change this line to log in with email or use Facebook Login
      }
    });
  }



  async logInWithFacebook() {
    //This line obtains a token. A good guide on how to set up Facebook login
    // could be found on Expo website https://docs.expo.io/versions/latest/sdk/facebook.html
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync('966682673486493', {permissions: ['public_profile', 'email'],});
    if (type === 'success') {
      // Get the user's name using Facebook's Graph API
      const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
      const name = (await response.json()).name;
      console.warn(name);

      //Signs up the user in Firebase authentication. Before being able to use
      //this make sure that you have Facebook enabled in the sign-in methods
      // in Firebase
      const credential = firebase.auth.FacebookAuthProvider.credential(token);
      var result = await firebase.auth().signInWithCredential(credential);

      //After signing in/up, we add some additional user info to the database
      //so that we can use it for other things, e.g. users needing to know
      //names of each other
      firebase.database().ref('users').child(result.uid).child('name').set(name);
    }
  }


  async logInWithEmail() {
    try {
     //This line logs in using email and password as its 2 parameters
     var result = await firebase.auth().signInWithEmailAndPassword('aabuhash@stanford.edu', '123123');

     //You can use this if you have email verification sent when signing up
     // if(result.emailVerified) {
     //
     // } else {
     //
     // }

   } catch (error) {
     //Firebase gives you the chance to check the reason of log in
     //failure
     var errorCode = error.code;
     var errorMessage = error.message;
     view.signedIn = false;
     view.error = true;
     if (errorCode === 'auth/wrong-password') {

     } else if (errorCode === 'auth/user-not-found') {

     } else {

     }
   }
  }


  async registerWithEmail() {
    try {
      //Creates a user with the given email and password
      var user = await firebase.auth().createUserWithEmailAndPassword('aabuhash@stanford.edu', '123123');

      // send verification email
      // user.sendEmailVerification().then(function() {
      //   // Email sent
      // }).catch(function(error) {
      //   // error
      //   console.log('error when verifying email' + error);
      // });

      //Updates the user display name which is a property of the profile
      await user.updateProfile({displayName: 'Abood'});
      console.log(user);

      //After signing up, we add some additional user info to the database
      //so that we can use it for other things, e.g. users needing to know
      //names of each other
      firebase.database().ref('users').child(user.uid).child('name').set('Abood');
    } catch(error) {
       // var errorMessage = error.message;
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
