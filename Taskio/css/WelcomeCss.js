import {StyleSheet } from "react-native";

export default StyleSheet.create({

  SafeAreaView: {
    flex: 1, 
    width:"100%", 
    height:"100%"
  },

  container: {
    flex: 1,
    backgroundColor: '#BEFDBE'
  },

  textcon: {
    alignItems: "center",
    marginBottom: 20,
    top: "15%"
  },

  TextContainer: {
    textAlign: "center",
    fontSize: 35,
    fontWeight: 'bold',
    color: 'black',
    
  },
  TextSubcontainer: {
    fontSize: 20,
    color: 'black',
    bottom: "27%"
  },

  textsubcon: {
      flexDirection: "row",
      margin: 5
    },

  image: {
      flex: 1,
      width: 50,
      height: 50,
      resizeMode: "contain"
  },

  welcomeimg : {
      width: "90%",
      resizeMode: "contain",
      bottom: "15%"
  },
  socialmediaimage: {
      bottom: "500%",
      marginLeft: "5%",
      width: 30,
      height: 30,
      resizeMode: "contain",
  },
  buttoncontainer: {
      width:"80%",
  },
  button: {
  alignItems: "center",
  backgroundColor: '#FBDB65',
  marginBottom: "5%",
  bottom: "150%"
  },

  buttonText: {
  fontSize: 24,
  color: '#000',
  textTransform: "uppercase"
  }
});
