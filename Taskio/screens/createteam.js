import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, SafeAreaView, TouchableOpacity, TextInput, Alert, ScrollView,Modal} from 'react-native';
import React, {useEffect, useState} from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { getAuth} from 'firebase/auth';
import {app} from "../firebaseConfig.js"
import styles from '../css/homecss.js'
import { addDoc,getDocs, collection,getFirestore,query, where, push,doc,arrayUnion} from 'firebase/firestore';



//Create task function
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
    setUsername(UserUsername[0])
    

    return() => getUsername(UserUsername)

  };

    const getRole = async () => {
        try{
            const db = getFirestore(app);
            const RoleCollection = collection(db, 'Roles');
            //const CategoryQuery = query(CategoryCollection, where('UserId', '==', user.uid));
            const RolesSnapShot = await getDocs(RoleCollection);
            const Roles = []
            RolesSnapShot.forEach((doc) => {
            const {Role} = doc.data()
            Roles.push({
                Role:Role
            })
            })
            setRole(Roles[0].Role);

            return() => getRole(Roles)

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
        //get today's date
        const today = new Date();
        //change today's date format to yyyy-mm-dd to match with the firebase timestamp
        const todayDate = today.getFullYear()+'-'+('0'+(today.getMonth()+1)).slice(-2)+'-'+('0'+(today.getDate())).slice(-2);

        //Display message if the title field is empty
        if (!teamname.trim())
            {
            Alert.alert("Team name must not be blank!")
            }
        //add the task details to the collection
        else {

            const TeamRef = await addDoc(TeamCollection, {DocId: docid, CreatedBy: username ,Name: teamname, MembersId: arrayUnion({UserId: user.uid}), Members:arrayUnion({UserId: user.uid, Role: role, Username: username})  })
            // const MemberSubCollection = collection(MemberCollection, 'MembersJoined')
            // const MemberRef = await addDoc(MemberSubCollection, {TeamId: docid, Member: user.uid, role: role});
            navigation.navigate('Team',{docid});
            Alert.alert("Team created.");
            console.log("Team added: ", TeamRef.id);
            //console.log("Member added to the team", MemberRef.id)
        }
        }
        catch (error)
        {
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