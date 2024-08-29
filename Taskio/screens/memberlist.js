import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, SafeAreaView,TouchableOpacity, Alert,ScrollView,RefreshControl} from 'react-native';
import React, {useEffect, useState} from 'react';
import { getAuth} from 'firebase/auth';
import {app} from "../firebaseConfig.js"
import styles from '../css/MemberListCss.js'
import { getDocs, collection,getFirestore,query, where,updateDoc, arrayRemove } from 'firebase/firestore';
import {useRoute } from '@react-navigation/native';



//Member list function
export default function MemberListScrren() {

    //retrieves the authentication state
    const auth = getAuth();
    //get the current user authentication state
    const user = auth.currentUser;

    //get the TeamDocId from team.js
    const route = useRoute();
    const TeamDocId = route.params?.TeamDocId;

    //For getMembers const
    const [MembersInfo, setMembersInfo] = useState([])
    const [AdminMember, setAdminMember] = useState();
    const [AdminInfo, setAdminInfo] = useState();

    //For RemoveMember const
    const [DeleteDocId, setDeleteDocId] = useState('');
    const [DeleteRole, setDeleteRole] = useState('');
    const [DeleteUsername, setDeleteUsername] = useState('');

    //For refresh data
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        getMembers();
      
    },[]);
    
    //Get all the members from the Team collection
    const getMembers = async() => {
        try{
            const db = getFirestore(app);
            //Teams collection from firebase db
            const TeamCollection = collection(db, 'Teams');
            //Get the team details based on the team's DocId
            const TeamQuery = query(TeamCollection, where('DocId', '==', TeamDocId));
            const TeamSnapShot = await getDocs(TeamQuery);
            const Team = []
            //Save the team details to the array
            TeamSnapShot.forEach((doc) => {
                const {CreatedBy, Name,DocId, MembersId,Members} = doc.data()
                Team.push({
                    CreatedBy: CreatedBy,
                    Name:Name,
                    DocId: DocId,
                    MembersId: MembersId,
                    MembersRoles: Members
                })
                });

            //Get the MembersRoles nested array from the array
            const MembersList = Team.flatMap(function(el){return el.MembersRoles});
            
            //Check if the current user is an admin. Return true if admin, return false if not
            const CheckAdminRole = MembersList.some((item)=> item.UserId === user.uid && item.Role === 'Admin');

            //Get the admin's id from the MembersList array. Usually admin will be in element [0] as he/she is the first member when create team
            const AdminUserId = MembersList[0].UserId;

            //save the above constance values to the states respectively
            setMembersInfo(MembersList);
            setAdminMember(CheckAdminRole);
            setAdminInfo(AdminUserId)
        }
        catch (error)
        {
            console.log('Fail to get the members details from the team:', error)
        }
    };

    //allow admin to remove member from the team
    const RemoveMember = async() => {
        try{
            const db = getFirestore(app);
            //Teams collection from firebase db
            const TeamCollection = collection(db, 'Teams');
            //Get the team details based on the team's DocId
            const TeamQuery = query(TeamCollection, where('DocId', '==', TeamDocId));
            const TeamSnapShot = await getDocs(TeamQuery);

            //Update the team details by removing the member's details
            TeamSnapShot.forEach((doc)=>
            {
                updateDoc(doc.ref, {MembersId: arrayRemove({UserId: DeleteDocId}),Members:arrayRemove({UserId: DeleteDocId, Role: DeleteRole, Username: DeleteUsername})});
                Alert.alert('You have removed a member successfully.');
                console.log('Member has being removed from this team:', DeleteDocId);
            })

        }
        catch(error)
        {
            Alert.alert("Error","You fail to remove a member.");
            console.log('Fail to remove member:', error);
        }

    };

    //Confirm message for remove member
    ConfirmAlert=() => {
        Alert.alert(
          'Confirmation',
          'Are you sure you want to remove this member? (Press remove twice)',
          [
            {text: 'Yes', onPress:()=>RemoveMember()},
            {text: 'Cancel', styles: 'cancel'}
          ]
        );
    
      };

    //allow user to refresh data when new update
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(()=> {
          getMembers();
          setRefreshing(false);
        },2000);
      },[],);

    
    return (
        <SafeAreaView style={styles.SafeAreaView}>
            <View style={styles.container}>
                <View style={styles.MemberListCon}>
                    <View>
                        <Text style={styles.TextContainer}>Member List</Text>
                    </View>
                </View>

                <View>
                <ScrollView  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
                    {MembersInfo.map((Member)=>{
                        return(
                            <View style={styles.row} >
                            <Image source={require("../assets/images/profileicon.png")} style={styles.pic} />
                            <View>
                                <View style={styles.nameContainer}>
                                <Text style={styles.nameTxt}>
                                    {Member.Username}
                                </Text>
                                {
                                    //if the current user is an admin
                                    AdminMember ? (
                                        //remove the 'Remove' button on the admin role
                                        AdminInfo === Member.UserId ? (
                                            null
                                        ):
                                        //else display the Remove button on the member roles
                                        <TouchableOpacity>
                                        <Text style={styles.removeBtn} onPress={()=>{setDeleteDocId(Member.UserId), setDeleteRole(Member.Role), setDeleteUsername(Member.Username), ConfirmAlert()}}>Remove</Text>
                                        </TouchableOpacity>
                                    ): null
                                }
                    
                                </View>
                                <View style={styles.RoleContainer}>
                                <Text style={styles.RoleTxt}>{Member.Role}</Text>
                                </View>
                            </View>

                            </View>
                    )
                }
                )}
                </ScrollView>
                </View>
            </View>
           
        </SafeAreaView>
    )


}