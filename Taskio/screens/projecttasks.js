import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, SafeAreaView,TouchableOpacity, Alert,FlatList,RefreshControl} from 'react-native';
import { Separator } from 'react-native-tableview-simple';
import {Menu, MenuProvider, MenuOptions, MenuOption,MenuTrigger} from 'react-native-popup-menu';
import React, {useEffect, useState} from 'react';
import {app} from "../firebaseConfig.js"
import styles from '../css/teamcss.js'
import { getDocs, collection,getFirestore,query, where,updateDoc, doc, deleteDoc} from 'firebase/firestore';
import {useRoute } from '@react-navigation/native';


//Project Tasks function
export default function ProjectTasksScreen({navigation}) {

    
    const route = useRoute();
    const ProjectdocId = route.params?.DocId;
    const TeamDocId = route.params?.TeamDocId;

    //Refresh data
    const [refreshing, setRefreshing] = useState(false);

    const [ProjectName, setProjectName] = useState('');
    const [TaskInfo, settaskinfo] = useState('');


    //DocId value for delete task
    const [DeleteDocId, setDeleteDocId] = useState('');
    //DocId value for mark task as done
    const [DocIdInfo, setDocIdInfo] = useState('');

    useEffect(() => {
        getProjectName();
        getProjectTasks();
    },[]);

    //Get the project name from Projects collection
    const getProjectName = async() => {
        try{
            const db = getFirestore(app);
            //Projects collection from firebase db
            const ProjectCollection = doc(db, 'Projects', TeamDocId);
            //Projects sub collection based on the team's DocId
            const ProjectSubCollection = collection(ProjectCollection, 'Projects');

            //get the project name
            const ProjectQuery = query(ProjectSubCollection, where('DocId', '==', ProjectdocId));
            const ProjectsSnapShot = await getDocs(ProjectQuery);
            const Projects = []
            //save the project name to the array
            ProjectsSnapShot.forEach((doc) => {
                const {Project_Name} = doc.data()
                Projects.push(
                Project_Name
            );

            //save the array to the setProjectName state
            setProjectName(Projects);

            return() => getProjectName(Projects);
        
        });
        }
        catch (error)
        {
            console.log('Fail to get the project name:', error);
        }
    };

    //Get all the project tasks from Project Tasks collection
    const getProjectTasks = async() => {
        try{
            const db = getFirestore(app);
            //Project Tasks collection from firebase db
            const ProjectTaskCollection = doc(db, 'Project Tasks', TeamDocId);
            //Project Tasks sub collections based on the team's DocId
            const ProjectTaskTodayCollection = collection(ProjectTaskCollection, 'Today')
            const ProjectTaskUpcomingCollection = collection(ProjectTaskCollection, 'Upcoming')
            const ProjectTaskPastCollection = collection(ProjectTaskCollection, 'Past') 
            
            //Get all the project tasks from the sub collections
            const ProjectTaskTodayQuery = query(ProjectTaskTodayCollection, where('ProjectDocId','==',ProjectdocId))
            const ProjectTaskTodaySnapShot = await getDocs(ProjectTaskTodayQuery);
            const TodayTask = [];
            
            const ProjectTaskUpcomingQuery = query(ProjectTaskUpcomingCollection, where('ProjectDocId','==',ProjectdocId))
            const ProjectTaskUpcomingSnapShot = await getDocs(ProjectTaskUpcomingQuery);
            const UpcomingTask = [];
        
            const ProjectTaskPastQuery = query(ProjectTaskPastCollection, where('ProjectDocId','==',ProjectdocId))
            const ProjectTaskPastSnapShot = await getDocs(ProjectTaskPastQuery);
            const PastTask = [];
        
        
        
            //save the project tasks details to each array
            ProjectTaskTodaySnapShot.forEach((doc) => {
              const {Title, DocId, DisplayDate, MarkasDone, Time, Hour,Minute,Deadline, AssignTo} = doc.data();
              //The Deadline value is first converted from object to date datatype
              const deadline = new Date(Date.parse(Deadline.toDate()))
              //Change the date format to yyyy-mm-dd to match with the react native calendar date value, and then save it to date constant
              const date = deadline.getFullYear()+'-'+('0'+(deadline.getMonth()+1)).slice(-2)+'-'+('0'+(deadline.getDate())).slice(-2); 
              //Options is used to change the time to 24hrs format and show 2 digits for both hour and minute. Default format was 12hrs with hours, minutes and seconds
              const options = {hour12: false, hour: '2-digit', minute: '2-digit'}
              //Convert the time to local time string with the options, and then save it to time constant
              const time = deadline.toLocaleTimeString('en-US',options)
        
              TodayTask.push({
                Title: Title,
                AssignTo: AssignTo,
                DocId: DocId,
                MarkasDone: MarkasDone,
                Date: date,
                Time: time,
                DisplayDate: DisplayDate
               
            });
            });
        
            ProjectTaskUpcomingSnapShot.forEach((doc) => {
              const {Title, DocId, DisplayDate, MarkasDone, Time, Hour,Minute,Deadline, AssignTo} = doc.data();
              //The Deadline value is first converted from object to date datatype
              const deadline = new Date(Date.parse(Deadline.toDate()))
              //Change the date format to yyyy-mm-dd to match with the react native calendar date value, and then save it to date constant
              const date = deadline.getFullYear()+'-'+('0'+(deadline.getMonth()+1)).slice(-2)+'-'+('0'+(deadline.getDate())).slice(-2); 
              //Options is used to change the time to 24hrs format and show 2 digits for both hour and minute. Default format was 12hrs with hours, minutes and seconds
              const options = {hour12: false, hour: '2-digit', minute: '2-digit'}
              //Convert the time to local time string with the options, and then save it to time constant
              const time = deadline.toLocaleTimeString('en-US',options)
        
              UpcomingTask.push({
                Title: Title,
                AssignTo: AssignTo,
                DocId: DocId,
                MarkasDone: MarkasDone,
                Date: date,
                Time: time,
                DisplayDate: DisplayDate
          
            });
            });
        
            ProjectTaskPastSnapShot.forEach((doc) => {
              const {Title, DocId, DisplayDate,MarkasDone, Time, Hour,Minute,Deadline, AssignTo} = doc.data();
              //The Deadline value is first converted from object to date datatype
              const deadline = new Date(Date.parse(Deadline.toDate()))
              //Change the date format to yyyy-mm-dd to match with the react native calendar date value, and then save it to date constant
              const date = deadline.getFullYear()+'-'+('0'+(deadline.getMonth()+1)).slice(-2)+'-'+('0'+(deadline.getDate())).slice(-2); 
              //Options is used to change the time to 24hrs format and show 2 digits for both hour and minute. Default format was 12hrs with hours, minutes and seconds
              const options = {hour12: false, hour: '2-digit', minute: '2-digit'}
              //Convert the time to local time string with the options, and then save it to time constant
              const time = deadline.toLocaleTimeString('en-US',options)
        
              PastTask.push({
                Title: Title,
                AssignTo: AssignTo,
                DocId: DocId,
                MarkasDone: MarkasDone,
                Date: date,
                Time: time,
                DisplayDate: DisplayDate
               
            });
            });

            //Combine all the arrays to one array
            const AllTasks = [...TodayTask, ...PastTask, ...UpcomingTask];
        
            //sort the array based on the DisplayDate. Today > Upcoming > Past > Completed
            AllTasks.sort((a,b)=> {
              const orders = {'Today': 0, 'Upcoming': 1, 'Past': 2, 'Completed': 3};
              return orders[a.DisplayDate] - orders[b.DisplayDate];
            })
        
            //save the array to settaskinfo state
            settaskinfo(AllTasks);
            
            return() => getTask(AllTasks);
        }
        catch(error)
        {
            console.log('Fail to get the project tasks:', error);
        }

    };

  //delete the task in the firebase collection 
  const deleteTask = async () => {
    try{
        const db = getFirestore(app);
        //Project Tasks collection from firebase db
        const ProjectTaskCollection = doc(db, 'Project Tasks', TeamDocId);
        //Project Tasks sub collections based on the team's DocId
        const ProjectTaskTodayCollection = collection(ProjectTaskCollection, 'Today')
        const ProjectTaskUpcomingCollection = collection(ProjectTaskCollection, 'Upcoming')
        const ProjectTaskPastCollection = collection(ProjectTaskCollection, 'Past')

        //get all the project tasks from the sub collections
        const ProjectTaskTodayQuery = query(ProjectTaskTodayCollection, where('DocId', '==', DeleteDocId));
        const ProjectTaskTodaySnapShot = await getDocs(ProjectTaskTodayQuery);
 
        const ProjectTaskUpcomingQuery = query(ProjectTaskUpcomingCollection, where('DocId', '==', DeleteDocId));
        const ProjectTaskUpcomingSnapShot = await getDocs(ProjectTaskUpcomingQuery);
 
        const ProjectTaskPastQuery = query(ProjectTaskPastCollection, where('DocId', '==', DeleteDocId));
        const ProjectTaskPastSnapShot = await getDocs(ProjectTaskPastQuery);

        //Delete the task if the task is under Today sub collection
        ProjectTaskTodaySnapShot.forEach((doc)=>{
           deleteDoc(doc.ref);
           Alert.alert("Task deleted");
           console.log("Task deleted: ", DeleteDocId);
        });
 
        //Delete the task if the task is under Upcoming sub collection
        ProjectTaskUpcomingSnapShot.forEach((doc)=>{
        deleteDoc(doc.ref);
         Alert.alert("Task deleted");
           console.log("Task deleted: ", DeleteDocId);
      });
 
        //Delete the task if the task is under Past sub collection
        ProjectTaskPastSnapShot.forEach((doc)=>{
          deleteDoc(doc.ref);
        Alert.alert("Task deleted");
            console.log("Task deleted: ", DeleteDocId);
      });
       
    }
    catch (error)
    {
        console.log("Failed to delete task: ", error);
    }
  };

    //mark the task as done based on the DocId
    const CompleteTask = async () => {
        try{
           const db = getFirestore(app);
           //Project Tasks collection from firebase db
           const ProjectTaskCollection = doc(db, 'Project Tasks', TeamDocId);
           //Project Tasks sub collections based on the team's DocId
           const ProjectTaskTodayCollection = collection(ProjectTaskCollection, 'Today')
           const ProjectTaskUpcomingCollection = collection(ProjectTaskCollection, 'Upcoming')
           const ProjectTaskPastCollection = collection(ProjectTaskCollection, 'Past') 

           //get all the project tasks from the sub collections
           const ProjectTaskTodayQuery = query(ProjectTaskTodayCollection, where('DocId', '==', DocIdInfo));
           const ProjectTaskTodaySnapShot = await getDocs(ProjectTaskTodayQuery);
    
            const ProjectTaskUpcomingQuery = query(ProjectTaskUpcomingCollection, where('DocId', '==', DocIdInfo));
            const ProjectTaskUpcomingSnapShot = await getDocs(ProjectTaskUpcomingQuery);
    
            const ProjectTaskPastQuery = query(ProjectTaskPastCollection, where('DocId', '==', DocIdInfo));
            const ProjectTaskPastSnapShot = await getDocs(ProjectTaskPastQuery);

           //Update MarkasDone field to true and DisplayDate field to Completed if the task is under Today sub collection
           ProjectTaskTodaySnapShot.forEach((doc)=>{
              updateDoc(doc.ref,{MarkasDone: true, DisplayDate: 'Completed'});
              console.log("Task is mark as done: ", DocIdInfo);
           });
    
           //Update MarkasDone field to true and DisplayDate field to Completed if the task is under Upcooming sub collection
           ProjectTaskUpcomingSnapShot.forEach((doc)=>{
            updateDoc(doc.ref,{MarkasDone: true, DisplayDate: 'Completed'});
            console.log("Task is mark as done: ", DocIdInfo);
         });

         //Update MarkasDone field to true and DisplayDate field to Completed if the task is under Past sub collection
         ProjectTaskPastSnapShot.forEach((doc)=>{
          updateDoc(doc.ref,{MarkasDone: true, DisplayDate: 'Completed'});
          console.log("Task is mark as done: ", DocIdInfo);
       });
           
       }
       catch (error)
       {
           console.log("Failed to complete task: ", error);
       }
     };



    //Create TaskItem constant to display the task data
    const TaskItem = ({ Title, DisplayDate, DocId, AssignTo, index }) => {
      
      //If the task is completed, display the task title as text. User would not be able to press on it
      if (DisplayDate === "Completed")
      {
        return (
          <View key={index}>
            <Text style={styles.TaskItemText}>{DisplayDate}</Text>
              <Text style={styles.TaskItemComplete}>{Title} {'\n'}
              <Text style={styles.TaskAssignTxt}>Assign to: {AssignTo}</Text>
              </Text>
          </View>
        )
      }
      //if the task is not completed, display the tasks title as button and show task menu
      else{
        return (
          <View key={index}>
            <MenuProvider skipInstanceCheck>
              <Text style={styles.TaskItemText}>{DisplayDate}</Text>
              <TouchableOpacity>
                  <Text style={styles.TaskItemBtn} onPress={()=> navigation.navigate("EditProjectTask", {TeamDocId, DocId})}>{Title} {'\n'}
                  <Text style={styles.TaskAssignTxt}>Assign to: {AssignTo}</Text>
                  </Text>
      
              </TouchableOpacity>

              <View>
                <Menu style={styles.TaskMenuCon}>
                  <MenuTrigger>
                      <Image style={styles.kebabImgTask} source={require('../assets/images/kebabmenu.png')}/>
                  </MenuTrigger>
                  <MenuOptions customStyles={{optionsContainer: styles.TaskMenu}}>
                      <MenuOption onSelect={()=>{ConfirmAlertDelete(DocId)}} value='Delete' text='Delete' customStyles={{optionWrapper: styles.TaskOptions}}  />
                      <MenuOption onSelect={()=>{ConfirmAlertMarkasDone(DocId)}} value='Mark as Done' text='Mark as Done' customStyles={{optionWrapper: styles.TaskOptions}}/>
                  </MenuOptions>
                </Menu>
              </View>
            </MenuProvider>
          </View>
        )
      };
    };

  //render the task data
  const renderTaskItem = ({ item, index }) => (
    <TaskItem Title={item.Title} DisplayDate={item.DisplayDate} DocId={item.DocId} AssignTo={item.AssignTo} key={index}/>
  );

    //Display message if no task created
    const emptyTaskinfo = () =>
        {
          return(
            <View>
              <Text style={styles.noTaskTxt}>Your team has not created task yet.</Text>
            </View>
        
          )
        };

  //-----------------------------------------------------------------------------------------------------
  //allow user to refresh the task and category list when user has created a new one
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(()=> {
        getProjectTasks();
        setRefreshing(false);
    },2000);
  },[],);


    //Confirm alert message for delete task
    const ConfirmAlertDelete =(DocId) => {
        setDeleteDocId(DocId);
        Alert.alert(
          'Confirmation',
          'Are you sure you want to delete this task? (Press on Delete twice)',
          [
            {text: 'Yes', onPress:()=>deleteTask(DocId)},
            {text: 'Cancel', styles: 'cancel'}
          ]
        );
    
      }
      //Confirm alert message for mark task as done
      const ConfirmAlertMarkasDone =(docid) => {
        setDocIdInfo(docid);
        Alert.alert(
          'Confirmation',
          'Once completed, you would not be able to modify this task again. (Press on Mark as Done twice)',
          [
            {text: 'Ok', onPress:()=>CompleteTask(docid)},
            {text: 'Cancel', styles: 'cancel'}
          ]
        );
    
      }

    return(
        <SafeAreaView style={styles.SafeAreaView}>
            <View style={styles.container}>
                <View style={styles.TeamCon}>
                    <View>
                        <Text style={styles.ProjectNameCon}>{ProjectName}</Text>
                    </View>
                </View>

        
                {TaskInfo && (
                <FlatList
                    keyboardShouldPersistTaps="always"
                    data={TaskInfo} 
                    renderItem={renderTaskItem}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
                    ItemSeparatorComponent={Separator}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={emptyTaskinfo}
                
                    />
                )}

                <View style={styles.buttoncontainer}>
                    <TouchableOpacity onPress={() => navigation.navigate("CreateProjectTask",{ProjectdocId, TeamDocId})}>
                        <Image style={styles.taskbtn}source={require("../assets/images/addtaskbtn.png")}/>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}