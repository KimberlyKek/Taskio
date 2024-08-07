import { StatusBar } from 'expo-status-bar';
import { Text, View, SafeAreaView, TouchableOpacity, Alert, ScrollView,FlatList,RefreshControl} from 'react-native';
import { Separator } from 'react-native-tableview-simple';
import React, {useEffect, useState, useMemo} from 'react';
import { getAuth} from 'firebase/auth';
import {app} from "../firebaseConfig.js"
import styles from '../css/TeamListCss.js'
import { getDocs, collection,getFirestore,query, where, push,doc, arrayUnion,updateDoc,} from 'firebase/firestore';



//Create task function
export default function TeamListScreen() {
    //retrieves the authentication state
    const auth = getAuth();
    //get the current user authentication state
    const user = auth.currentUser;

    const [Teamsinfo, setTeamInfo] = useState([]);
    //For getting the current user's username from User collection
    const [username, setUsername] = useState('');

    //For getting the Member role from Role collection
    const [role, setRole] = useState('');
    const [TeamDocId, setTeamDocId] = useState('');

    //Refresh data
    const [refreshing, setRefreshing] = useState(false);
   

    useEffect(() => {
        getUsername();
        getTeams();
        getRole();
    },[]);

    //get the user's username from the Users collection
    const getUsername = async () => {

      try{
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
          );
        });
     //save the username from UserUsername array to setUsername state
     setUsername(UserUsername[0])

    return() => getUsername(UserUsername)
    }
    catch (error)
    {
      console.log("Fail to get the current user's username: ", error);
    }

  };

  //get the Member role from Roles collection
  const getRole = async () => {
      try{
          const db = getFirestore(app);
          //Role collection from firebase db
          const RoleCollection = collection(db, 'Roles');
          
          //Get all the roles from the collection
          const RolesSnapShot = await getDocs(RoleCollection);
          const Roles = []
          //Save the roles to array
          RolesSnapShot.forEach((doc) => {
          const {Role} = doc.data()
          Roles.push({
              Role:Role
          })
          })
          //Get the Member role from the array and save to setRole state
          setRole(Roles[1].Role);

          return() => getRole(Roles);

      }
      catch (error) {
          console.log("Fail to get the role", error);

      }
    };

  //Get all the teams from Teams collection
  const getTeams = async () => {
      try{
          const db = getFirestore(app);
          //Teams collection from firebase db
          const TeamsCollection = collection(db, 'Teams');
        
          //Get all the teams details from the collection
          const TeamsSnapShot = await getDocs(TeamsCollection); 
          const Teams = []
          //save the team details to array
          TeamsSnapShot.forEach((doc) => {
          const {Name, CreatedBy, DocId,Members, MembersId} = doc.data()
          Teams.push({
              Name: Name,
              CreatedBy: CreatedBy,
              DocId: DocId,
              MembersId: MembersId,
              Members: Members
          })
          });

          //save the team details from Teams array to setTeamInfo state
          setTeamInfo(Teams);

          return() => getTeams(Teams)

      }
      catch (error) {
          console.log("Fail to get the teams information", error);

      }
    };

  //Allow user to join the team as new member
  const Jointeam = async () => {
    try{

      const db = getFirestore(app);
      //Teams collection from the firebase
      const TeamCollection = collection(db, 'Teams');
      //Get the team details based on the team's DocId
      const TeamQuery = query(TeamCollection, where('DocId', '==', TeamDocId ));
      const TeamSnapShot = await getDocs(TeamQuery);
      const ContainCurrUser = []
      //Save the team details to the array
      TeamSnapShot.forEach((doc)=>{
        const {Name, CreatedBy, DocId,Members, MembersId} = doc.data();
        ContainCurrUser.push({
          Name: Name,
          CreatedBy: CreatedBy,
          DocId: DocId,
          MembersId: MembersId,
          Members: Members
      })
      })

        //Get the MembersId nested array from the array
        const MembersList = ContainCurrUser.flatMap(function(el){return el.MembersId});
        //Check if the current user's id is in the array and save the result to MemberVerify constance. True/False
        const MemberVerify = MembersList.some(({UserId})=> UserId === user.uid);

      //if the current user has not joined the selected team, allow the user to join
      if (MemberVerify == false)
      {
          //Update the team details with the new member's details
          TeamSnapShot.forEach((doc)=>{
          updateDoc(doc.ref,{MembersId: arrayUnion({UserId: user.uid}), Members:arrayUnion({UserId: user.uid, Role: role, Username: username}) });
          console.log("New member has joined: ", TeamDocId);
          Alert.alert("Joined successfully.");
                
        });
        
      }
      //if the current user has already in the team, send an alert message
      else{
        
        Alert.alert('You are already in this team.');
        console.log('This user already joined this team.')
            
        };
      }
      catch (error)
      {
          console.log("Failed to add to the team: ", error);
      }
  };
  //--------------------------------------------------------------------------------------------

  //Create TaskItem constant to display the task data
  const TeamsItem = ({ Name, CreatedBy, DocId }) => {
      return (
        <View>
          <View style={styles.nameContainer}>
            <Text style={styles.nameTxt} >{Name}</Text>
            
            <TouchableOpacity style={styles.JoinBtn}>
                <Text style={styles.JoinTxt} onPress={()=>{setTeamDocId(DocId), ConfirmAlertJoin()}}>Join</Text>
            </TouchableOpacity>
          </View>
        
          <Text style={styles.OwnerTxt}>Owner: {CreatedBy}</Text>

        </View>
      )
  };

//render the task data
const renderTeamsItem = ({ item, index }) => (
  <TeamsItem Name={item.Name} CreatedBy={item.CreatedBy} DocId={item.DocId} key={index}/>
);

//Display message if no team available
const emptyTeamsInfo = (index) =>
  {
    if (Teamsinfo.length === 0 )
    return(
      <View style={styles.container}>
        <View>
          <Text key={index} style={styles.titleStyle}>No team right now</Text>
        </View>
      </View>
    )
  }

//allow user to refresh the task on the calendar
const onRefresh = React.useCallback(() => {
  setRefreshing(true);
  setTimeout(()=> {
    getUsername();
    getTeams();
    setRefreshing(false);
  },2000);
},[],);

  //Confirm alert message for join team
  const ConfirmAlertJoin =(docid) => {
  Alert.alert(
    'Confirmation',
    'Confirm to join this team? (Press on Join twice)',
    [
      {text: 'Yes', onPress:()=>Jointeam(docid)},
      {text: 'Cancel', styles: 'cancel'}
    ]
  );

}

  return(
      <SafeAreaView style={styles.SafeAreaView}>
      <View style={styles.container}>
        <View style={styles.textcon}>
            <Text style={styles.TextContainer}>Team List</Text>
      
        <View>
          {Teamsinfo && (
          <FlatList
            keyboardShouldPersistTaps="always"
            data={Teamsinfo} 
            renderItem={renderTeamsItem}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
            ItemSeparatorComponent={Separator}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={emptyTeamsInfo}
            />
          )}
          </View>
        </View>
          
        </View> 
        </SafeAreaView>
  )

}