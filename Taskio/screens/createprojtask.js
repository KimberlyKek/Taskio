import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, SafeAreaView, TouchableOpacity, TextInput, Alert, ScrollView,Modal} from 'react-native';
import React, {useEffect, useState} from 'react';
import RNPickerSelect from 'react-native-picker-select';
import {app} from "../firebaseConfig.js"
import { addDoc,getDocs, collection,getFirestore,query, where, push,doc} from 'firebase/firestore';
import {useRoute } from '@react-navigation/native';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import styles from '../css/homecss.js'

//Create task function
export default function CreateProjectTaskScreen() {

  //Get the project DocId and team DocId from the projecttasks.js
  const route = useRoute();
  const ProjectdocId = route.params?.ProjectdocId;
  const TeamDocId = route.params?.TeamDocId;

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
  const [date, setDate] = useState(dayjs());
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


  //convert members object elements to array
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
        //save the members details to the array
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

 
  //allow user to create project task to the firebase collection
  const addProjectTask = async () => {
    try{
      const db = getFirestore(app);
      //Project Tasks collection from the firebase
      const ProjectTaskCollection = doc(db, 'Project Tasks', TeamDocId);
      //Project Tasks sub collections based on the team's DocId
      const ProjectTaskTodayCollection = collection(ProjectTaskCollection, 'Today');
      const ProjectTaskUpcomingCollection = collection(ProjectTaskCollection, 'Upcoming');
      const ProjectTaskPastCollection = collection(ProjectTaskCollection, 'Past');

      //Create reference id as DocId for each sub collection
      const TodayRef = doc(ProjectTaskTodayCollection);
      const Todayid = TodayRef.id;
      const UpcomigRef = doc(ProjectTaskUpcomingCollection);
      const Upcomingid = UpcomigRef.id;
      const PastRef = doc(ProjectTaskPastCollection);
      const Pastid = PastRef.id;

      //get today's date
      const today = new Date();
      //change today's date format to yyyy-mm-dd to match with the firebase timestamp
      const todayDate = today.getFullYear()+'-'+('0'+(today.getMonth()+1)).slice(-2)+'-'+('0'+(today.getDate())).slice(-2);

      //Display message if the title field is empty
      if (!task.trim())
        {
          Alert.alert("Task name must not be blank!")
        }
      //add the task details to the sub collection, depends on the date the user has chosen
      else {
        //if the date chosen is later than today, save the task details to Upcoming sub collection
        if(Date.parse(todayDate)<Date.parse(deadline.getFullYear()+'-'+('0'+(deadline.getMonth()+1)).slice(-2)+'-'+('0'+(deadline.getDate())).slice(-2)))
        {
          const TaskRef = await addDoc(ProjectTaskUpcomingCollection, {DocId: Upcomingid, ProjectDocId: ProjectdocId, Title: task, subTask: subtask, 
           Priority: PriorityValue, Notes: notes, Deadline: deadline, AssignTo: assignValue,
            MarkasDone: false, DisplayDate: 'Upcoming'});
          
            Alert.alert("Task created.");
            console.log("Task added: ", TaskRef.id);
          
        }
        //if the date is earlier than today, save the task details to Past sub collection
        else if (Date.parse(todayDate)>Date.parse(deadline.getFullYear()+'-'+('0'+(deadline.getMonth()+1)).slice(-2)+'-'+('0'+(deadline.getDate())).slice(-2)))
          {
            const TaskRef = await addDoc(ProjectTaskPastCollection, {DocId: Pastid,  ProjectDocId: ProjectdocId, Title: task, subTask: subtask, 
              Priority: PriorityValue, Notes: notes, Deadline: deadline , AssignTo: assignValue,
              MarkasDone: false,DisplayDate: 'Past'});
              
            Alert.alert("Task created.");
            console.log("Task added: ", TaskRef.id);
          } 
        //if the date is today, save the task details to Today sub collection
        else 
        {
          const TaskRef = await addDoc(ProjectTaskTodayCollection, {DocId: Todayid , ProjectDocId: ProjectdocId, Title: task, subTask: subtask, 
            Priority: PriorityValue, Notes: notes, Deadline: deadline , AssignTo: assignValue,
            MarkasDone: false, DisplayDate: 'Today'});
            
          Alert.alert("Task created.");
          console.log("Task added: ", TaskRef.id);
        }
       
      }
    }
    catch (error)
    {
        console.log("Failed to add task: ", error);
    }
  };

  return (
    <SafeAreaView style={styles.SafeAreaView}>
      <View style={styles.container}>
        <View style={styles.textcon}>
          <View style={styles.textsubcon}>
            <Text style={styles.TextContainer}>Create New Task</Text>
          </View>
        
          <ScrollView contentContainerStyle={{paddingBottom: 200}} >
            <TextInput style={styles.textinput} placeholder='New Task' value ={task} onChangeText={(value)=> setTask(value)}/>
              {
                showSubTask ? <TextInput style={styles.textinput} placeholder='New Sub Task' value ={subtask} onChangeText={(value)=> setSubTask(value)} />: null
              }
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

            <View style={{}}>
              {
                showPriority ? <RNPickerSelect placeholder={Priorityplaceholder} items={Priorityoptions} style={styles} useNativeAndroidPickerStyle={false}
              onValueChange={(value)=>setPriorityValue(value)}
                value={PriorityValue}/> : null
              }
            </View>
        
            <View>
              <RNPickerSelect 
                placeholder={placeholder} 
                items={Membersoptions} 
                onValueChange={(value)=>setAssignValue(value)}
                value={assignValue}
                style={styles}
              useNativeAndroidPickerStyle={false}
                /> 
            </View>

            <View>
              <Modal animationType="slide"
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
          <TextInput style={styles.Notestextinput} multiline={true} numberOfLines={5} placeholder='Add notes' value ={notes} onChangeText={(value)=> setNotes(value)} /> 
          :null
        }
        
        <View style={styles.Taskbuttoncontainer}>
        <TouchableOpacity  style={styles.Taskbutton}>
          <Text style={styles.TaskbuttonText} onPress={addProjectTask}>Create</Text>
        </TouchableOpacity>
        </View>
        </ScrollView>
        </View>
      </View>
    </SafeAreaView>
    
  );

}