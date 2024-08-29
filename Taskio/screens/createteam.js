import { StatusBar } from 'expo-status-bar';
import { Text, View, SafeAreaView, TouchableOpacity, TextInput, Alert, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import { getAuth} from 'firebase/auth';
import {app} from "../firebaseConfig.js"
import styles from '../css/homecss.js'
import { addDoc,getDocs, collection,getFirestore,query, where,doc,arrayUnion} from 'firebase/firestore';



//Create team function
export default function CreateTeamScreen({navigation}) {

    //retrieves the authentication state
    const auth = getAuth();
    //get the current user authentication state
    const user = auth.currentUser;

    const [teamname, setTeamName] = useState('');
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');

    useEffect(() => {
        getUsername();
        getRole();
    },[]);


    //get the user's username from the Users collection
    const getUsername = async () => {
      try
      {
        const db = getFirestore(app);
        //Users collection from firebase
        const UserCollection = collection(db, 'Users');

        //get the username based on the current user's id
        const UsernameQuery = query(UserCollection, where('userId', '==', user.uid));
        const UsernameSnapShot = await getDocs(UsernameQuery);
        const UserUsername = []
        //save the username to UserUsername array
        UsernameSnapShot.forEach((doc) => {
          const {username} = doc.data()
          UserUsername.push(
            username
          )
        })
        //save the username from UserUsername array to setUsername state
        setUsername(UserUsername[0]);
      }
      catch(error)
      {
        console.log("Fail to get the user's username: ", error);
      }
   
      
    };

    //get the admin role from the roles collection
    const getRole = async () => {

      try{
          const db = getFirestore(app);
          //Roles collection from firebase
          const RoleCollection = collection(db, 'Roles');
          const RolesSnapShot = await getDocs(RoleCollection);
          const Roles = []
          //save the roles to Roles array
          RolesSnapShot.forEach((doc) => {
          const {Role} = doc.data()
          Roles.push({
              Role:Role
          })
          })
          //array[0] is the admin
          setRole(Roles[0].Role);

      }
      catch (error) {
          console.log("Fail to get the role", error);

      }
    }

    //allow user to create task to the firebase collection
    const addTeam = async () => {
        try{
        const db = getFirestore(app);
        //Tasks collection from the firebase
        const TeamCollection = collection(db, 'Teams');

        //Create reference id as DocId
        const Ref = doc(TeamCollection)
        const docid = Ref.id

        //Display message if the name field is empty
        if (!teamname.trim())
            {
            Alert.alert("Error","Team name must not be blank!");
            }
        //add the team details to the collection
        else {

          const TeamRef = await addDoc(TeamCollection, {DocId: docid, CreatedBy: username ,Name: teamname, MembersId: arrayUnion({UserId: user.uid}), Members:arrayUnion({UserId: user.uid, Role: role, Username: username})  });
          navigation.navigate('Team',{docid});
          Alert.alert("You have created a team successfully.");
          console.log("Team added: ", TeamRef.id);
          
        }
        }
        catch (error)
        {
          Alert.alert("Error","You fail to create a team.");
          console.log("Failed to add team: ", error);
        }
    };


    return (
        <SafeAreaView style={styles.SafeAreaView}>
          <View style={styles.container}>
            <View style={styles.textcon}>
              <View style={styles.textsubcon}>
                <Text style={styles.TextContainer}>Create New Team</Text>
              </View>
              <ScrollView contentContainerStyle={{paddingBottom: 200}} >
                <TextInput style={styles.textinput} placeholder='Team name' value ={teamname} onChangeText={(value)=> setTeamName(value)}/>
                <TextInput style={styles.Notestextinput} multiline={true} numberOfLines={5} placeholder='Invite members (not working)' value ={''} onChangeText={(value)=> setNotes(value)} />

                <View style={styles.Taskbuttoncontainer}>
                  <TouchableOpacity  style={styles.Taskbutton}>
                  <Text style={styles.TaskbuttonText} onPress={addTeam}>Create</Text>
                </TouchableOpacity>
                </View> 
                </ScrollView>
            </View>
          </View>
        </SafeAreaView>
    );

}