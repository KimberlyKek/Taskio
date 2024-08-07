import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, SafeAreaView, TouchableOpacity, TextInput,Alert} from 'react-native';
import React, {useState} from 'react';
import { getAuth, sendPasswordResetEmail} from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import {app} from "../firebaseConfig.js"
import styles from '../css/SignUpCss.js'

// ResetPassword function
export default function ResetPasswordScreen() {

  const [email, setEmail] = useState('');

  //retrieves the authentication state
  const auth = getAuth(app);

  //allow user to reset password through email
  const forgotpassword = async () => {
    try {

        //connect to Users collection in firebase
        const db = getFirestore(app);
        const usersCollection = collection(db, 'Users');

        //check whether the email has already registered or not. Only user with registered email is allowed to 
        //reset the password, the reset link will be sent through the registered email.
        //get the email value from the collection
        const emailQuery = query(usersCollection, where('email', '==', email));
        const emailSnapshot = await getDocs(emailQuery);

        //if email is not registered, display error message
        if (emailSnapshot.empty) {
            Alert.alert("The email has not registered")
        }
        //send the reset password link to the registered email
        else {
            await sendPasswordResetEmail(auth, email)
            Alert.alert("Reset email has sent to " + email +".")
        }
    
      } catch (error) {
        //Display error message
        console.log('Error sending reset email:', error);
      }
  };
  

  return (
    <SafeAreaView style={styles.SafeAreaView}>
      <View style={styles.container}>
      
        <View style={styles.textcon}>
            <Text style={styles.TextContainer}> Reset Password</Text>
            <Text style={styles.resetpwdtxt}>A reset password link will be sent to your email,{"\n"}use the link to reset your password.</Text>
            <TextInput style={styles.textinput} placeholder='Email' value ={email} onChangeText={(value)=> setEmail(value)}/>
        
            <View style={styles.buttoncontainer}>
              <TouchableOpacity  style={styles.loginbutton}>
                <Text style={styles.buttonText} onPress={forgotpassword}>Send</Text>
              </TouchableOpacity>
            </View>
        </View>
      </View>
   
    </SafeAreaView>
  );
};

