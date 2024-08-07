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

    TextContainer: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 20,
        left: "5%"
    },

    FolderTxtCon: {
      backgroundColor:'#BEFDBE', 
      top:'10%'
    },

    FolderTxt: {
      textAlign:'center', 
      fontSize: 15
    },
    FolderItem: {
        fontSize: 20, 
        left: "2%",
        height: 50,
        width: "90%",
        margin: 12,
        marginBottom: 0,
        borderWidth: 1,
        padding: 10,
        backgroundColor: "#E9E6E6",
        borderRadius: 10,
      },
    FolderMenuCon:{
        width: "10%",
        left: "85%",
        bottom: "180%"
    },
    FolderMenu: {
        borderRadius:10, 
        width: "20%"
    },
    FolderOptions :{
        alignItems: "center",
        justifyContent: "space-between",
    },
    kebabImg: {
        width: 20,
        height: 20
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

  FolderTextContainer:{
  fontSize: 20,
  fontWeight: 'bold',
  color: 'black',
  marginBottom: 30,
  left: "5%",
  top: "15%",
  },
  Folderbuttoncontainer: {
   
    textAlign: "center",
    left: 150,
    flexDirection: "row",
    margin: 5,
   
  },
 
  Folderbutton: {
    alignItems: "center",
    backgroundColor: '#BEFDBE',
    borderRadius: 25,
    top: "10%",
    margin: 5,
  },
  FolderbuttonText: {
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
  categoryStyle:{
    textAlign:'center'
  }
})