import { StatusBar } from 'expo-status-bar';
import { Text, View, SafeAreaView, TouchableOpacity, TextInput, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword} from 'firebase/auth';
import {app} from "../firebaseConfig.js"
import styles from '../css/SignUpCss.js'


// SignUpScreen function
export default function SignUpScreen({navigation}) {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');

  //retrieves the authentication state
  const auth = getAuth(app);

  
  useEffect(() => {
    subscribe();
  }, [auth]);


  const subscribe = async() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => subscribe();
  }

  //allow user to sign up with email
  const handleEmailSignup = async () => {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      //display alert message if the confirm password is not the same as password
      if (password.trim() != confirmpassword.trim())
      {
        Alert.alert('Error','Password and confirm password do not match!');
      }
      //display alert message if email field is empty
      if (!email.trim())
      {
        Alert.alert('Error','You must input an email!');
      }
      //display alert message if email format is wrong
      if (!emailRegex.test(email.trim())) {

        Alert.alert('Error', 'You must input a valid email format!');
      }
      //display alert message if username field is empty
      if (!username.trim())
      {
        Alert.alert('Error','You must input an username!');
      }
      //display alert message if the username contains more than 20 characters
      else if (username.trim().length >= 20)
      {
        Alert.alert('Error','Username must be less than 20 characters');
      }
      //display alert message if password field is empty
      if (!password.trim())
      {
        Alert.alert('Error','You must input a password!');
      }
      //display alert message if the password contains less than 6 characters
      else if (password.trim().length <= 6)
      {
        Alert.alert('Error','Password must be more than 6 characters!');
      }
      //display message if the confirm password field is empty
      if (!confirmpassword.trim())
      {
        Alert.alert('Error','Confirm password is empty!');
      }
      //if the user has reached these following requirements, connect to firebase database and check if the email has already existed or not.
      if (username.trim().length <= 20 && password.trim().length > 6 && password.trim() == confirmpassword.trim())
      {
        //create user account with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        //connect to Users collection in firebase
        const db = getFirestore(app);
        const usersCollection = collection(db, 'Users');

        //get the email value from the collection
        const emailQuery = query(usersCollection, where('email', '==', email));
        const emailSnapshot = await getDocs(emailQuery);

        //if new email, allow user to sign up and save the user's details to User collection and async storage. Once saved successfully, navigate to Login screen.
        if (emailSnapshot.empty) {
        
          //save the user's data to User collection
          await addDoc(usersCollection, { userId: userCredential.user.uid, username: username, email: email, password: password});
          console.log('User signed up:', userCredential.user.email);

          //save the user's data to async storage
          await AsyncStorage.multiSet([['userEmail', email], ['userPassword', password], ['username', username]]);
          Alert.alert("You have registered successfully! You can login now");
          navigation.navigate('Login');
        }
        else
        {
          Alert.alert('Error','Email already been used, please use another email');
          console.log('Email address already existed.');
        }
      }
      //Display error message if system error
      } catch (error) {
        Alert.alert('Error','You fail to sign up...');
        console.log('Error signing up:', error);
      }
  };



  return (
    <SafeAreaView style={styles.SafeAreaView}>
    <View style={styles.container}>
      <View style={styles.textcon}>
      
        <Text style={styles.TextContainer} testID='SignUpText'> Sign up</Text>
        <TextInput style={styles.textinput} placeholder='Username' value = {username} onChangeText={(value)=> setUsername(value)}/>
        <TextInput style={styles.textinput} placeholder='Email' value ={email} onChangeText={(value)=> setEmail(value)}/>
        <TextInput style={styles.textinput} placeholder='Password' value={password} onChangeText={(value)=> setPassword(value)} secureTextEntry={true}/>
        <TextInput style={styles.textinput} placeholder='Confirm Password' value={confirmpassword} onChangeText={(value)=> setConfirmPassword(value)} secureTextEntry={true}/>
        <View style={styles.buttoncontainer}>
          <TouchableOpacity  style={styles.button}>
            <Text style={styles.buttonText} testID='SignUpBtn' onPress={handleEmailSignup}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    </SafeAreaView>
    );
  }

