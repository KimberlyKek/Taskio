import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, SafeAreaView,TouchableOpacity, TextInput, Alert,Modal,ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import RNPickerSelect from 'react-native-picker-select';
import {app} from "../firebaseConfig.js"
import DateTimePicker from 'react-native-ui-datepicker';
import styles from '../css/EditTaskCss.js'
import { getDocs, collection,getFirestore,query, where, push,updateDoc, doc,get} from 'firebase/firestore';
import {useRoute } from '@react-navigation/native';

//Edit project task function
export default function EditProjectTaskScreen() {

    //Get the team DocId and project task DocId from projecttasks.js
    const route = useRoute();
    const TeamDocId = route.params?.TeamDocId;
    const TaskdocId = route.params?.DocId;

    //show or hide sub task field
    const [showSubTask, setShowSubTask] = useState(false)
    const toggleSubTask = () => setShowSubTask(showSubTask => !showSubTask)

    //show or hide priority field
    const [showPriority, setShowPriority] = useState(false)
    const togglePriority = () => setShowPriority(showPriority => !showPriority)

    //show or hide notes field
    const [showNotes, setShowNotes] = useState(false)
    const toggleNotes = () => setShowNotes(showNotes => !showNotes)
    
    const [task, setTask] = useState('');
    const [subtask, setSubTask] = useState('');
    const [notes, setNotes] = useState('');
    const [assign, setAssign] = useState([]);
    const [priority, setPriority] = useState([]);
    const [date, setDate] = useState('');
    const [timePicker, setTimePicker] = useState(true);
    //convert date value to Date data type
    const deadline = new Date(Date.parse(date));


    const [assignValue, setAssignValue] = useState('');
    const [PriorityValue, setPriorityValue] = useState('');


    //visibility setting for modal
    const [modalVisible, setModalVisible] = useState(false);

    //placeholders for options pickers
    const placeholder = {
        label: 'Assign to...',
        value: null,
    };

    const Priorityplaceholder = {
        label: 'Select priority...',
        value: null,
    };


    //convert category object elements to array
    const Membersoptions = [];
    assign.forEach((item)=> {
        Membersoptions.push({
        label:item,
        value: item
    })
    })

    //convert priority object elements to array
    const Priorityoptions = [];
    priority.forEach((item)=>{
        Priorityoptions.push({
        label: item.Priority,
        value: item.Priority
        })
    })


    
    useEffect(()=>{
        getMembers();
        getPriority();
        getProjectTask();
    },[]);

  //get the members data from Teams collection in firebase
  const getMembers = async () => {
    
    try{
        const db = getFirestore(app);
        //Teams collection from firebase db
        const TeamCollection = collection(db, 'Teams');
        //Get the team details based on the team's DocId
        const TeamQuery = query(TeamCollection, where('DocId', '==', TeamDocId));
        const TeamSnapShot = await getDocs(TeamQuery);
        const Team = []
        //Save the members details to the array
        TeamSnapShot.forEach((doc) => {
            const {Members} = doc.data()
            Team.push({

                MembersRoles: Members
            })
            });

        //As MembersRoles in the array is a nested array, I have to use flatMap to make MembersRoles as an array 
        const MembersList = Team.flatMap(function(el){return el.MembersRoles});
        //Get the username elements from the MembersList array and save to Members array
        const Members = MembersList.flatMap(function(el){return el.Username});

        //save the array to setAssign state
        setAssign(Members);
    
    }
    catch (error)
    {
        console.log('Fail to get the members details from the team:', error)
    }

  };

  //get priority data from Priority collection in firebase
  const getPriority = async () => {
    
    const db = getFirestore(app);
    //Priority collection
    const PriorityCollection = collection(db, 'Priority');

    const PrioritySnapShot = await getDocs(PriorityCollection);
    const Priority = []
    //save the data to Priority array
    PrioritySnapShot.forEach((doc) => {
      const {Priority_Lv} = doc.data()
      Priority.push({
        Priority: Priority_Lv
    })
    })
    setPriority(Priority)

    return() => getPriority(Priority)

  };

  //Get the project task details from Project Tasks collection
const getProjectTask = async() => {
    try{
        const db = getFirestore(app);
        //Project Tasks collection from firebase db
        const ProjectTaskCollection = doc(db, 'Project Tasks', TeamDocId);
        //Project Tasks sub collections
        const ProjectTaskTodayCollection = collection(ProjectTaskCollection, 'Today')
        const ProjectTaskUpcomingCollection = collection(ProjectTaskCollection, 'Upcoming')
        const ProjectTaskPastCollection = collection(ProjectTaskCollection, 'Past') 
        //Get the project task details from one of the sub collections, based on the task's DocId the user has selected
        const ProjectTaskTodayQuery = query(ProjectTaskTodayCollection, where( 'DocId','==',TaskdocId))
        const ProjectTaskTodaySnapShot = await getDocs(ProjectTaskTodayQuery);
        const TodayTask = [];
        
        const ProjectTaskUpcomingQuery = query(ProjectTaskUpcomingCollection, where('DocId','==',TaskdocId))
        const ProjectTaskUpcomingSnapShot = await getDocs(ProjectTaskUpcomingQuery);
        const UpcomingTask = [];
    
        const ProjectTaskPastQuery = query(ProjectTaskPastCollection, where('DocId','==',TaskdocId))
        const ProjectTaskPastSnapShot = await getDocs(ProjectTaskPastQuery);
        const PastTask = [];
  
    
        //If the task user has selected is from Today sub collection, get the task details
        ProjectTaskTodaySnapShot.forEach((doc) => {
          const {Title, AssignTo, MarkasDone, Notes, Priority, subTask, Deadline, DocId} = doc.data();
          //The Deadline value is first converted from object to date datatype
          const deadline = new Date(Date.parse(Deadline.toDate()))
    
          TodayTask.push({
            Title: Title,
            subTask: subTask,
            AssignTo: AssignTo,
            DocId: DocId,
            MarkasDone: MarkasDone,
            Notes: Notes,
            Priority: Priority,
            Date: deadline,
           
        });
        });
    
        //If the task user has selected is from Upcoming sub collection, get the task details
        ProjectTaskUpcomingSnapShot.forEach((doc) => {
            const {Title, AssignTo, MarkasDone, Notes, Priority, subTask, Deadline, DocId} = doc.data();
            //The Deadline value is first converted from object to date datatype
            const deadline = new Date(Date.parse(Deadline.toDate()))
      
            TodayTask.push({
              Title: Title,
              subTask: subTask,
              AssignTo: AssignTo,
              DocId: DocId,
              MarkasDone: MarkasDone,
              Notes: Notes,
              Priority: Priority,
              Date: deadline,
             
          });
        });
    
         //If the task user has selected is from Past sub collection, get the task details
        ProjectTaskPastSnapShot.forEach((doc) => {
            const {Title, AssignTo, MarkasDone, Notes, Priority, subTask, Deadline, DocId} = doc.data();
            //The Deadline value is first converted from object to date datatype
            const deadline = new Date(Date.parse(Deadline.toDate()))
      
            TodayTask.push({
              Title: Title,
              subTask: subTask,
              AssignTo: AssignTo,
              DocId: DocId,
              MarkasDone: MarkasDone,
              Notes: Notes,
              Priority: Priority,
              Date: deadline,
             
          });
        });
    
        //Combine all the arrays into one array as the selection is based on the user
        const AllTasks = [...TodayTask, ...PastTask, ...UpcomingTask];
    
       
        //save the array element into each of the respective state
        setTask(AllTasks[0].Title);
        setSubTask(AllTasks[0].subTask);
        setPriorityValue(AllTasks[0].Priority);
        setAssignValue(AllTasks[0].AssignTo);
        setNotes(AllTasks[0].Notes);
        setDate(AllTasks[0].Date);
        
        return() => getProjectTask(AllTasks);
    }
    catch(error)
    {
        console.log('Fail to get the project tasks:', error);
    }

};

//update project task details in the Project Tasks collection
const UpdateProjectTask = async() => {
    try{
      //Display alert message if task field is empty
        if (!task.trim())
            {
              Alert.alert("Task name must not be blank!");
            }
        else{
            const db = getFirestore(app);
            //Project Tasks collection from firebase db
            const ProjectTaskCollection = doc(db, 'Project Tasks', TeamDocId);
            //Project Tasks sub collections
            const ProjectTaskTodayCollection = collection(ProjectTaskCollection, 'Today')
            const ProjectTaskUpcomingCollection = collection(ProjectTaskCollection, 'Upcoming')
            const ProjectTaskPastCollection = collection(ProjectTaskCollection, 'Past') 

             //get today's date
            const today = new Date();
            //change today's date format to yyyy-mm-dd to match with the firebase timestamp
            const todayDate = today.getFullYear()+'-'+('0'+(today.getMonth()+1)).slice(-2)+'-'+('0'+(today.getDate())).slice(-2);
            
            //Get the project task details from one of the sub collections, based on what the user has selected
            const ProjectTaskTodayQuery = query(ProjectTaskTodayCollection, where( 'DocId','==',TaskdocId))
            const ProjectTaskTodaySnapShot = await getDocs(ProjectTaskTodayQuery);
            
            const ProjectTaskUpcomingQuery = query(ProjectTaskUpcomingCollection, where('DocId','==',TaskdocId))
            const ProjectTaskUpcomingSnapShot = await getDocs(ProjectTaskUpcomingQuery);
        
            const ProjectTaskPastQuery = query(ProjectTaskPastCollection, where('DocId','==',TaskdocId))
            const ProjectTaskPastSnapShot = await getDocs(ProjectTaskPastQuery);

             //If the user edits the task from Today sub collection, save the updated details
            ProjectTaskTodaySnapShot.forEach((doc)=>{
                updateDoc(doc.ref,{Title: task, subTask: subtask, Priority: PriorityValue, AssignTo: assignValue, Deadline: deadline, Notes: notes, 
                DisplayDate: (()=> {
                    //if the Deadline has updated to later date than today, change the DisplayDate to Upcoming
                    if(Date.parse(todayDate)<Date.parse(deadline.getFullYear()+'-'+('0'+(deadline.getMonth()+1)).slice(-2)+'-'+('0'+(deadline.getDate())).slice(-2)))
                    {
                        return 'Upcoming'
                    }
                    //if the Deadline has updated to earlier date than today, change the DisplayDate to Past
                    else if (Date.parse(todayDate)>Date.parse(deadline.getFullYear()+'-'+('0'+(deadline.getMonth()+1)).slice(-2)+'-'+('0'+(deadline.getDate())).slice(-2)))
                    {
                    return 'Past'
                    }
                    //if the Deadline has updated to today's date, change the DisplayDate to Today
                    else
                    {
                    return 'Today';
                    }
                    
                })() });  
    
                Alert.alert("You have updated the task successfully.");
                console.log("Task updated: ", TaskdocId);
                
            });

             //If the user edits the task from Upcoming sub collection, save the updated details
             ProjectTaskUpcomingSnapShot.forEach((doc)=>{
                updateDoc(doc.ref,{Title: task, subTask: subtask, Priority: PriorityValue, AssignTo: assignValue, Deadline: deadline, Notes: notes, 
                DisplayDate: (()=> {
                    //if the Deadline has updated to later date than today, change the DisplayDate to Upcoming
                    if(Date.parse(todayDate)<Date.parse(deadline.getFullYear()+'-'+('0'+(deadline.getMonth()+1)).slice(-2)+'-'+('0'+(deadline.getDate())).slice(-2)))
                    {
                        return 'Upcoming'
                    }
                    //if the Deadline has updated to earlier date than today, change the DisplayDate to Past
                    else if (Date.parse(todayDate)>Date.parse(deadline.getFullYear()+'-'+('0'+(deadline.getMonth()+1)).slice(-2)+'-'+('0'+(deadline.getDate())).slice(-2)))
                    {
                    return 'Past'
                    }
                    //if the Deadline has updated to today's date, change the DisplayDate to Today
                    else
                    {
                    return 'Today';
                    }
                    
                })() });  
    
                Alert.alert("You have updated the task successfully.");
                console.log("Task updated: ", TaskdocId);
                
            });

             //If the user edits the task from Past sub collection, save the updated details
             ProjectTaskPastSnapShot.forEach((doc)=>{
                updateDoc(doc.ref,{Title: task, subTask: subtask, Priority: PriorityValue, AssignTo: assignValue, Deadline: deadline, Notes: notes, 
                DisplayDate: (()=> {
                    //if the Deadline has updated to later date than today, change the DisplayDate to Upcoming
                    if(Date.parse(todayDate)<Date.parse(deadline.getFullYear()+'-'+('0'+(deadline.getMonth()+1)).slice(-2)+'-'+('0'+(deadline.getDate())).slice(-2)))
                    {
                        return 'Upcoming'
                    }
                    //if the Deadline has updated to earlier date than today, change the DisplayDate to Past
                    else if (Date.parse(todayDate)>Date.parse(deadline.getFullYear()+'-'+('0'+(deadline.getMonth()+1)).slice(-2)+'-'+('0'+(deadline.getDate())).slice(-2)))
                    {
                    return 'Past'
                    }
                    //if the Deadline has updated to today's date, change the DisplayDate to Today
                    else
                    {
                    return 'Today';
                    }
                    
                })() });  
    
                Alert.alert("Error","You have updated the task successfully.");
                console.log("Task updated: ", TaskdocId);
                
            });
   
        
        }
    }
    catch(error)
    {
      Alert.alert("You failed to update the task.");
      console.log('Fail to update task:', error);
    }
};

return (
    <SafeAreaView style={styles.SafeAreaView}>
    <View style={styles.container}>
        <View style={styles.textcon}>
          <ScrollView contentContainerStyle={{paddingBottom: 200}} >
            <TextInput style={styles.textinput}  defaultValue ={task} onChangeText={(value)=> setTask(value)} />
              {
              showSubTask ? <TextInput style={styles.textinput} placeholder='Add sub task' defaultValue ={subtask} onChangeText={(value)=> setSubTask(value)} />: null
              }
            <View style={{top: '5%'}}>
            <View style={styles.imgicons}>
              <View>
                <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                <Image style={styles.image} source={require("../assets/images/calendarpicker.png")}/>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity onPress={toggleSubTask}>
                <Image style={styles.image} source={require("../assets/images/subtaskicon.png")}/>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity onPress={togglePriority}>
                <Image style={styles.image} source={require("../assets/images/priority.png")}/>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity onPress={toggleNotes}>
                <Image style={styles.image} source={require("../assets/images/notesicon.png")}/>
                </TouchableOpacity>
              </View>
            </View>
  
            <View style={{marginBottom: 10}}>
            {
              showPriority ? 
              <View> 
                <Text style={styles.txt}>Priority:</Text>
                <View>
                <RNPickerSelect placeholder={Priorityplaceholder} value={PriorityValue} items={Priorityoptions} style={styles} useNativeAndroidPickerStyle={false}
                onValueChange={(value)=>setPriorityValue(value)}
                  /> 
                </View> 
              </View>
              : null
            }
          
            </View>
            <Text style={styles.txt}>Assign to:</Text>
            <View >
              <RNPickerSelect 
              placeholder={placeholder}
                items={Membersoptions} 
                onValueChange={(value)=>setAssignValue(value)}
                value={assignValue}
                style={styles}
              useNativeAndroidPickerStyle={false}
                /> 
            </View>
            </View>
            <View>
              <Modal  animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}>
                <View style={styles.CalendarmodalView}>
                <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                <Image style={{left:"90%", width: 20, height: 20, resizeMode: "contain"}} source={require('../assets/images/closeicon.png')}/>
              </TouchableOpacity>
              <DateTimePicker
                mode="single"
                date={date}
                timePicker={timePicker}
                onChange={(params) => setDate(params.date)}
              />
              
              
              </View>
        
              </Modal>
              </View>
              {
                showNotes ? 
                <TextInput style={styles.Notestextinput} multiline={true} numberOfLines={5} placeholder='Add notes' defaultValue ={notes} onChangeText={(value)=> setNotes(value)} /> 
                :null
              }
              <View style={styles.Taskbuttoncontainer}>
                <TouchableOpacity  style={styles.Taskbutton}>
                  <Text style={styles.TaskbuttonText} onPress={UpdateProjectTask}>Save</Text>
                </TouchableOpacity>
                </View>
          </ScrollView>
        
        </View>
      </View> 
  </SafeAreaView>
    
  );
}