import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, SafeAreaView, TouchableOpacity, TextInput, Alert, ScrollView,Modal} from 'react-native';
import React, {useEffect, useState} from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { getAuth} from 'firebase/auth';
import {app} from "../firebaseConfig.js"
import styles from '../css/homecss.js'
import { addDoc,getDocs, collection,getFirestore,query, where,doc} from 'firebase/firestore';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';

//Create task function
export default function CreateTaskScreen() {

  //retrieves the authentication state
  const auth = getAuth();
  //get the current user authentication state
  const user = auth.currentUser;

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
  const [category, setCategory] = useState([]);
  const [priority, setPriority] = useState([]);
  const [date, setDate] = useState(dayjs());
  const [timePicker, setTimePicker] = useState(true);
  //convert date value to Date data type
  const deadline = new Date(Date.parse(date));
  const [reminder, setReminder] = useState([]);

  const [categoryValue, setCategoryValue] = useState('');
  const [PriorityValue, setPriorityValue] = useState('');
  const [ReminderValue, setReminderValue] = useState('');

  //visibility setting for modal
  const [modalVisible, setModalVisible] = useState(false);

  //placeholders for options pickers
  const placeholder = {
    label: 'Select category...',
    value: null,
  };

  const Priorityplaceholder = {
    label: 'Select priority...',
    value: null,
  };

  const Reminderplaceholder = {
    label: 'Select reminder type...',
    value: null
  };

  //save category values to array
  const Categoryoptions = [];
  category.forEach((item)=> {
    Categoryoptions.push({
      label:item.Category,
      value: item.Category
  });
  });

  //save priority values to array
  const Priorityoptions = [];
  priority.forEach((item)=>{
    Priorityoptions.push({
      label: item.Priority,
      value: item.Priority
    });
  });

  //save reminder values to array
  const Reminderoptions = [];
  reminder.forEach((item)=> {
    Reminderoptions.push({
      label: item.Reminder,
      value: item.Reminder
    });
  });
  
  useEffect(()=>{
    getCategory();
    getPriority();
    getReminder();
  },[]);

  //get category data from Category collection in firebase
  const getCategory = async () => {
    try{
      const db = getFirestore(app);
      //Category main collection from firebase db
      const CategoryCollection = doc(db, 'Category', user.uid);
      //Category sub collection based on the user's id
      const CategorySubCollection = collection(CategoryCollection, 'Category')

      //get the category details from the sub collection
      const CategorySnapShot = await getDocs(CategorySubCollection);
      const Category = []
      //save the category details to Category array
      CategorySnapShot.forEach((doc) => {
        const {Category_Title} = doc.data()
        Category.push({
          Category: Category_Title
      });
      });

      //save the category elements from the array to setCategory state
      setCategory(Category);

    }
    catch(error)
    {
      console.log('Fail to get the category details: ', error);
    }
    
  };

  //get priority data from Priority collection in firebase
  const getPriority = async () => {
    
    try{
      const db = getFirestore(app);
      //Priority collection
      const PriorityCollection = collection(db, 'Priority');
  
      //get the priority details from the collection
      const PrioritySnapShot = await getDocs(PriorityCollection);
      const Priority = []
      //save the priority details to Priority array
      PrioritySnapShot.forEach((doc) => {
        const {Priority_Lv} = doc.data()
        Priority.push({
          Priority: Priority_Lv
      });
      });
      //save the priority elements from array to setPriority state
      setPriority(Priority);

    }
    catch(error)
    {
      console.log('Fail to get the priority details: ', error);
    }

  };

  //get reminder data from Reminder collection in firebase
  const getReminder = async () => {

    try{
      const db = getFirestore(app);
      //Reminder collection from firebase db
      const ReminderCollection = collection(db, 'Reminder Types');
  
      //Get the reminder details from the collection
      const ReminderSnapShot = await getDocs(ReminderCollection);
      const Reminder = [];

      //save the reminder details to array
      ReminderSnapShot.forEach((doc) => {
        const {Reminder_Type} = doc.data()
        Reminder.push({
          Reminder:Reminder_Type
      });
      });
      //save the reminder details from array to setReminder state
      setReminder(Reminder)
  
    }
    catch(error)
    {
      console.log('Fail to get the reminder details: ', error);
    }

  };

  //allow user to create task to the firebase collection
  const addTask = async () => {
    try{
      const db = getFirestore(app);
      //Tasks main collection from the firebase
      const TaskCollection = doc(db, 'Tasks', user.uid);
      //Tasks sub collections based on the user's id
      const TaskTodayCollection = collection(TaskCollection, 'Today');
      const TaskUpcomingCollection = collection(TaskCollection, 'Upcoming');
      const TaskPastCollection = collection(TaskCollection, 'Past');

      //Create reference id as DocId
      const TodayRef = doc(TaskTodayCollection)
      const Todayid = TodayRef.id
      const UpcomigRef = doc(TaskUpcomingCollection)
      const Upcomingid = UpcomigRef.id
      const PastRef = doc(TaskPastCollection)
      const Pastid = PastRef.id
      //get today's date
      const today = new Date();
      //change today's date format to yyyy-mm-dd to match with the firebase timestamp
      const todayDate = today.getFullYear()+'-'+('0'+(today.getMonth()+1)).slice(-2)+'-'+('0'+(today.getDate())).slice(-2);

      //Display message if the title field is empty
      if (!task.trim())
        {
          Alert.alert("Error","Task name must not be blank!")
        }
      //add the task details to the collection
      else {
        //if the date user has key in is later than today, set the DisplayDate field as 'Upcoming' and save the task details to Upcoming sub collection 
        if(Date.parse(todayDate)<Date.parse(deadline.getFullYear()+'-'+('0'+(deadline.getMonth()+1)).slice(-2)+'-'+('0'+(deadline.getDate())).slice(-2)))
        {
          const TaskRef = await addDoc(TaskUpcomingCollection, {DocId: Upcomingid,Title: task, subTask: subtask, 
            Category: categoryValue, Priority: PriorityValue, Notes: notes, Deadline: deadline , Reminder: ReminderValue, 
            MarkasDone: false, DisplayDate: 'Upcoming'});
          
            Alert.alert("You have created a task sucessfully.");
            console.log("Task added: ", TaskRef.id);
          
        }
        //if the date user has key in is eariler than today, set the DisplayDate field as 'Past' and save the task details to Past sub collection
        else if (Date.parse(todayDate)>Date.parse(deadline.getFullYear()+'-'+('0'+(deadline.getMonth()+1)).slice(-2)+'-'+('0'+(deadline.getDate())).slice(-2)))
          {
            const TaskRef = await addDoc(TaskPastCollection, {DocId: Pastid,Title: task, subTask: subtask, 
              Category: categoryValue, Priority: PriorityValue, Notes: notes, Deadline: deadline , Reminder: ReminderValue, 
              MarkasDone: false,DisplayDate: 'Past'});
              
            Alert.alert("You have created a task sucessfully.");
            console.log("Task added: ", TaskRef.id);
          } 
        //if the date user has key in is today, set the DisplayDate field as 'Today' and save the task details to Today sub collection
        else 
        {
          const TaskRef = await addDoc(TaskTodayCollection, {DocId: Todayid ,Title: task, subTask: subtask, 
            Category: categoryValue, Priority: PriorityValue, Notes: notes, Deadline: deadline , Reminder: ReminderValue, 
            MarkasDone: false, DisplayDate: 'Today'});
            
          Alert.alert("You have created a task sucessfully.");
          console.log("Task added: ", TaskRef.id);
        }
       
      }
    }
    catch (error)
    {
        Alert.alert("Error","You fail to create a task.");
        console.log("Failed to add task: ", error);
    }
  };

  return (
    <SafeAreaView style={styles.SafeAreaView}>
      <View style={styles.container}>
        <View style={styles.textcon}>
          <Text style={styles.TextContainer}>Create New Task</Text>
         
          <ScrollView contentContainerStyle={{paddingBottom: 200}} >
            <TextInput style={styles.textinput} placeholder='New Task' value ={task} onChangeText={(value)=> setTask(value)}/>
              {
                //show or hide sub task field
                showSubTask ? <TextInput style={styles.textinput} placeholder='New Sub Task' value ={subtask} onChangeText={(value)=> setSubTask(value)} />: null
              }
            <View style={styles.imgicons}>
              <View>
                <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                <Image style={styles.image} source={require("../assets/images/calendarpicker.png")}/>
                </TouchableOpacity>
              </View>
              <View>
              <TouchableOpacity onPress={toggleSubTask} testID='toggle-subtask'>
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

            <View>
              {
                //show or hide priority field
                showPriority ? <RNPickerSelect placeholder={Priorityplaceholder} items={Priorityoptions} style={styles} useNativeAndroidPickerStyle={false}
              onValueChange={(value)=>setPriorityValue(value)}
                value={PriorityValue}/> : null
              }
            </View>
        
            <View>
              <RNPickerSelect 
                placeholder={placeholder} 
                items={Categoryoptions} 
                onValueChange={(value)=>setCategoryValue(value)}
                value={categoryValue}
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

              <View style={styles.remindercon}> 
              <Text style={styles.remindertxt}>Reminder Type: </Text>
              <RNPickerSelect placeholder={Reminderplaceholder} items={Reminderoptions} onValueChange={(value)=>setReminderValue(value)}
                value={ReminderValue} style={{inputAndroid: {
                left:10,
                fontSize: 15,
                paddingHorizontal: 10,
                paddingVertical: 8,
                paddingRight: 10, // to ensure the text is never behind the icon
              },
              inputIOS: {
                left:5,
                fontSize: 15,
                paddingHorizontal: 10,
                paddingVertical: 8,
                paddingRight: 10,
              }}} useNativeAndroidPickerStyle={false}/> 
            </View>
            </View>
              </Modal>
        </View>
        {
          //show or hide notes field
          showNotes ? 
          <TextInput style={styles.Notestextinput} multiline={true} numberOfLines={5} placeholder='Add notes' value ={notes} onChangeText={(value)=> setNotes(value)} /> 
          :null
        }
        
        <View style={styles.Taskbuttoncontainer}>
        <TouchableOpacity  style={styles.Taskbutton}>
          <Text style={styles.TaskbuttonText} onPress={addTask}>Create</Text>
        </TouchableOpacity>
        </View>
        </ScrollView>
        </View>
      </View>
    </SafeAreaView>
    
  );

}