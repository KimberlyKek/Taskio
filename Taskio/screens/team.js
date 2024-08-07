import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, SafeAreaView,TouchableOpacity, TextInput, Alert,Modal,ScrollView,FlatList,RefreshControl} from 'react-native';
import { Separator } from 'react-native-tableview-simple';
import {Menu, MenuProvider, MenuOptions, MenuOption,MenuTrigger} from 'react-native-popup-menu';
import React, {useEffect, useState,useMemo} from 'react';
import { getAuth} from 'firebase/auth';
import {app} from "../firebaseConfig.js"
import styles from '../css/teamcss.js';
import { getDocs, collection,getFirestore,query, where, push,updateDoc, doc,get, deleteDoc,addDoc, deleteField, arrayRemove } from 'firebase/firestore';
import {useRoute } from '@react-navigation/native';
import filter from 'lodash.filter';


//Create task function
export default function TeamScreen({navigation}) {

  //retrieves the authentication state
  const auth = getAuth();
  //get the current user authentication state
  const user = auth.currentUser;

  //get the DocId from DrawerNav function in home.js
  const route = useRoute();
  const TeamDocId = route.params?.docid;

  const [teamName, setTeamName] = useState('');

  const [folder, setFolder] = useState([]);
  const [folderInfo, setFolderInfo] = useState([]);
  const [projectInfo, setProjectInfo] = useState([]);
  //For displaying the project list based on folder
  const [folderFilter, setFolderFilter] = useState('None');
  const [noOfmembers, setNoOfMembers] = useState(0);
  const [AdminMember, setAdminMember] = useState();

  const [MemberRole, setMemberRole] = useState('');
  const [MemberUsername, setMemberUsername] = useState('');

  const [editName, setEditName] = useState('');


  //For setting visibliablity on the modal
  const [modalVisible, setModalVisible] = useState(false);
  //For setting visibliablity on the modal
  const [FoldermodalVisible, setFolderModalVisible] = useState(false);
  //Refresh data
  const [refreshing, setRefreshing] = useState(false);
  //DocId for delete project
  const [DeleteDocId, setDeleteDocId] = useState('');

  const [searchedData, setSearchedData] = useState([]);
  const [searchquery, setSearchQuery] = useState('');

  //For active folders buttons on the folder list
  const [FolderBtnActive, setFolderBtnActive] = useState(null);
  

  useEffect(() => {
    getTeam();
    getFolder();
    getProjects();
},[]);

//Get the team details from the Teams collection based on the team's DocId
const getTeam = async () => {
    try{
        const db = getFirestore(app);
        //Teams collection
        const TeamCollection = collection(db, 'Teams');
        //Get the team details based on the team's DocId
        const TeamQuery = query(TeamCollection, where('DocId', '==', TeamDocId));
        const TeamSnapShot = await getDocs(TeamQuery);
        const Team = [];
        //Save the team details to array
        TeamSnapShot.forEach((doc) => {
        const {CreatedBy, Name,DocId, MembersId,Members} = doc.data();
        Team.push({
            CreatedBy: CreatedBy,
            Name:Name,
            DocId: DocId,
            MembersId: MembersId,
            MembersRoles: Members
        });
        });
        
        //Get the MemberId nested array from the Team array and save to MembersIDList
        const MembersIDList = Team.map(function(el){return el.MembersId});
        //Count the number of members from the MemberIdList array
        const TotalMembers = MembersIDList.reduce((count, current)=> count + current.length,0);

        //Get the MembersRoles nested arrat from the Team array and save to MembersList 
        const MembersList = Team.flatMap(function(el){return el.MembersRoles});
        //Check if the current user is an admin. Return false if not, return true if the user is the admin
        const CheckAdminRole = MembersList.some((item)=> item.UserId === user.uid && item.Role === 'Admin');

        //Filter the current user's details such as role and username, from the MemberList array
        const MemberDetails = MembersList.filter(item => item.UserId === user.uid);
        //Get the current user's role
        const MemberRole = MemberDetails[0].Role;
        //Get the current user's username
        const MemberUsername = MemberDetails[0].Username;

        //save the above contances values to the states respectively
        setTeamName(Team[0].Name)
        setNoOfMembers(TotalMembers);
        setAdminMember(CheckAdminRole);

        setMemberRole(MemberRole);
        setMemberUsername(MemberUsername);
        
        return() => getTeam(Team)

    }
    catch (error) {
        console.log("Fail to get the team information", error);

    }
}


//allow the admin to edit team name 
const updateTeamName = async () => {
  try{
    const db = getFirestore(app);
    //Teams collection from firebase db
    const TeamCollection = collection(db, 'Teams');
    //get the team details based on the DocId
    const TeamQuery = query(TeamCollection, where('DocId', '==', TeamDocId));
    const TeamSnapShot = await getDocs(TeamQuery);
    //Update the team name
    TeamSnapShot.forEach((doc)=>{
        updateDoc(doc.ref,{Name: editName});

        Alert.alert("Team name updated.");
        console.log("Team name updated: ", TeamDocId);
        
    });
  }
  catch (error)
  {
      console.log("Failed to update team name: ", error);
  }
};

//allow admin to delete the team. As firebase does not delete other collections related to the Teams collection, 
//thus I have to delete other related collections manually myself 
const deleteTeam = async () => {
  try{
    const db = getFirestore(app);
    //Teams collection from firebase db
    const TeamCollection = collection(db, 'Teams');
    //get the team details based on the DocId
    const TeamQuery = query(TeamCollection, where('DocId', '==', TeamDocId));
    const TeamSnapShot = await getDocs(TeamQuery);

    //delete the team
    TeamSnapShot.forEach((doc)=>{
       deleteDoc(doc.ref);
       console.log("Team deleted: ", TeamDocId);
        
    });

    //Folders collection from firebase db
    const FolderCollection = doc(db, 'Folders', TeamDocId);
    //Folders sub collection based on the teams's DocId
    const FolderSubCollection = collection(FolderCollection, 'Folders');

    //get the folders details 
    const FolderSnapShot = await getDocs(FolderSubCollection);
    //delete all the folders details
    FolderSnapShot.forEach((doc)=>{
      deleteDoc(doc.ref);
      console.log("Folders deleted: ", TeamDocId);
    });

    //Projects collection from firebase db
    const ProjectCollection = doc(db, 'Projects', TeamDocId);
    //Projects sub collection based on the team's DocId
    const ProjectSubCollection = collection(ProjectCollection, 'Projects');
  
    //Get the projects details based on the user id
    const ProjectsSnapShot = await getDocs(ProjectSubCollection);
    //Delete all the projects details
    ProjectsSnapShot.forEach((doc)=>{
      deleteDoc(doc.ref);
      console.log("Projects deleted:", TeamDocId)
    });

    //Project Tasks collection from firebase db
    const ProjectTaskCollection = doc(db, 'Project Tasks', TeamDocId);
    //Project Tasks sub collections based on the team's DocId
    const ProjectTaskTodayCollection = collection(ProjectTaskCollection, 'Today');
    const ProjectTaskUpcomingCollection = collection(ProjectTaskCollection, 'Upcoming');
    const ProjectTaskPastCollection = collection(ProjectTaskCollection, 'Past');

    //Get all the project tasks from the sub collections
    const ProjectTaskTodaySnapShot = await getDocs(ProjectTaskTodayCollection);
    const ProjectTaskUpcomingSnapShot = await getDocs(ProjectTaskUpcomingCollection);
    const ProjectTaskPastSnapShot = await getDocs(ProjectTaskPastCollection);

    //Delete all the projects tasks from the sub collections
    ProjectTaskTodaySnapShot.forEach((doc)=>{
      deleteDoc(doc.ref);
      console.log("Today projects tasks deleted:", TeamDocId);
     
    }); 
    ProjectTaskUpcomingSnapShot.forEach((doc)=>{
      deleteDoc(doc.ref);
      console.log("Upcoming projects tasks deleted:", TeamDocId);
     
    })
    ProjectTaskPastSnapShot.forEach((doc)=>{
      deleteDoc(doc.ref);
      console.log("Past projects tasks deleted:", TeamDocId);
     
    })


    Alert.alert("Team disbanned.");
    
   
}
catch (error)
{
    console.log("Failed to delete team: ", error);
}
};


//allow members to add folders in the team
const addFolder = async () => {
  try{
      const db = getFirestore(app);
      //Folders collection from firebase db
      const FolderCollection = doc(db, 'Folders', TeamDocId);
      //Folders sub collection based on the team's DocId
      const FolderSubCollection = collection(FolderCollection, 'Folders')
      //Create reference id as DocId for each folder
      const Ref = doc(FolderSubCollection);
      const id = Ref.id;
      //Save the folder details to the collection
      const FolderRef = await addDoc(FolderSubCollection, {DocId: id,Folder_Name: folder});
      Alert.alert("Folder created.");
      console.log("Folder added: ", FolderRef.id);
  }
  catch (error)
  {
      console.log("Failed to add folder: ", error);
  }
}

 //get the folders details from Folders collection 
 const getFolder = async () => {
  try{
    const db = getFirestore(app);
    //Folders collection from firebase db
    const FolderCollection = doc(db, 'Folders', TeamDocId);
    //Folders sub collection based on the team's DocId
    const FolderSubCollection = collection(FolderCollection, 'Folders')

    //get the folders details 
    const FolderSnapShot = await getDocs(FolderSubCollection);
    const Folders = []
    //save the folders details to the array
    FolderSnapShot.forEach((doc) => {
      const {Folder_Name} = doc.data()
      Folders.push({
        Folder_Name: Folder_Name
    });
    });

    //save the array to setFolderInfo state
    setFolderInfo(Folders);


    return() => getFolder(Folders);

  }
  catch(error)
  {
    console.log('Fail to get all the folders:', error);
  }

};


 //get the projects details from Projects collection 
 const getProjects = async () => {
  try
  {
    const db = getFirestore(app);
    //Projects collection from firebase db
    const ProjectCollection = doc(db, 'Projects', TeamDocId);
    //Projects sub collection based on the team's DocId
    const ProjectSubCollection = collection(ProjectCollection, 'Projects');

    //get the projects details 
    const ProjectsSnapShot = await getDocs(ProjectSubCollection);
    const Projects = []
    //save the projects details to the array
    ProjectsSnapShot.forEach((doc) => {
      const {DocId, Project_Name, Folder, Colour} = doc.data()
      Projects.push({
        DocId: DocId,
        Project_Name: Project_Name,
        Folder: Folder,
        Colour: Colour
    });
    });

    //save the array to setProjectInfo and setSearchedData states
    setProjectInfo(Projects);
    setSearchedData(Projects);

    return() => getProjects(Projects);

  }
  catch(error)
  {
    console.log('Fail to get all the projects: ', error);
  }

};

//allow members to delete projects
const DeleteProject = async () => {

  try
  {
    const db = getFirestore(app);
    //Projects collection from the firebase db
    const ProjectCollection = doc(db, 'Projects', TeamDocId);
    //Projects sub collection based on the team's DocId
    const ProjectSubCollection = collection(ProjectCollection, 'Projects')

    //get the project details based on the project's DocId
    const ProjectQuery = query(ProjectSubCollection, where('DocId', '==', DeleteDocId));
    const ProjectsSnapShot = await getDocs(ProjectQuery);
    //delete the project
    ProjectsSnapShot.forEach((doc)=>{
      deleteDoc(doc.ref);
      console.log("Project deleted:", DeleteDocId);
      Alert.alert("Project deleted");
    });

  }
  catch(error)
  {
    console.log('Fail to delete the project: ', error);
  }

};

//allow members to leave team
const LeaveTeam = async () => {
  try{
    const db = getFirestore(app);
    //Teams collection from firebase db
    const TeamCollection = collection(db, 'Teams');
    //Get the team details based on the team's DocId
    const TeamQuery = query(TeamCollection, where('DocId', '==', TeamDocId));
    const TeamSnapShot = await getDocs(TeamQuery);

    // if the current user is the last member to leave, delete the team and all the related collections 
    if (noOfmembers == 1)
    {
      try{
        //delete the whole team
        TeamSnapShot.forEach((doc)=> {
          deleteDoc(doc.ref);
          console.log('Team disbanned as last member has left the team');
        });

        //Folders collection
        const FolderCollection = doc(db, 'Folders', TeamDocId);
        //Folders sub collection based on the team's DocId
        const FolderSubCollection = collection(FolderCollection, 'Folders')
  
        //Get the folders details
        const FolderSnapShot = await getDocs(FolderSubCollection);
        //Delete all the folders details
        FolderSnapShot.forEach((doc)=>{
          deleteDoc(doc.ref);
          console.log("Folders deleted: ", TeamDocId);
        });
  
        //Projects collection from firebase db
        const ProjectCollection = doc(db, 'Projects', TeamDocId);
        //Projects sub collection based on the team's DocId
        const ProjectSubCollection = collection(ProjectCollection, 'Projects')
      
        //Get the projects details
        const ProjectsSnapShot = await getDocs(ProjectSubCollection);
        //Delete all the projects
        ProjectsSnapShot.forEach((doc)=>{
          deleteDoc(doc.ref);
          console.log("Projects deleted:", TeamDocId)
        });
      
        //Project Tasks collection from firebase db
        const ProjectTaskCollection = doc(db, 'Project Tasks', TeamDocId);
        //Project Tasks sub collections based on the team's DocId
        const ProjectTaskTodayCollection = collection(ProjectTaskCollection, 'Today');
        const ProjectTaskUpcomingCollection = collection(ProjectTaskCollection, 'Upcoming');
        const ProjectTaskPastCollection = collection(ProjectTaskCollection, 'Past');

        //get all the project tasks details from the sub collections
        const ProjectTaskTodaySnapShot = await getDocs(ProjectTaskTodayCollection);
        const ProjectTaskUpcomingSnapShot = await getDocs(ProjectTaskUpcomingCollection);
        const ProjectTaskPastSnapShot = await getDocs(ProjectTaskPastCollection);

        //Delete all the project tasks
        ProjectTaskTodaySnapShot.forEach((doc)=>{
          deleteDoc(doc.ref);
         
        }); 
        ProjectTaskUpcomingSnapShot.forEach((doc)=>{
          deleteDoc(doc.ref);
         
        });
        ProjectTaskPastSnapShot.forEach((doc)=>{
          deleteDoc(doc.ref);
         
        });
        
        
        Alert.alert('You have left the team. As the team has no more member, \n the team has disbanded. ');
      }
      catch(error)
      {
        console.log('Fail to remove one of the collections', error);
      }
  
      }
      //if the current user is not the last member to leave, remove the current user's details from the team collection
      else 
        {
          //update the team by removing the current user's details
          TeamSnapShot.forEach((doc)=>
          {
            updateDoc(doc.ref, {MembersId: arrayRemove({UserId: user.uid}),Members:arrayRemove({UserId: user.uid, Role: MemberRole, Username: MemberUsername})});
            console.log('Member leave the team', user.uid);
            Alert.alert('You have left the team.');
          });
      }
  }
  catch(error)
  {
    console.log("Error", error);
  };
 

};
//---------------------------------------------------------------------------------------------------------------------

  //Confirm message for delete team
  ConfirmAlertDeleteTeam =() => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to delete this team? All the data and members will be removed too',
      [
        {text: 'Yes', onPress:()=>deleteTeam()},
        {text: 'Cancel', styles: 'cancel'}
      ]
    );

  };

  //Confirm message for delete project
  ConfirmAlertDeleteProject = () =>{
    Alert.alert(
      'Confirmation',
      'Are you sure you want to delete this project? All the tasks in the project will be removed too. (Press delete twice)',
      [
        {text: 'Yes', onPress:()=>DeleteProject()},
        {text: 'Cancel', styles: 'cancel'}
      ]
    );
  };

  //Confirm message for leave team
  ConfirmAlertLeaveTeam = () =>{
    Alert.alert(
      'Confirmation',
      'Are you sure you want to leave this team?',
      [
        {text: 'Yes', onPress:()=>LeaveTeam()},
        {text: 'Cancel', styles: 'cancel'}
      ]
    );
  };

//--------------------------------------------------------------------------------------------------------------------------------
//Create ProjectItem constant to display the projects data
  const ProjectItem =({ DocId, Project_Name, Colour, index }) => {
    return (
      <View key={index}>
        <MenuProvider skipInstanceCheck>
          <TouchableOpacity>
              <Text style={{ fontSize: 20, left: "2%",height: 50,width: "90%",margin: 12,borderWidth: 1,padding: 10,backgroundColor: Colour,borderRadius: 10,}} 
              onPress={()=>navigation.navigate('ProjectTasks',{TeamDocId, DocId})} >{Project_Name}</Text>
          </TouchableOpacity>
          <View>
            <Menu style={styles.ProjectMenuCon}>
              <MenuTrigger>
                  <Image style={styles.kebabImgProject} source={require('../assets/images/kebabmenu.png')}/>
              </MenuTrigger>
              <MenuOptions customStyles={{optionsContainer: styles.ProjectMenu}}>
                  <MenuOption  value='Delete' text='Delete' customStyles={{optionWrapper: styles.ProjectOptions}} onSelect={()=>{ConfirmAlertDeleteProject(), setDeleteDocId(DocId)}} />
                  <MenuOption  value='Edit' text='Edit' customStyles={{optionWrapper: styles.ProjectOptions}} onSelect={()=>navigation.navigate('EditProject',{DocId, TeamDocId})}/>
              </MenuOptions>
            </Menu>
          </View>
        </MenuProvider>
      </View>
    )

  };

  //render the project data
  const renderProjectItem = ({ item, index }) => (
    <ProjectItem Project_Name={item.Project_Name} DocId={item.DocId} Colour={item.Colour} key={index}/>
  );

  // Display all the projects, including the one with no folder in the All section.
  //Else display the project list based on the folder when the user presses the folder buttons.
  const filteredListFolder = useMemo(()=>{
    if (folderFilter === 'None') 
      {
          return projectInfo
      }
      
    return projectInfo.filter(item => folderFilter == item.Folder);
    
  }, [folderFilter, projectInfo]);


  //Display message if no project created
  const emptyProjectInfo = () =>
    {
      if (folderFilter === 'None' )
        return(
          <View style={styles.container}>
            <View>
              <Text style={styles.titleStyle}>You have no project right now.</Text>
            </View>
          </View>
        )
        return(
          <View style={styles.container}>
            <View>
              <Text style={styles.titleStyle}>You have not added a project to this folder.</Text>
            </View>
          </View>
        )
    };
  

  //save the folder value into setFolderFilter and setFOlderBtnActive states
  const FolderPress = (folderFilter) => () => {
    setFolderFilter(folderFilter);
    setFolderBtnActive(folderFilter);
  }

  //filter the project data when search
  const handleSearch = text => {
    const formattedQuery = text;
    const filteredData = filter(searchedData, user => {
      return contains(user, formattedQuery);
    });
    setProjectInfo(filteredData);
    setSearchQuery(text);
  };
  
  //allow the user to search the data through project name
  const contains = ({ Project_Name }, query) => {
    if (Project_Name.includes(query) ) {
      return true;
    }
    return false;
  };
    

  //allow user to refresh the data when new update
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(()=> {
      getTeam();
      getProjects();
      getFolder();
      setRefreshing(false);
    },2000);
  },[],);

  return (
    <SafeAreaView style={styles.SafeAreaView}>
        <MenuProvider skipInstanceCheck={true}>
          <View style={styles.TeamCon}>
            <View style={{flexDirection: 'row'}}>
              <View style={{width:'93%'}}>
                 <Text style={styles.TextContainer}>{teamName} {'\n'}<Text style={styles.TextContainer2}>Members: {noOfmembers}</Text> </Text>
                
              </View>
             <View style={{alignContent:'flex-end' }}>
               <Menu>
              <MenuTrigger>
                <Image style={styles.kebabImg} source={require('../assets/images/kebabmenu.png')}/>
              </MenuTrigger>
              <MenuOptions customStyles={{optionsContainer: { borderRadius:10, width: "35%"}}} optionsContainerStyle={{marginTop: 20}}>
                {/* if the current user is an admin, display the following menu options */}
                { AdminMember ? (
                  <View>  
                    <MenuOption  customStyles={{optionWrapper: styles.TeamOptions}} value='Member List' text='Member List' onSelect={()=>navigation.navigate('MemberList',{TeamDocId})}/>             
                    <MenuOption  customStyles={{optionWrapper:styles.TeamOptions}}  value='Edit Team' text='Edit Team' onSelect={() => setModalVisible(!modalVisible)}/>
                    <MenuOption  customStyles={{optionWrapper: styles.TeamOptions}} value='Manage Folders' text='Manage Folders' onSelect={()=>navigation.navigate('ManageFolders',{TeamDocId})}/>
                    <MenuOption  customStyles={{optionWrapper: styles.TeamOptions}} value='Delete Team' text='Delete Team' onSelect={() => ConfirmAlertDeleteTeam()}/>
                    <MenuOption  customStyles={{optionWrapper: styles.TeamOptions}} value='Leave Team' text='Leave Team' onSelect={() => ConfirmAlertLeaveTeam()}/>
                  </View>
                  
                ): (
                  //if the current user is a member, display these following menu options
                  <View>
                     <MenuOption  customStyles={{optionWrapper: styles.CategoryOptions}} value='Member List' text='Member List' onSelect={()=>navigation.navigate('MemberList',{TeamDocId})}/>
                     <MenuOption  customStyles={{optionWrapper: styles.CategoryOptions}} value='Manage Folders' text='Manage Folders' onSelect={() => navigation.navigate('ManageFolders',{TeamDocId})}/>
                     <MenuOption  customStyles={{optionWrapper: styles.CategoryOptions}} value='Leave Team' text='Leave Team' onSelect={() => ConfirmAlertLeaveTeam()}/>
                  </View>
                )}
               
              </MenuOptions>

            </Menu>
             </View>
           
            </View>
            <View>
              
            </View>
            </View>
            <View style={styles.container}>
            {filteredListFolder && (
           <FlatList
            keyboardShouldPersistTaps="always"
            data={filteredListFolder} 
            renderItem={renderProjectItem}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
            ListEmptyComponent={emptyProjectInfo}
            ItemSeparatorComponent={Separator}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={
              <View>
              <TextInput
             autoCapitalize="none"
             autoCorrect={false}
             clearButtonMode="always"
             value={searchquery}
             onChangeText={queryText => handleSearch(queryText)}
             placeholder="Search projects...."
             style={styles.SearchTextInput}
            />

            <View style={{ flexDirection: "row", left: '10%',}}>
              <View style={{width: '50%'}}>
                 <Text style={styles.ProjectsText}>Project(s)</Text>
              </View>
             <View style={{left: "290%"}}>
              <TouchableOpacity onPress={()=>navigation.navigate('CreateProject', {TeamDocId})}>
                 <Image style={styles.image} source={require("../assets/images/addproject.png")}></Image>
              </TouchableOpacity>
             </View>
             <View style={{left: "310%"}}>
              <TouchableOpacity onPress={() => setFolderModalVisible(!FoldermodalVisible)}>
                 <Image style={styles.image} source={require("../assets/images/addfolder.png")}></Image>
              </TouchableOpacity>
             </View>
            </View>
            <View style={styles.ProjectList}>
            <ScrollView horizontal >
              <View style={{flexDirection: "row", margin: 5}}>
                <TouchableOpacity style={FolderBtnActive === "None" ? { margin: 5, backgroundColor:"#31E731", width:50,borderRadius: 25}: { margin: 5, backgroundColor:"#BEFDBE", width:50,borderRadius: 25}} onPress={FolderPress('None')}>
                  <Text style={FolderBtnActive === "None" ? {fontSize: 18, color: 'white', textAlign:'center'}: {fontSize: 18, textAlign:'center'}}>All</Text>
                </TouchableOpacity>
                {folderInfo.map((folder)=>{
                  return (
                    <View>
                      <TouchableOpacity style={FolderBtnActive === folder.Folder_Name ? styles.ProjectListButtonsActive: styles.ProjectListButtons} onPress={() =>{ setFolderFilter(folder.Folder_Name), setFolderBtnActive(folder.Folder_Name)}}>
                        <Text style={FolderBtnActive === folder.Folder_Name ? {color: 'white',fontSize: 18,textAlign:'center'}: {fontSize: 18,textAlign:'center'}} >{folder.Folder_Name}</Text>
                      </TouchableOpacity>
                    </View>
                  )
                })}
              </View>
            </ScrollView>
          </View>
            </View>
              
            }
            />
          )}

            
          </View>

        </MenuProvider>

      <Modal animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {setModalVisible(!modalVisible)}}>
          <View style={styles.modalView}>
            <Text style={styles.ModalTextContainer}>Edit Team</Text>
            <TextInput style={styles.textinput} defaultValue={teamName} onChangeText={(value)=> setEditName(value)} />
           
            <View style={styles.Modalbuttoncontainer}>
              <View>
                <TouchableOpacity  style={styles.Modalbutton}>
                  <Text style={styles.ModalbuttonText} onPress={updateTeamName}>Update</Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity  style={styles.Modalbutton}>
                  <Text style={styles.ModalbuttonText}  onPress={() => setModalVisible(!modalVisible)}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal animationType="slide"
          transparent={true}
          visible={FoldermodalVisible}
          onRequestClose={() => {setFolderModalVisible(!FoldermodalVisible)}}>
          <View style={styles.modalView}>
            <Text style={styles.ModalTextContainer}>Add Folder</Text>
            <TextInput style={styles.textinput} placeholder='Folder name' value={folder} onChangeText={(value)=> setFolder(value)} />
           
            <View style={styles.Modalbuttoncontainer}>
              <View>
                <TouchableOpacity  style={styles.Modalbutton}>
                  <Text style={styles.ModalbuttonText} onPress={addFolder}>Create</Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity  style={styles.Modalbutton}>
                  <Text style={styles.ModalbuttonText}  onPress={() =>setFolderModalVisible(!FoldermodalVisible)}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        
    </SafeAreaView>
  )


}