import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, SafeAreaView, TouchableOpacity, TextInput,Alert} from 'react-native';
import React, {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import {app} from "../firebaseConfig.js"
import styles from '../css/SignUpCss.js'

// LoginScreen function
export default function LoginScreen({ navigation}) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  //retrieves the authentication state
  const auth = getAuth(app);

  //allow user to login with email and navigate to home page
  const handleEmailLogin = async () => {
    try {

      //set the user's login credentials to userCredential once login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in:', userCredential.user.email);

      //save the user's login credentials to async storage
      await AsyncStorage.setItem('userEmail', email);
      navigation.navigate('Home', {email});
    
      } catch (error) {
        //Display error message
        Alert.alert('Error', 'Invalid email or password');
        console.log('Error signing in:', error);
      }
  };
  

  return (
    <SafeAreaView style={styles.SafeAreaView}>
      <View style={styles.container}>
      
        <View style={styles.textcon}>
            <Text style={styles.TextContainer} testID='loginText'> Login</Text>
            <TextInput style={styles.textinput} placeholder='Email' value ={email} onChangeText={(value)=> setEmail(value)}/>
            <TextInput style={styles.textinput} placeholder='Password' value={password} onChangeText={(value)=> setPassword(value)} secureTextEntry={true}/>

            <View style={styles.buttoncontainer}>
              <TouchableOpacity  style={styles.loginbutton} >
                <Text style={styles.buttonText} onPress={handleEmailLogin} testID='LoginBtn'>Login</Text>
              </TouchableOpacity>
              <Text style={styles.forgotpassText}>Forgot password? Press <Text style={styles.hereText} onPress={()=> navigation.navigate('ResetPwd')}>here</Text></Text>
            </View>
        </View>
      </View>
   
    </SafeAreaView>
  );
};

