import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, SafeAreaView, TouchableOpacity, TextInput, Alert,Modal, FlatList,ScrollView, RefreshControl} from 'react-native';
import { Separator } from 'react-native-tableview-simple';
import React, {useEffect, useState, useMemo} from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {Menu, MenuProvider, MenuOptions, MenuOption,MenuTrigger} from 'react-native-popup-menu';
import { getAuth, signOut} from 'firebase/auth';
import { addDoc,getDocs, collection,getFirestore,query, where, push, doc, deleteDoc,updateDoc} from 'firebase/firestore';
import {app} from "../firebaseConfig.js"
import { Calendar} from 'react-native-calendars';
import { LineChart } from 'react-native-chart-kit';
import filter from 'lodash.filter';
import styles from '../css/homecss.js';
import * as Notifications from "expo-notifications";


const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Show notifications when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }
  },
});

//Notification permission for ios
Notifications.requestPermissionsAsync({
  ios: {
    allowAlert: true,
    allowBadge: true,
    allowSound: true
  }
})


// Task screen function, displaying task list, category list etc in home screen
export function TaskScreen({navigation}) {

  //retrieves the authentication state
  const auth = getAuth();
  //get the current user authentication state
  const user = auth.currentUser;

  useEffect(()=>{
    getTask();
    getCategory();
  },[]);

  useEffect(() => {
    scheduleNotifications();
  },[filteredListCat])


  //For setting visibliablity on the modal
  const [modalVisible, setModalVisible] = useState(false);
  //For refresh data
  const [refreshing, setRefreshing] = useState(false);
  
  
  //For getting all the task details from firebase
  const [taskinfo, settaskinfo] = useState([]);
  //For adding category to the firebase
  const [category, setCategory] = useState('');
  //For getting all the category details from firebase
  const [categoryinfo, setCategoryInfo] = useState([]);
  //For displaying the task list based on category
  const [catergoryfilter, setCategoryFilter] = useState('None');

  //For search task
  const [searchedData, setSearchedData] = useState([]);
  const [searchquery, setSearchQuery] = useState('');

  //DocId value for delete task
  const [DeleteDocId, setDeleteDocId] = useState('');
  //DocId value for mark task as done
  const [DoneDocId, setDoneDocId] = useState('');

  //For active category buttons on the category list
  const [CatBtnActive, setCatBtnActive] = useState(null);


  // get all the tasks from firebase database based on the user id
  const getTask = async () => {

    try{

      const db = getFirestore(app);
      // Task main collection from firebase db
      const TaskCollection = doc(db, 'Tasks', user.uid);
      // Task sub collections based on the user's id
      const TaskTodayCollection = collection(TaskCollection, 'Today')
      const TaskUpcomingCollection = collection(TaskCollection, 'Upcoming')
      const TaskPastCollection = collection(TaskCollection, 'Past') 

      //Get all the documents from Today sub collection
      const TaskTodaySnapShot = await getDocs(TaskTodayCollection);
      const TodayTask = [];

      //Get all the documents from Upcoming sub collection
      const TaskUpcomingSnapShot = await getDocs(TaskUpcomingCollection);
      const UpcomingTask = [];

      //Get all the documents from Past sub collection
      const TaskPastSnapShot = await getDocs(TaskPastCollection);
      const PastTask = [];


      //Save all the documents from Today sub collection to TodayTask array
      TaskTodaySnapShot.forEach((doc) => {
        const {Title, Category, DocId, DisplayDate, MarkasDone, Deadline, Reminder, Priority} = doc.data();

        //Below are the codes to separate the date and the time values from the Deadline field. 

        //The Deadline value is first converted from object to date datatype
        const deadline = new Date(Date.parse(Deadline.toDate()));

        //Change the date format to yyyy-mm-dd to match with the react native calendar date value, and then save it to date constant
        const date = deadline.getFullYear()+'-'+('0'+(deadline.getMonth()+1)).slice(-2)+'-'+('0'+(deadline.getDate())).slice(-2); 

        //Options is used to change the time to 24hrs format and show 2 digits for both hour and minute. Default format was 12hrs with hours, minutes and seconds
        const options = {hour12: false, hour: '2-digit', minute: '2-digit'};

        //Convert the time to local time string with the options, and then save it to time constant
        const time = deadline.toLocaleTimeString('en-US',options);

        //Save the details to the array
        TodayTask.push({
          Title: Title,
          Category: Category,
          DocId: DocId,
          MarkasDone: MarkasDone,
          Date: date,
          Time: time,
          Priority: Priority,
          Reminder: Reminder,
          DisplayDate: DisplayDate
        
      });
      });

    //Save the documents from Upcoming sub collection to UpcomingTask array
    TaskUpcomingSnapShot.forEach((doc) => {
      const {Title, Category, DocId, DisplayDate, MarkasDone,Deadline, Reminder,Priority} = doc.data();

      //Below are the codes to separate the date and the time values from the Deadline field. 

      //The Deadline value is first converted from object to date datatype
      const deadline = new Date(Date.parse(Deadline.toDate()));

      //Change the date format to yyyy-mm-dd to match with the react native calendar date value, and then save it to date constant
      const date = deadline.getFullYear()+'-'+('0'+(deadline.getMonth()+1)).slice(-2)+'-'+('0'+(deadline.getDate())).slice(-2); 

      //Options is used to change the time to 24hrs format and show 2 digits for both hour and minute. Default format was 12hrs with hours, minutes and seconds
      const options = {hour12: false, hour: '2-digit', minute: '2-digit'};

      //Convert the time to local time string with the options, and then save it to time constant
      const time = deadline.toLocaleTimeString('en-US',options);

      //Save the details to array
      UpcomingTask.push({
        Title: Title,
        Category: Category,
        DocId: DocId,
        MarkasDone: MarkasDone,
        Date: date,
        Time: time,
        Priority: Priority,
        Reminder: Reminder,
        DisplayDate: DisplayDate
  
    });
    });

    //Save all the documents from Past sub collection to PastTask array
    TaskPastSnapShot.forEach((doc) => {
      const {Title, Category, DocId, DisplayDate,MarkasDone,Deadline, Reminder, Priority} = doc.data();

      //Below are the codes to separate the date and the time values from the Deadline field. 

      //The Deadline value is first converted from object to date datatype
      const deadline = new Date(Date.parse(Deadline.toDate()));

      //Change the date format to yyyy-mm-dd to match with the react native calendar date value, and then save it to date constant
      const date = deadline.getFullYear()+'-'+('0'+(deadline.getMonth()+1)).slice(-2)+'-'+('0'+(deadline.getDate())).slice(-2); 

      //Options is used to change the time to 24hrs format and show 2 digits for both hour and minute. Default format was 12hrs with hours, minutes and seconds
      const options = {hour12: false, hour: '2-digit', minute: '2-digit'};

      //Convert the time to local time string with the options, and then save it to time constant
      const time = deadline.toLocaleTimeString('en-US',options)

      //Save the details to the array
      PastTask.push({
        Title: Title,
        Category: Category,
        DocId: DocId,
        MarkasDone: MarkasDone,
        Date: date,
        Time: time,
        Priority: Priority,
        Reminder: Reminder,
        DisplayDate: DisplayDate
       
    });
    });

    //Combine all the three arrays into one
    const AllTasks = [...TodayTask, ...PastTask, ...UpcomingTask];

    //Sort the elements by the order of DisplayDate. Today > Upcoming > Past > Completed
    AllTasks.sort((a,b)=> {
      const orders = {'Today': 0, 'Upcoming': 1, 'Past': 2, 'Completed': 3};
      return orders[a.DisplayDate] - orders[b.DisplayDate];
    })

    //save the elements from Task array to settaskinfo and setSearchedData states
    settaskinfo(AllTasks);
    setSearchedData(AllTasks);

    }
    catch(error)
    {
      console.log('Fail to get all the tasks details: ',error);
    }
  
   
  };

  //delete the task in the firebase collection based on the user's id and task's DocId 
  const deleteTask = async () => {
    try{
        const db = getFirestore(app);
        //Tasks main collection from firebase db
        const TaskCollection = doc(db, 'Tasks', user.uid);
        //Task sub collections
        const TaskTodayCollection = collection(TaskCollection, 'Today');
        const TaskUpcomingCollection = collection(TaskCollection, 'Upcoming');
        const TaskPastCollection = collection(TaskCollection, 'Past');

        //Get the task details from Today sub collection based on the task's docId
        const TaskTodayQuery = query(TaskTodayCollection, where('DocId', '==', DeleteDocId));
        const TaskTodaySnapShot = await getDocs(TaskTodayQuery);
 
        //Get the task details from Upcoming sub collection based on the task's docId
        const TaskUpcomingQuery = query(TaskUpcomingCollection, where('DocId', '==', DeleteDocId));
        const TaskUpcomingSnapShot = await getDocs(TaskUpcomingQuery);
 
        //Get the task details from Past sub collection based on the task's docId
        const TaskPastQuery = query(TaskPastCollection, where('DocId', '==', DeleteDocId));
        const TaskPastSnapShot = await getDocs(TaskPastQuery);

        //If the task is from Today sub collection, delete it
        TaskTodaySnapShot.forEach((doc)=>{
           deleteDoc(doc.ref);
           Alert.alert("You have deleted this task.");
           console.log("Task deleted: ", DeleteDocId);
        });
 
        //If the task is from Upcoming sub collection, delete it
        TaskUpcomingSnapShot.forEach((doc)=>{
          deleteDoc(doc.ref);
          Alert.alert("You have deleted this task");
          console.log("Task deleted: ", DeleteDocId);
        });
 
        //If the task is from Past sub collection, delete it
        TaskPastSnapShot.forEach((doc)=>{
          deleteDoc(doc.ref);
          Alert.alert("You have deleted this task");
          console.log("Task deleted: ", DeleteDocId);
        });
       
    }
    catch (error)
    {
      Alert.alert("Error","You fail to delete the task.");
      console.log("Failed to delete task: ", error);
    }
  };

  //mark the task as done based on the user's id and task's DocId
  const CompleteTask = async () => {
    try{
       const db = getFirestore(app);
       //Tasks main collection from firebase db
       const TaskCollection = doc(db, 'Tasks', user.uid);
       //Task sub collections
       const TaskTodayCollection = collection(TaskCollection, 'Today');
       const TaskUpcomingCollection = collection(TaskCollection, 'Upcoming');
       const TaskPastCollection = collection(TaskCollection, 'Past');

       //Gets the task details from Today sub collection based on the task's DocId
       const TaskTodayQuery = query(TaskTodayCollection, where('DocId', '==', DoneDocId));
       const TaskTodaySnapShot = await getDocs(TaskTodayQuery);

       //Gets the task details from Upcoming sub collection based on the task's DocId
       const TaskUpcomingQuery = query(TaskUpcomingCollection, where('DocId', '==', DoneDocId));
       const TaskUpcomingSnapShot = await getDocs(TaskUpcomingQuery);

       //Gets the task details from Past sub collection based on the task's DocId
       const TaskPastQuery = query(TaskPastCollection, where('DocId', '==', DoneDocId));
       const TaskPastSnapShot = await getDocs(TaskPastQuery);

       //If the task is from Today sub collection, update MarkasDone field to true and DisplayDate field to Completed
       TaskTodaySnapShot.forEach((doc)=>{
          updateDoc(doc.ref,{MarkasDone: true, DisplayDate: 'Completed'});
          Alert.alert("You have marked this task as completed.");
          console.log("Task is mark as done: ", DoneDocId);
       });

      //If the task is from Upcoming sub collection, update MarkasDone field to true and DisplayDate field to Completed
      TaskUpcomingSnapShot.forEach((doc)=>{
        updateDoc(doc.ref,{MarkasDone: true, DisplayDate: 'Completed'});
        Alert.alert("You have marked this task as completed.");
        console.log("Task is mark as done: ", DoneDocId);
     });

      //If the task is from Past sub collection, update MarkasDone field to true and DisplayDate field to Completed
      TaskPastSnapShot.forEach((doc)=>{
        updateDoc(doc.ref,{MarkasDone: true, DisplayDate: 'Completed'});
        Alert.alert("You have marked this task as completed.");
        console.log("Task is mark as done: ", DoneDocId);
    });
       
   }
   catch (error)
   {
      Alert.alert("Error","You fail to mark the task as complete.");
      console.log("Failed to complete task: ", error);
   }
 };

  // add the category details to Category collection in firebase, using user's id
  const addCategory = async () => {
    try{

      //Display message if the name field is empty
      if (!category.trim())
      {
        Alert.alert("Error","Category name must not be blank!");
      }
      else
      {
        const db = getFirestore(app);
        //Category main collection from firebase db
        const CategoryCollection = doc(db, 'Category', user.uid);
        //Category sub collection
        const CategorySubCollection = collection(CategoryCollection, 'Category');

        //Create reference id as DocId
        const Ref = doc(CategorySubCollection);
        const id = Ref.id;
        //Save the category details to the collection
        const CategoryRef = await addDoc(CategorySubCollection, {DocId: id,Category_Title: category});
        Alert.alert("You have created a category successfully.");
        console.log("Category added: ", CategoryRef.id);
      }
        
    }
    catch (error)
    {
      Alert.alert("Error","You fail to create a category.");
      console.log("Failed to add category: ", error);
    }
  }
  
  //get the category details from Category collection based on the user id
  const getCategory = async () => {

    try{
      const db = getFirestore(app);
      //Category main collection from firebase db
      const CategoryCollection = doc(db, 'Category', user.uid);
      //Category sub collection
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
      //save the category details to setCategoryInfo state
      setCategoryInfo(Category);

    }
    catch(error)
    {
      console.log('Fail to get the categories:', error);
    }

  };
//---------------------------------------------------------------------------------------------------------
  //Create TaskItem constant to display the task data
  const TaskItem = ({ Title, DisplayDate, DocId, Date, Time, Priority, index }) => {
    
    //If the task is completed, display the task title as text. User would not be able to press on it
    if (DisplayDate === "Completed")
    {
      return (
        <View key={index}>
           <Text style={styles.TaskItemText}>{DisplayDate}</Text>
            <Text style={styles.TaskItemComplete}>{Title} {'\n'}
            <Text style={styles.TaskItemDate}>{Date} {Time}</Text>
            <Text style={styles.TaskItemPriority}> {Priority}</Text>
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
                <Text style={styles.TaskItemBtn} onPress={()=> navigation.navigate("EditTask", {DocId})}>{Title} {'\n'}
                <Text style={ DisplayDate === 'Past' ? styles.TaskItemPastDate: styles.TaskItemDate}>{Date} {Time}</Text>
                <Text style={ Priority === 'High' ? styles.TaskItemPastDate: styles.TaskItemPriority}> {Priority}</Text>
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
  const renderTaskItem = ({ item }) => (
    <TaskItem Title={item.Title} DisplayDate={item.DisplayDate} Date={item.Date} Time={item.Time} Priority={item.Priority} DocId={item.DocId}/>
  );
  
  // Display all the tasks, including the one with no category in the All section.
  //Else display the task list based on the category when the user presses the category buttons.
  const filteredListCat = useMemo(()=>{
    if (catergoryfilter === 'None') 
      {
         return taskinfo
      }
     
    return taskinfo.filter(item => catergoryfilter == item.Category)
  }, [catergoryfilter, taskinfo])

  //save the category value into setCategoryFilter and setCatBtnActive states
  const CatClick = (catergoryfilter) => () => {
    setCategoryFilter(catergoryfilter);
    setCatBtnActive(catergoryfilter);
  }

  //Display message if no task or no task created to the specific category
  const emptyTaskinfo = (index) =>
    {
      if (catergoryfilter === 'None' )
      return(
        <View style={styles.container}>
          <View>
            <Text key={index} style={styles.titleStyle}>You have no task right now.</Text>
          </View>
        </View>
      )
      return(
        <View style={styles.container}>
          <View>
            <Text key={index} style={styles.titleStyle}>You have not added a task to this category.</Text>
          </View>
        </View>
      )
    }
//--------------------------------------------------------------------------------------------------------
  //filter the task data when search
  const handleSearch = text => {
    const formattedQuery = text;
    const filteredData = filter(searchedData, user => {
      return contains(user, formattedQuery);
    });
    settaskinfo(filteredData);
    setSearchQuery(text);
  };
  
  //allow the user to search the data through Title
  const contains = ({ Title }, query) => {
    if (Title.includes(query) ) {
      return true;
    }
    return false;
  };
//-----------------------------------------------------------------------------------------------------
  //allow user to refresh the task and category list when user has created a new one
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(()=> {
      getTask();
      getCategory();
      scheduleNotifications();
      setRefreshing(false);
    },2000);
  },[filteredListCat],);

  //---------------------------------------------------------------------------------------------------
  //Confirm alert message for delete task. 
  const ConfirmAlertDelete =(DocId) => {
    //save the task's docId in setDeleteDocId state. User has to press delete twice as the DocId is not saved to the state when first pressed
    setDeleteDocId(DocId);
    Alert.alert(
      'Confirmation',
      'Are you sure you want to delete this task? (Press on Delete twice)',
      [
        {text: 'Yes', onPress:()=>deleteTask(DocId)},
        {text: 'Cancel', styles: 'cancel'}
      ]
    );

  };
  //Confirm alert message for mark task as done
  const ConfirmAlertMarkasDone =(docid) => {
    //save the task's docId in setDoneDocId state. User has to press Mark as Donw twice as the DocId is not saved to the state when first pressed
    setDoneDocId(docid);
    Alert.alert(
      'Confirmation',
      'Once completed, you would not be able to modify this task again. (Press on Mark as Done twice)',
      [
        {text: 'Ok', onPress:()=>CompleteTask(docid)},
        {text: 'Cancel', styles: 'cancel'}
      ]
    );

  };

  //------------------------------------------------------------------------------------------
  const scheduleNotifications = async () => {
    //get today date
    const today = new Date();
    //change today's date format to yyyy-mm-dd to match with the calendar date
    const todayDate = today.getFullYear()+'-'+('0'+(today.getMonth()+1)).slice(-2)+'-'+('0'+(today.getDate())).slice(-2);

    try {
      taskinfo.map((item)=>{
      //If the task deadline is today, not completed and reminder is set as notification, set the notification reminder
      if(taskinfo != ''&& item.Date === todayDate && item.MarkasDone === false && item.Reminder === 'Notification')
      {
        Notifications.scheduleNotificationAsync({
        content: {
          title: item.Title,
          body: "At " + item.Time,
        },
        trigger: { seconds: 5 },
      });
      };

    });
    }
    catch(error)
    {
      console.log('Fail to schedule notification: ', error);
    }

  };

  return (
    <SafeAreaView style={styles.SafeAreaView}>
      <MenuProvider >
        <View style={styles.CategoryListCon}>
          <Menu>
            <MenuTrigger>
                <Image style={styles.kebabImg} source={require('../assets/images/kebabmenu.png')}/>
            </MenuTrigger>
            <MenuOptions customStyles={{optionsContainer: styles.CategoryMenu}} optionsContainerStyle={{marginTop: 30}}>
              <MenuOption  customStyles={{optionWrapper:styles.CategoryOptions}}  value='Manage Category' text='Manage Category' onSelect={() => navigation.navigate("ManageCategories")}/>
              <MenuOption  customStyles={{optionWrapper: styles.CategoryOptions}} value='Create Category' text='Create Category' onSelect={() => setModalVisible(!modalVisible)}/>
            </MenuOptions>
          </Menu>
          <View style={styles.CategoryList}>
            <ScrollView horizontal >
              <View style={{flexDirection: "row", margin: 5}}>
                <TouchableOpacity style={CatBtnActive === "None" ? { margin: 5, backgroundColor:"#31E731", width:50,borderRadius: 25}: { margin: 5, backgroundColor:"#BEFDBE", width:50,borderRadius: 25}} onPress={CatClick('None')}>
                  <Text style={CatBtnActive === "None" ? {fontSize: 18, color: 'white', textAlign:'center'}: {fontSize: 18, textAlign:'center'}}>All</Text>
                </TouchableOpacity>
                {categoryinfo.map((category)=>{
                  return (
                    <View>
                      <TouchableOpacity style={CatBtnActive === category.Category ? styles.CategoryListButtonsActive: styles.CategoryListButtons} onPress={() =>{ setCategoryFilter(category.Category), setCatBtnActive(category.Category)}}>
                        <Text style={CatBtnActive === category.Category ? {color: 'white',fontSize: 18,textAlign:'center'}: {fontSize: 18,textAlign:'center'}} >{category.Category}</Text>
                      </TouchableOpacity>
                    </View>
                  )
                })}
              </View>
            </ScrollView>
          </View>
        </View>
     
       <View style={styles.container}>
        <View>
          {filteredListCat && (
           <FlatList
            keyboardShouldPersistTaps="always"
            data={filteredListCat} 
            renderItem={renderTaskItem}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
            ItemSeparatorComponent={Separator}
            keyExtractor={(item, index) => item.DocId}
            ListEmptyComponent={emptyTaskinfo}
            ListHeaderComponent={
              <View>
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  clearButtonMode="always"
                  value={searchquery}
                  onChangeText={queryText => handleSearch(queryText)}
                  placeholder="Search tasks...."
                  style={styles.SearchTextInput}
                />
              </View>
            }
            />
          )}
        <View style={styles.buttoncontainer}>
          <TouchableOpacity  testID='CreateTaskBtn' onPress={() => navigation.navigate("CreateTask")}>
            <Image  style={styles.taskbtn}source={require("../assets/images/addtaskbtn.png")}/>
          </TouchableOpacity>
        </View>
        </View>
      </View>

        <Modal animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {setModalVisible(!modalVisible)}}>
          <View style={styles.modalView}>
            <Text style={styles.CatTextContainer}>Create new category</Text>
            <TextInput style={styles.textinput} placeholder='New Category' value ={category} onChangeText={(value)=> setCategory(value)} />
           
            <View style={styles.Catbuttoncontainer}>
              <View>
                <TouchableOpacity  style={styles.Catbutton}>
                  <Text style={styles.CatbuttonText} onPress={addCategory}>Create</Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity  style={styles.Catbutton}>
                  <Text style={styles.CatbuttonText}  onPress={() => setModalVisible(!modalVisible)}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

      </MenuProvider>
    </SafeAreaView>
  );
}


//Calendar screen function
export function CalendarScreen({navigation}) {
  //get today's date
  const today = new Date();
  //change today's date format to yyyy-mm-dd to match with the calendar date
  const todayDate = today.getFullYear()+'-'+('0'+(today.getMonth()+1)).slice(-2)+'-'+('0'+(today.getDate())).slice(-2);
  //For getting the date value from the calendar, default will be today date
  const [selectedDate, setSelectedDate] = useState(todayDate);
 
  //for refresh data
  const [refreshing, setRefreshing] = useState(false);
  //retrieves the authentication state
  const auth = getAuth();
  //get the current user authentication state
  const user = auth.currentUser;

  useEffect(()=>{
    getTask();
  },[]);

  //For getting task details from firebase
  const [taskinfo, settaskinfo] = useState([]);
  
  // get the task list from firebase database based on the user id
  const getTask = async () => {

    try{
      const db = getFirestore(app);
      //Tasks main collection from the firebase
      const TaskCollection = doc(db, 'Tasks', user.uid);
      //Tasks sub collections
      const TaskTodayCollection = collection(TaskCollection, 'Today')
      const TaskUpcomingCollection = collection(TaskCollection, 'Upcoming')
      const TaskPastCollection = collection(TaskCollection, 'Past')

      //Get the tasks from Today sub collection
      const TaskTodaySnapShot = await getDocs(TaskTodayCollection);
      const TodayTask = [];

      //Get the tasks from Upcoming sub collection
      const TaskUpcomingSnapShot = await getDocs(TaskUpcomingCollection);
      const UpcomingTask = [];

      //Get the tasks from Past sub collection
      const TaskPastSnapShot = await getDocs(TaskPastCollection);
      const PastTask = [];

      //save the tasks from Today sub collection to TodayTask array
      TaskTodaySnapShot.forEach((doc) => {
        const {DocId, Title, Category, Deadline, UserId, MarkasDone} = doc.data();

        //Below are the codes to separate the date and the time values from the Deadline field. 

        //The Deadline value is first converted from object to date datatype
        const deadline = new Date(Date.parse(Deadline.toDate()))
        //Change the date format to yyyy-mm-dd to match with the react native calendar date value, and then save it to date constant
        const date = deadline.getFullYear()+'-'+('0'+(deadline.getMonth()+1)).slice(-2)+'-'+('0'+(deadline.getDate())).slice(-2); 
        //Options is used to change the time to 24hrs format and show 2 digits for both hour and minute. Default format was 12hrs with hours, minutes and seconds
        const options = {hour12: false, hour: '2-digit', minute: '2-digit'}
        //Convert the time to local time string with the options, and then save it to time constant
        const time = deadline.toLocaleTimeString('en-US',options)

        //task details are saved to array
        TodayTask.push({
          DocId: DocId,
          Title: Title,
          Category: Category,
          Deadline: date,
          Time: time,
          UserId : UserId,
          MarkasDone: MarkasDone
      });
      });

      //save the tasks from Upcoming sub collection to UpcomingTask array
      TaskUpcomingSnapShot.forEach((doc) => {
        const {DocId, Title, Category, Deadline, UserId, MarkasDone} = doc.data();
  
        //Below are the codes to separate the date and the time values from the Deadline field. 
  
        //The Deadline value is first converted from object to date datatype
        const deadline = new Date(Date.parse(Deadline.toDate()))
        //Change the date format to yyyy-mm-dd to match with the react native calendar date value, and then save it to date constant
        const date = deadline.getFullYear()+'-'+('0'+(deadline.getMonth()+1)).slice(-2)+'-'+('0'+(deadline.getDate())).slice(-2); 
        //Options is used to change the time to 24hrs format and show 2 digits for both hour and minute. Default format was 12hrs with hours, minutes and seconds
        const options = {hour12: false, hour: '2-digit', minute: '2-digit'}
        //Convert the time to local time string with the options, and then save it to time constant
        const time = deadline.toLocaleTimeString('en-US',options)
  
        //task details are saved to array
        UpcomingTask.push({
          DocId: DocId,
          Title: Title,
          Category: Category,
          Deadline: date,
          Time: time,
          UserId : UserId,
          MarkasDone: MarkasDone
        });
        });

        //save the tasks from Past sub collection to PastTask array
        TaskPastSnapShot.forEach((doc) => {
        const {DocId, Title, Category, Deadline, UserId, MarkasDone} = doc.data();

        //Below are the codes to separate the date and the time values from the Deadline field. 

        //The Deadline value is first converted from object to date datatype
        const deadline = new Date(Date.parse(Deadline.toDate()))
        //Change the date format to yyyy-mm-dd to match with the react native calendar date value, and then save it to date constant
        const date = deadline.getFullYear()+'-'+('0'+(deadline.getMonth()+1)).slice(-2)+'-'+('0'+(deadline.getDate())).slice(-2); 
        //Options is used to change the time to 24hrs format and show 2 digits for both hour and minute. Default format was 12hrs with hours, minutes and seconds
        const options = {hour12: false, hour: '2-digit', minute: '2-digit'}
        //Convert the time to local time string with the options, and then save it to time constant
        const time = deadline.toLocaleTimeString('en-US',options)

        //task details are saved to array
        PastTask.push({
          DocId: DocId,
          Title: Title,
          Category: Category,
          Deadline: date,
          Time: time,
          UserId : UserId,
          MarkasDone: MarkasDone
      });
      });

      //combine all the three tasks into one
      const AllTasks = [...TodayTask, ...PastTask, ...UpcomingTask];

      //save the task details from the array to settaskinfo state
      settaskinfo(AllTasks);
      
   
    }
    catch(error)
    {
      console.log('Fail to get all the tasks:', error);
    }
    
  };
//-----------------------------------------------------------------------

  //Create TaskItem constant to display the task data
  const TaskItem = ({ Title, Time, DocId }) => (
    <View>
      <Text style={styles.TaskItemText}>{Time}</Text>
      <Text style={styles.TaskItemBtnCalendar} onPress={()=> navigation.navigate("EditTask", {DocId})}>{Title} </Text>
      
    </View>
  );

  //render the task data
  const renderTaskItem = ({ item }) => (
    <TaskItem Title={item.Title} Time={item.Time} DocId={item.DocId}/>
  );

  // filter the task details based on the deadline and mark as done fields
  const filteredListDate = useMemo(()=>{
    return taskinfo.filter(item => selectedDate == item.Deadline && item.MarkasDone == false );
  }, [selectedDate, taskinfo])

   //Display message if no task on the date 
   const emptyTaskinfo = () =>
    {
      return(
        <View style={styles.container}>
          <View>
            <Text style={styles.titleStyle}>No task</Text>
          </View>
        </View>
      )
    };

  //----------------------------------------------------------------------------
  //allow user to refresh the task on the calendar
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(()=> {
      getTask();
      setRefreshing(false);
    },2000);
  },[],);

  return (
    <SafeAreaView style={styles.SafeAreaView}>
      <View style={styles.container}>
        <View style={styles.calendarcon}>
         <Calendar onDayPress={day=>{
          setSelectedDate(day.dateString);
         }}
         markedDates={{[selectedDate]: {selected: true, disableTouchEvent:true}}}/>
        </View>
        <Text>{'\n'}</Text>
     
        <View style={{ flex: 1}}>
          {filteredListDate && (
           <FlatList
            data={filteredListDate}
            renderItem={renderTaskItem}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
            ItemSeparatorComponent={Separator}
            ListEmptyComponent={emptyTaskinfo}/>
          )}
        </View>
     </View>
  </SafeAreaView>
  );
}

//Account screen function
export function AccountScreen() {

  //retrieves the authentication state
  const auth = getAuth();
  //get the current user authentication state
  const user = auth.currentUser;
  const [refreshing, setRefreshing] = useState(false);

  useEffect(()=>{
    getUsername();
    getTask();
  },[]);

  const [username, setUsername] = useState('');
  //For getting task details from firebase
  const [taskinfo, settaskinfo] = useState([]);

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
      const UserUsername = [];
      //save the username to UserUsername array
      UsernameSnapShot.forEach((doc) => {
        const {username} = doc.data()
        UserUsername.push([
          username
        ]);
      });
      //save the username from UserUsername array to setUsername state
      setUsername(UserUsername);
    }
    catch(error)
    {
      console.log("Fail to get the user's username: ", error);
    }
   

  };

  // get the task list from firebase database based on the user id
  const getTask = async () => {

    try{
      const db = getFirestore(app);
      //Tasks main collection from the firebase
      const TaskCollection = doc(db, 'Tasks', user.uid);

      //Tasks sub collections
      const TaskTodayCollection = collection(TaskCollection, 'Today')
      const TaskUpcomingCollection = collection(TaskCollection, 'Upcoming')
      const TaskPastCollection = collection(TaskCollection, 'Past')

      //Get the tasks from Today sub collection
      const TaskTodaySnapShot = await getDocs(TaskTodayCollection);
      const TodayTask = [];

      //Get the tasks from Upcoming sub collection
      const TaskUpcomingSnapShot = await getDocs(TaskUpcomingCollection);
      const UpcomingTask = [];

      //Get the tasks from Past sub collection
      const TaskPastSnapShot = await getDocs(TaskPastCollection);
      const PastTask = [];

      //save the task details from Today sub collection to TodayTask array
      TaskTodaySnapShot.forEach((doc) => {
        const {Title, MarkasDone} = doc.data();

        //task details are saved to Task array
        TodayTask.push({
          Title: Title,
          MarkasDone: MarkasDone
      });
      });

      //save the task details from Upcoming sub collection to UpcomingTask array
      TaskUpcomingSnapShot.forEach((doc) => {
        const {Title, MarkasDone} = doc.data();

        //task details are saved to Task array
        UpcomingTask.push({
          Title: Title,
          MarkasDone: MarkasDone
      });
      });

      //save the task details from Past sub collection to PastTask array
      TaskPastSnapShot.forEach((doc) => {
        const {Title,MarkasDone} = doc.data();

        //task details are saved to Task array
        PastTask.push({
          Title: Title,
          MarkasDone: MarkasDone
        });
      });

      //combine all the three tasks into one
      const AllTasks = [...TodayTask, ...PastTask, ...UpcomingTask];

      //save all the task details to settaskinfo state
      settaskinfo(AllTasks);
    
   
    }
    catch(error)
    {
      console.log('Fail to get all the tasks:', error);
    }
    
  };

  //filter the pending task data if mark as done is false
  const PendingTasks = taskinfo.filter(item => item.MarkasDone == false);
  //count the number of tasks
  const PendingTasksCount = PendingTasks.length;

  //filter the completed task data if mask as done is true
  const CompletedTasks = taskinfo.filter(item => item.MarkasDone == true);
  //count the number of tasks
  const CompletedTasksCount = CompletedTasks.length;

  //allow user to refresh the task on the calendar
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(()=> {
      getTask();
      setRefreshing(false);
    },2000);
  },[],);

  //placeholder data for data analysis
  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // optional
        strokeWidth: 2 // optional
      }
    ],
  };

  //setting for line chart
  const chartConfig = {
    backgroundGradientFrom: "#000000",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#000000",
    backgroundGradientToOpacity: 0,
    color: (opacity = 0) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2, 
    barPercentage: 1,
    useShadowColorFromDataset: false 
  };
 
  return (
    <SafeAreaView style={styles.SafeAreaView}>
      <View style={styles.container}>
        <View style={styles.accountCon}>
          <View>
            <Image style={styles.profileimg} source={require("../assets/images/profileicon.png")}/>
          </View>
        <View >
            <Text style={styles.usernameText}>{username}</Text>
          </View>
        </View>

      <ScrollView style={styles.taskoverviewCon} testID='scroll-view' refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
        <Text style={styles.taskoverviewTxt}>Tasks Overview</Text>
        <View style={styles.taskoverviewSubCon}>
          <View style={styles.tasksTxtCon}>
            <Text style={styles.tasksTxtNos}>{CompletedTasksCount}</Text>
            <Text style={styles.tasksTxt}>Completed Tasks</Text>
          </View>
          <View style={styles.tasksTxtCon}>
            <Text style={styles.tasksTxtNos}>{PendingTasksCount}</Text>
            <Text style={styles.tasksTxt}>Awaiting Tasks</Text>
          </View>
        </View>

        <View style={styles.dataAnalysisCon}>
        <Text style={styles.dataAnalysisTxt}>Data Analysis</Text>
        <LineChart
          data={data}
          height={220}
          width={355}
          chartConfig={chartConfig}
          style={{top: "5%", right:"1%"}}/>

        </View>
     </ScrollView>
    </View>
 </SafeAreaView>
  )
}

//Display task, calendar and account bottom navigators
export function MyTabs() {
  return (
    <Tab.Navigator initialRouteName='Task'>
      <Tab.Screen name="Menu" component={TaskScreen} listeners={({navigation}) => ({
        tabPress: e => {
          e.preventDefault();
          navigation.openDrawer();
        }
      })}
        options={{
            headerShown: false,
            title: 'Menu',
            tabBarIcon: ({size}) => {
              return (
                <Image style={{ width: size, height: size }} source={require("../assets/images/hamburgericon.png")}/>
              );
            }
          }}
        />
       <Tab.Screen name="Task" component={TaskScreen}
        options={{
            headerShown: false,
            title: 'Tasks',
            tabBarIcon: ({size}) => {
              return (
                <Image style={{ width: size, height: size }} source={require("../assets/images/taskicon.png")}/>
              );
            }
          }}
        />
      <Tab.Screen name="Calendar" component={CalendarScreen} options={{
            headerShown: false,
            tabBarIcon: ({size}) => {
              return (
                <Image style={{ width: size, height: size }} source={require("../assets/images/calendaricon.png")}/>
              );
            },
          }}
        />
      <Tab.Screen name="Account" component={AccountScreen} options={{
            headerShown: false,
            tabBarIcon: ({size}) => {
              return (
                <Image style={{ width: size, height: size }} source={require("../assets/images/accounticon.png")}/>
              );
            },
          }}
        />
    </Tab.Navigator>
  );
}


//Hamburger navigator with the bottom navigators in MyTabs function
export function DrawerNav() {

  //retrieves the authentication state
  const auth = getAuth();
  //get the current user authentication state
  const user = auth.currentUser;

  //For adding category to the firebase
  const [category, setCategory] = useState([]);
  //For getting category details from firebase
  const [categoryinfo, setCategoryInfo] = useState([]);

  //For getting category details from firebase
  const [teaminfo, setTeamInfo] = useState([]);

  //Visibility setting for modal
  const [modalVisible, setModalVisible] = useState(false);
  //Refresh data
  const [refreshing, setRefreshing] = useState(false);

  //show or hide category menu
  const [showCategory, setShowCategory] = useState(false)
  const toggleShowCategory = () => setShowCategory(showCategory => !showCategory)

  //show or hide project menu
  const [showProject, setShowProject] = useState(false)
  const toggleShowProject = () => setShowProject(showProject => !showProject)

  useEffect(()=>{
    getCategory();
    getTeam();
  },[]);

  //allow user to refresh the task on the calendar
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(()=> {
      getCategory();
      getTeam();
      setRefreshing(false);
    },2000);
  },[],);

  //----------------------------------------------------------------
  // add the category details to category collection in firebase
  const addCategory = async () => {
    try{
        const db = getFirestore(app);
        //Category main collection from firebase db
        const CategoryCollection = doc(db, 'Category', user.uid);
        //Category sub collection
        const CategorySubCollection = collection(CategoryCollection, 'Category')
        //Create reference id as DocId
        const Ref = doc(CategorySubCollection);
        const id = Ref.id;
        //Save the category details to the sub collection
        const CategoryRef = await addDoc(CategorySubCollection, {DocId: id,Category_Title: category});
        Alert.alert("Category created.");
        console.log("Category added: ", CategoryRef.id);
    }
    catch (error)
    {
        console.log("Failed to add category: ", error);
    }
  }

   //get the category details from Category collection based on the user id
   const getCategory = async () => {
    try{
      const db = getFirestore(app);
      //Category main collection from firebase db
      const CategoryCollection = doc(db, 'Category', user.uid);
      //Category sub collections
      const CategorySubCollection = collection(CategoryCollection, 'Category')

      //get the category details from the sub collection
      const CategorySnapShot = await getDocs(CategorySubCollection);
      const Category = []
      //save the category details to Category array
      CategorySnapShot.forEach((doc) => {
        //console.log(doc.data())
        const {Category_Title} = doc.data()
        Category.push({
          Category: Category_Title
      });
      });

      //save the array elements to setCategoryInfo state
      setCategoryInfo(Category);

      return() => getCategory(Category);
    }
    catch(error)
    {
      console.log('Fail to get all the categories:', error);
    }

  };

  //get the category details from Category collection based on the user id
  const getTeam = async () => {
    try
    {
      const db = getFirestore(app);
      //Teams collection from firebase db
      const TeamsCollection = collection(db, 'Teams');

      //get the team details based on the user id in MembersId nested array
      const TeamsQuery = query(TeamsCollection, where('MembersId', 'array-contains-any',[{UserId: user.uid}]));
      const TeamSnapShot = await getDocs(TeamsQuery);
      const Teams = [];
      //save the team details to Teams array
      TeamSnapShot.forEach((doc) => {
        const {DocId, Name} = doc.data()
        Teams.push({
          DocId: DocId,
          Name: Name
      });
      });
   
      //save the array elements to setTeamInfo state
      setTeamInfo(Teams);

      return() => getTeam(Teams);
    }
    catch(error)
    {
      console.log('Fail to get all the teams:', error);
    }
    

  };

  //allow user to sign out
  const SignOut = async () => {
    try{
      signOut(auth);
      console.log("User signout successfully");
    }
    catch(error){
      console.log("Error signing out", error)
    }
  }

  return (
    <Drawer.Navigator initialRouteName="Task Home" screenOptions={{drawerStyle: {height: '100%'}}} drawerContent={props => {
      return(
        <DrawerContentScrollView {...props} contentContainerStyle={{flex: 1}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
          <Modal animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {setModalVisible(!modalVisible)}}>
          <View style={styles.modalView}>
            <Text style={styles.CatTextContainer}>Create new category</Text>
            <TextInput style={styles.textinput} placeholder='New Category' value ={category} onChangeText={(value)=> setCategory(value)} />   
            <View style={styles.Catbuttoncontainer}>
              <View>
                <TouchableOpacity  style={styles.Catbutton}>
                  <Text style={styles.CatbuttonText} onPress={addCategory}>Create</Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity  style={styles.Catbutton}>
                  <Text style={styles.CatbuttonText}  onPress={() => setModalVisible(!modalVisible)}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <View>
          <Image source={require("../assets/images/homemenupic.png")} style={{width: "100%", height: "50%", resizeMode:'contain'}}/>
        </View>
        <View style={{bottom: "25%"}}>
        <DrawerItemList {...props}/>
        <DrawerItem label="Category" onPress={toggleShowCategory}/>
        {showCategory ? 
        <View style={{left: 10}}>
          <DrawerItem label="All" />
            {categoryinfo.map((category)=>{
              return (
                <DrawerItem label={category.Category}/>
              )
            })}
            <DrawerItem label="Create New" onPress={() => setModalVisible(true)}/> 
          </View>
          :null
        }
        <DrawerItem label="Team" onPress={toggleShowProject}/>
        {showProject ? 
        <View style={{left: 10}}>
            {teaminfo.map((team)=>{
              const docid = team.DocId
              return (
                <DrawerItem label={team.Name} onPress={() => props.navigation.navigate("Team",{docid})}/>
              )
            })}
            <DrawerItem label="Join Team" onPress={() => props.navigation.navigate("TeamList")}/> 
            <DrawerItem label="Create New Team" onPress={() => props.navigation.navigate("CreateTeam")}/> 
          </View>
          :null
          }
          
          <DrawerItem label="Logout" onPress={()=>{SignOut(), props.navigation.navigate('Login');}}/>
          </View>
        </DrawerContentScrollView>
      )
    }}>
       <Drawer.Screen name="Task Home" component={MyTabs} options={{headerShown:false, drawerItemStyle: {display: 'none'}}} />
    
    </Drawer.Navigator>
    
  );
}

export default function HomeScreen() {
  useEffect(() => {
   NotificationListener();
  }, [])

  const NotificationListener = async() => {
    //get the response when user recieve notification reminder
    const receivedSubscription = Notifications.addNotificationReceivedListener(
      notification => {
        console.log("Notification Received!")
        console.log(notification)
      }
    )

    //get the response when the user presses on the notification
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
      response => {
        console.log("Notification Clicked!")
        console.log(response)
      }
    )
    return () => { 
      //remove the notification after user has pressed on it
      receivedSubscription.remove()
      responseSubscription.remove()
    }
  };

  return (
      <DrawerNav />
  );
}
