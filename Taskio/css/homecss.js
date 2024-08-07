import { StyleSheet } from "react-native";

export default StyleSheet.create({

  //General css for home.js and createtask.js
  SafeAreaView: {
    flex: 1, 
    width:"100%", 
    height:"100%"
  },
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  textcon: {
    top: "10%"
  },
//-----------------------------------------------------------------------------------------------------
//For TaskScreen function in home.js

  buttoncontainer: {
    width:"95%",
    top: 600,
    left: "80%",
    position: 'absolute'
   
  },
  //Create task button
  taskbtn: {
    width: 60,
    height: 60
  },
  TaskItemText: {
    fontSize: 20, 
    left: "5%",
    height: 30,
    width: "90%",
    
  },
  TaskItemBtn: {
    fontSize: 20, 
    left: "2%",
    height: 70,
    width: "90%",
    margin: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: "#E9E6E6",
    borderRadius: 10,
  },

  TaskItemDate: {
    fontSize: 15, 
  },

  TaskItemPastDate: {
    fontSize: 15, 
    color: 'red'
  },

  TaskItemPriority : {
    fontSize: 15, 
    color: '#02CCFE'
  },

  TaskItemComplete: {
    fontSize: 20, 
    left: "2%",
    height: 70,
    width: "90%",
    margin: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: "#E9E6E6",
    opacity: 0.5,
    borderRadius: 10,
  },

  titleStyle: {
    textAlign:'center'
  },
  CategoryListCon:{
    paddingTop: 40,
    flexDirection: 'row',
    left: "47%"
  },
  CategoryMenu: {
   borderRadius:10, 
   width: "40%"
  },

  CategoryOptions: {
    alignItems: "center",
    justifyContent: "space-between",
    margin: 10
  },
  CategoryList:{
    width: "80%",
    right: 380
  },

  CategoryListButtons:{
   
    margin: 5, 
    alignSelf: "center",
    backgroundColor: '#BEFDBE',
    borderRadius: 25,
    maxWidth: 130,
    minWidth: 70
  },
  CategoryListButtonsActive:{
   
    margin: 5, 
    alignSelf: "center",
    backgroundColor: '#31E731',
    borderRadius: 25,
    maxWidth: 130,
    minWidth: 70
  },
  SearchTextInput: {
    height: 50,
    width: "90%",
    left: "2%",
    margin: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: "#E9E6E6",
    borderRadius: 30,
    fontSize: 20
  },
  //Modal css for category function
  modalView: {
    marginTop: "60%",
    margin: 30,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: 230,
    borderRadius: 25
  },
  //Category button
  CatTextContainer:{
  fontSize: 20,
  fontWeight: 'bold',
  color: 'black',
  marginBottom: 30,
  left: "5%",
  top: "15%",
  },
  Catbuttoncontainer: {
   
    textAlign: "center",
    left: 150,
    flexDirection: "row",
    margin: 5,
   
  },
 
  Catbutton: {
    alignItems: "center",
    backgroundColor: '#BEFDBE',
    borderRadius: 25,
    top: "10%",
    margin: 5,
  },
  CatbuttonText: {
    fontSize: 20,
    color: '#000',
    margin: 5,
  },
  kebabImg:{
    width: 20,
    height: 20,
    resizeMode: 'contain',
    top: 10
  },

  TaskMenuCon:{
    width: "10%",
    left: "85%",
    bottom: "270%"
},
TaskMenu: {
    borderRadius:10, 
    width: "30%"
},
TaskOptions :{
    alignItems: "center",
    justifyContent: "space-between",
},
kebabImgTask: {
    width: 20,
    height: 20
},
//------------------------------------------------------------------------------------------------------
//For Calendar function in home.js
  //Calendar
  calendarcon: {
    top:"3%"
  },
  TaskItemBtnCalendar :{
    fontSize: 20, 
    left: "2%",
    height: 50,
    width: "90%",
    margin: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: "#E9E6E6",
    borderRadius: 10,
  },
//---------------------------------------------------------------------------------------------------
//For create task screen
TextContainer: {
  fontSize: 30,
  fontWeight: 'bold',
  color: 'black',
  marginBottom: 20,
  left: "5%"
},

Taskbuttoncontainer: {
  width:"90%",
  textAlign: "center",
  left: "5%"
},

Taskbutton: {
  alignItems: "center",
  backgroundColor: '#BEFDBE',
  borderRadius: 25,
  top: "10%"
},
TaskbuttonText: {
  fontSize: 20,
  color: '#000',
  margin: 5,
},

textinput: {
  height: 50,
  width: "90%",
  left: "2%",
  margin: 12,
  borderWidth: 1,
  padding: 10,
  backgroundColor: "#E9E6E6",
  borderRadius: 10,
  fontSize: 20
},
Notestextinput:{
  height: 200,
  width: "90%",
  left: "2%",
  margin: 12,
  borderWidth: 1,
  padding: 10,
  backgroundColor: "#E9E6E6",
  borderRadius: 10,
  fontSize: 20,
  textAlignVertical: 'top'
},
imgicons: {
  flexDirection: "row",
  margin: 5,
  left: 15
 
},
image: {
  width: 35,
  height: 35,
  resizeMode: "contain"
},
CalendarmodalView: {
  marginTop: "50%",
    margin: 30,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: 480,
    borderRadius: 25
},
remindercon: {
  top: 20
},
remindertxt: {
  fontSize: 15,
  left: 15
},
FieldText: {
  fontSize: 20,
  left: "5%"
},
inputIOS: {
  left: 15,
  fontSize: 20,
  paddingHorizontal: 10,
  paddingVertical: 8,
  paddingRight: 10,
  
},
inputAndroid: {
  left:10,
  fontSize: 20,
  paddingHorizontal: 10,
  paddingVertical: 8,
  paddingRight: 10, 
},
//----------------------------------------------------------------------------------------------
//For account function
accountCon:{
  flexDirection:'row',
  margin: 5, 
  top: "15%", 
  left: "2%"
},

profileimg:{
  flex: 1,
  width: 50,
  height: 50,
  resizeMode: "contain"
},
usernameText :{
  fontSize: 25,
  fontWeight: 'bold',
  color: 'black',
},

taskoverviewCon: {
  left: "5%", 
  top: "10%"
},
taskoverviewTxt: {
  fontSize: 20,
  fontWeight: 'bold',
  color: 'black'
},
taskoverviewSubCon:{
  flexDirection: 'row', 
  margin: 5
},

tasksTxtCon:{
  width: "42%", 
  height: 100, 
  borderWidth: 1,
  backgroundColor: '#BEFDBE', 
  marginRight: 15
},

tasksTxtNos:{
  fontSize: 30,
  fontWeight: 'bold',
  color: 'black',
  textAlign:'center', 
  top: '10%'
},

tasksTxt:{
  fontSize: 20,
  fontWeight: 'bold',
  color: 'black',
  textAlign:'center', 
  top: '10%'
},

dataAnalysisCon:{
  margin: 5, 
  width: "86%", 
  height: 260, 
  borderWidth: 1,
  backgroundColor: '#BEFDBE'
},

dataAnalysisTxt:{
  fontSize: 15,
  fontWeight: 'bold',
  color: 'black', 
  top: 10, 
  left: 10
}
});