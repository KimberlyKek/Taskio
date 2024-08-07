import { StyleSheet } from "react-native";

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
    marginBottom: 80
  },
  TextSubcontainer: {
    fontSize: 20,
    color: 'black'
  },

  textsubcon: {
    flexDirection: "row",
    margin: 5
   
  },
  TextThirdcontainer: {
    fontSize: 15,
    color: 'black',
    
  },

  image: {
    flex: 1,
    width: 50,
    height: 50,
    resizeMode: "contain"
    
  },

  buttoncontainer: {
    width:"80%",
  },
  button: {
    alignItems: "center",
    backgroundColor: '#FBDB65',
    borderRadius: 25,
    top: "400%"
  },
  buttonText: {
    fontSize: 24,
    color: '#000',
    textTransform: "uppercase"
  }
})
