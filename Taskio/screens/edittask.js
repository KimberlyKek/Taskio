import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, SafeAreaView,TouchableOpacity, TextInput, Alert,Modal,ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { getAuth} from 'firebase/auth';
import {app} from "../firebaseConfig.js"
import DateTimePicker from 'react-native-ui-datepicker';
import styles from '../css/EditTaskCss.js'
import { getDocs, collection,getFirestore,query, where, push,updateDoc, doc,get} from 'firebase/firestore';
import {useRoute } from '@react-navigation/native';

//Edit task function
export default function EditTaskScreen() {
  //get the DocId from TaskScreen function in home.js
  const route = useRoute();
  const docId = route.params?.DocId;

  //retrieves the authentication state
  const auth = getAuth();
  //get the current user authentication state
  const user = auth.currentUser;

  //show or hide sub task field
  const [showSubTask, setShowSubTask] = useState(false);
  const toggleSubTask = () => setShowSubTask(showSubTask => !showSubTask);

  //show or hide priority field
  const [showPriority, setShowPriority] = useState(false);
  const togglePriority = () => setShowPriority(showPriority => !showPriority);

  //show or hide notes field
  const [showNotes, setShowNotes] = useState(false);
  const toggleNotes = () => setShowNotes(showNotes => !showNotes);


  const [task, setTask] = useState([]);
  const [title, setTitle] = useState('');
  const [subtask, setSubTask] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState([]);
  const [priority, setPriority] = useState([]);

  const [timePicker, setTimePicker] = useState(true);
  const [reminder, setReminder] = useState([]);
  const [date, setDate] = useState('');
  //Convert date value to Date datatype
  const deadline = new Date(Date.parse(date));

  const [categoryValue, setCategoryValue] = useState('');
  const [PriorityValue, setPriorityValue] = useState('');
  const [ReminderValue, setReminderValue] = useState('');

  //Visibility setting for modal
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

  //convert category object variables to array
  const Categoryoptions = [];
  category.forEach((item)=> {
    Categoryoptions.push({
      label:item.Category,
      value: item.Category
  });
  });

  //convert priority object variables to array
  const Priorityoptions = [];
  priority.forEach((item)=>{
    Priorityoptions.push({
      label: item.Priority,
      value: item.Priority
    });
  });

  //convert reminder object variables to array
  const Reminderoptions = [];
  reminder.forEach((item)=> {
    Reminderoptions.push({
      label: item.Reminder,
      value: item.Reminder
    });
  });
  
  useEffect(()=>{
    getTask();
    getCategory();
    getPriority();
    getReminder();
  },[]);

  //get category data from Category collection in firebase
  const getCategory = async () => {
    
    const db = getFirestore(app);
      //Category collection from firebase db
      const CategoryCollection = doc(db, 'Category', user.uid);
      const CategorySubCollection = collection(CategoryCollection, 'Category')

      //get the category details based on the user id
     // const CategoryQuery = query(CategoryCollection, where('UserId', '==', user.uid));
      const CategorySnapShot = await getDocs(CategorySubCollection);
      const Category = [];
      //save the category details to Category array
      CategorySnapShot.forEach((doc) => {
      const {Category_Title, DocId} = doc.data();
      Category.push({
          Category: Category_Title,
          DocId: DocId
      });
      });
    setCategory(Category);

  };

  //get priority data from Priority collection in firebase
  const getPriority = async () => {
    
    const db = getFirestore(app);
    //Priority collection
    const PriorityCollection = collection(db, 'Priority');

    const PrioritySnapShot = await getDocs(PriorityCollection);
    const Priority = [];
    //save the data to Priority array
    PrioritySnapShot.forEach((doc) => {
      const {Priority_Lv} = doc.data()
      Priority.push({
        Priority: Priority_Lv
    });
    });
    setPriority(Priority);

  };

  //get reminder data from Reminder collection in firebase
  const getReminder = async () => {
    
    const db = getFirestore(app);
    //Reminder Types collection
    const ReminderCollection = collection(db, 'Reminder Types');

    const ReminderSnapShot = await getDocs(ReminderCollection);
    const Reminder = [];
    //save the data to Reminder array
    ReminderSnapShot.forEach((doc) => {
      const {Reminder_Type} = doc.data()
      Reminder.push({
        Reminder:Reminder_Type
    });
    });
    setReminder(Reminder);

  };

  // get the task list from firebase database based on the DocId
  const getTask = async () => {

    const db = getFirestore(app);
    const TaskCollection = doc(db, 'Tasks', user.uid);
    const TaskTodayCollection = collection(TaskCollection, 'Today')
    const TaskUpcomingCollection = collection(TaskCollection, 'Upcoming')
    const TaskPastCollection = collection(TaskCollection, 'Past') 

    const TaskTodayQuery = query(TaskTodayCollection, where('DocId', '==', docId));
    const TaskTodaySnapShot = await getDocs(TaskTodayQuery);
    const TodayTask = [];

    const TaskUpcomingQuery = query(TaskUpcomingCollection, where('DocId', '==', docId));
    const TaskUpcomingSnapShot = await getDocs(TaskUpcomingQuery);
    const UpcomingTask = [];


    const TaskPastQuery = query(TaskPastCollection, where('DocId', '==', docId));
    const TaskPastSnapShot = await getDocs(TaskPastQuery);
    const PastTask = [];

    //save the task details to Task array
    TaskTodaySnapShot.forEach((doc) => {
      const {Title, Category, MarkasDone, Notes, Priority, Reminder, subTask, Deadline, DocId} = doc.data();
      //convert Deadline value from object to Date
      const deadline = new Date(Date.parse(Deadline.toDate()))
      TodayTask.push({
        DocId: DocId,
        Title: Title,
        Category: Category,
        subTask: subTask,
        Date: deadline,
        Priority: Priority,
        Notes: Notes,
        Reminder: Reminder,
        MarkasDone: MarkasDone
       
    });
   
    });

    //save the task details to Task array
    TaskUpcomingSnapShot.forEach((doc) => {
      const {Title, Category, MarkasDone, Notes, Priority, Reminder, subTask, Deadline, DocId} = doc.data();
      //convert Deadline value from object to Date
      const deadline = new Date(Date.parse(Deadline.toDate()))
      UpcomingTask.push({
        DocId: DocId,
        Title: Title,
        Category: Category,
        subTask: subTask,
        Date: deadline,
        Priority: Priority,
        Notes: Notes,
        Reminder: Reminder,
        MarkasDone: MarkasDone
       
    });
   
    });

    //save the task details to Task array
    TaskPastSnapShot.forEach((doc) => {
      const {Title, Category, MarkasDone, Notes, Priority, Reminder, subTask, Deadline, DocId} = doc.data();
      //convert Deadline value from object to Date
      const deadline = new Date(Date.parse(Deadline.toDate()))
      PastTask.push({
        DocId: DocId,
        Title: Title,
        Category: Category,
        subTask: subTask,
        Date: deadline,
        Priority: Priority,
        Notes: Notes,
        Reminder: Reminder,
        MarkasDone: MarkasDone
       
    });
   
    });

    const AllTasks = [...TodayTask, ...PastTask, ...UpcomingTask];
    //save the task details from Task array to each of the state respectively
    setTask(AllTasks);
    setTitle(AllTasks[0].Title);
    setSubTask(AllTasks[0].subTask);
    setPriorityValue(AllTasks[0].Priority);
    setCategoryValue(AllTasks[0].Category);
    setNotes(AllTasks[0].Notes);
    setReminderValue(AllTasks[0].Reminder);
    setDate(AllTasks[0].Date);
   
   
  };

  // update the task details in Tasks collection in firebase
  const updateTask = async () => {
    try{
      //display message if title field is empty
      if (!title.trim())
        {
          Alert.alert("Error","Task name must not be blank!");
        }
      else {
        const db = getFirestore(app);
        //Task collection from firebase db
        const TaskCollection = doc(db, 'Tasks', user.uid);
        const TaskTodayCollection = collection(TaskCollection, 'Today');
        const TaskUpcomingCollection = collection(TaskCollection, 'Upcoming');
        const TaskPastCollection = collection(TaskCollection, 'Past');
        //get today's date
        const today = new Date();
        //change today's date format to yyyy-mm-dd to match with the firebase timestamp
        const todayDate = today.getFullYear()+'-'+('0'+(today.getMonth()+1)).slice(-2)+'-'+('0'+(today.getDate())).slice(-2);
        //get the task details based on DocId
        const TaskTodayQuery = query(TaskTodayCollection, where('DocId', '==', docId));
        const TaskTodaySnapShot = await getDocs(TaskTodayQuery);

        const TaskUpcomingQuery = query(TaskUpcomingCollection, where('DocId', '==', docId));
        const TaskUpcomingSnapShot = await getDocs(TaskUpcomingQuery);

        const TaskPastQuery = query(TaskPastCollection, where('DocId', '==', docId));
        const TaskPastSnapShot = await getDocs(TaskPastQuery);


        //update the task details
        TaskTodaySnapShot.forEach((doc)=>{
          updateDoc(doc.ref,{Title: title, subTask: subtask, Priority: PriorityValue, Category: categoryValue, Deadline: deadline, Notes: notes, Reminder: ReminderValue, 
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

            Alert.alert("You have updated the task.");
            console.log("Task updated: ", docId);
            
        });

         //update the task details
         TaskUpcomingSnapShot.forEach((doc)=>{
          updateDoc(doc.ref,{Title: title, subTask: subtask, Priority: PriorityValue, Category: categoryValue, Deadline: deadline, Notes: notes, Reminder: ReminderValue, 
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

            Alert.alert("You have updated the task.");
            console.log("Task updated: ", docId);
            
        });

         //update the task details
         TaskPastSnapShot.forEach((doc)=>{
          updateDoc(doc.ref,{Title: title, subTask: subtask, Priority: PriorityValue, Category: categoryValue, Deadline: deadline, Notes: notes, Reminder: ReminderValue, 
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

            Alert.alert("You have updated the task.");
            console.log("Task updated: ", docId);
            
        });
      
      }
   }
   catch (error)
   {
    Alert.alert("Error","You fail to update the task.");
    console.log("Failed to update task: ", error);
   }
 };

    return(
      <SafeAreaView style={styles.SafeAreaView}>
          <View style={styles.container}>
              <View style={styles.textcon}>
                <ScrollView contentContainerStyle={{paddingBottom: 200}} >
                  <TextInput style={styles.textinput} testID='addTaskTitle' defaultValue ={title} onChangeText={(value)=> setTitle(value)} />
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
                      <TouchableOpacity testID='toggle-subtask' onPress={toggleSubTask}>
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
                  <Text style={styles.txt}>Category:</Text>
                  <View >
                    <RNPickerSelect 
                    placeholder={placeholder}
                      items={Categoryoptions} 
                      onValueChange={(value)=>setCategoryValue(value)}
                      value={categoryValue}
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
                    
                    <Text style={styles.remindertxt}>Reminder Type: </Text>
                    <View>
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
                      showNotes ? 
                      <TextInput style={styles.Notestextinput} multiline={true} numberOfLines={5} placeholder='Add notes' defaultValue ={notes} onChangeText={(value)=> setNotes(value)} /> 
                      :null
                    }
                    <View style={styles.Taskbuttoncontainer}>
                      <TouchableOpacity  style={styles.Taskbutton}>
                        <Text style={styles.TaskbuttonText} testID='SaveBtn' onPress={updateTask}>Save</Text>
                      </TouchableOpacity>
                      </View>
                </ScrollView>
              
              </View>
            </View> 
        </SafeAreaView>
    )
}
