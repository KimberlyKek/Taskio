import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, SafeAreaView, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from '../css/WelcomeCss.js';
import * as Facebook from 'expo-facebook';
import { getAuth, signInWithCredential, GoogleAuthProvider, FacebookAuthProvider} from 'firebase/auth';
import {app} from "../firebaseConfig.js";

// WelcomeScreen function
export default function WelcomeScreen({ navigation}) {

  const auth = getAuth(app);
  const [user, setUser] = useState(null);
  const facebookAppId = '779774240901250';

  useEffect(() => {
    subscribe();
  }, [auth]);

  //subscribe to the users current authentication state, then set user to setUser state
  const subscribe = async() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => subscribe();
  }

  //handle google sign in
  const GoogleSignIn = async() => {

    try{
      const provider = new GoogleAuthProvider(app);
      provider.setCustomParameters({   
        prompt : "select_account "
      });
      const signInWithGooglePopup = () => signInWithCredential(auth, provider);
      const response = await signInWithGooglePopup();
      console.log(response)
    }
    catch(error)
    {
      console.log('Fail to sign in with Google: ', error);
    }
  };

  //handle facebook sign in
  const FacebookSignInHandler = async () => {
    try {
      await Facebook.initializeAsync({ appId: facebookAppId });
      
      const { type, token } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile', 'email'],
      });
  
      if (type === 'success') {
        // Create a Facebook credential with the token
        const credential = FacebookAuthProvider.credential(token);
        
        // Sign in with the credential from the Facebook user
        const auth = getAuth();
        const userCredential = await signInWithCredential(auth, credential);
        console.log('User signed in with Facebook: ', userCredential);
      } else {
        console.log('Facebook sign-in canceled');
      }
    } catch (error) {
      console.log('Failed to sign in with Facebook: ', error);
    }
  };

    return (
      <SafeAreaView style={styles.SafeAreaView}>
        <View style={styles.container}>
          <View style={styles.textcon}>
            <View style={styles.textsecondcon}>
              <View style={styles.textsubcon}>
                <View>
                  <Image style={styles.image} source={require("../assets/images/logo.png")}></Image>
                </View>
                <View>
                  <Text style={styles.TextContainer}> Taskio</Text>
                </View>
              </View>
            </View>

            <Image style={styles.welcomeimg} source={require("../assets/images/welcome.png")}></Image>
            <Text style={styles.TextSubcontainer}>Organize your work and life</Text>

            <View style={styles.buttoncontainer}>
              <TouchableOpacity  style={styles.button}>
                <Text style={styles.buttonText} onPress={() => navigation.navigate("Signup")}>Sign up</Text>
              </TouchableOpacity>
              <TouchableOpacity  style={styles.button}>
                <Text style={styles.buttonText} onPress={() => navigation.navigate("Login")}>Login</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.textsubcon}> 
              <View>
                <TouchableOpacity onPress={GoogleSignIn}>
                    <Image style={styles.socialmediaimage} source={require("../assets/images/google.png")}></Image>
                </TouchableOpacity>
              </View>
                <View>
                <TouchableOpacity onPress={FacebookSignInHandler}>
                    <Image style={styles.socialmediaimage} source={require("../assets/images/facebook.png")}></Image>
                </TouchableOpacity>
               
                </View>
               
            </View>
            
          </View>
        </View>
      </SafeAreaView>
    );
  };

