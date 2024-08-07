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

  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 280,
  },
  nameTxt: {
    color: '#1E90FF',
    marginLeft: '9%',
    fontSize: 20,
    width: '70%',
  },
  JoinTxt: {
    fontSize: 20,
  
  },

  OwnerTxt: {
  
    color: '#008B8B',
    fontSize: 15,
    marginLeft: '6%',
    
  },
  JoinBtn: {
    alignItems: "center",
    backgroundColor: '#BEFDBE',
    borderRadius: 25,
    left: '200%',
    top: '5%',
    width: '30%'
  },
});