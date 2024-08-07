import { StyleSheet } from "react-native";

export default StyleSheet.create({
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

  textinput: {
    height: 50,
    width: "90%",
    left: "2%",
    top: "5%",
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
    top: '5%',
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
    left: 15,
   
  },
  image: {
    width: 35,
    height: 35,
    resizeMode: "contain"
  },
  inputIOS: {
    left: 10,
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
  txt: {
    fontSize: 20,
    left: "5%"
  },
  remindertxt: {
    fontSize: 15,
    left: 15
  },
  FieldText: {
    fontSize: 20,
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
    top: "100%"
  },
  TaskbuttonText: {
    fontSize: 20,
    color: '#000',
    margin: 5,
  },
})