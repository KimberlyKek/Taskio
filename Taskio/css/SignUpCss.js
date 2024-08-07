import { StyleSheet } from "react-native";

export default StyleSheet.create({
//General css
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
    top: "10%"
  },

  TextContainer: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
    left: "4%"
  },

  buttoncontainer: {
    width:"90%",
    textAlign: "center",
    left: "5%"
  },
//Sign up button
  button: {
    alignItems: "center",
    backgroundColor: '#FBDB65',
    borderRadius: 25,
    top: "10%"
  },
//Login button
  loginbutton: {
    alignItems: "center",
    backgroundColor: '#FBDB65',
    borderRadius: 25,
    top: "10%"
  },
  buttonText: {
    fontSize: 24,
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
    backgroundColor: "white",
    fontSize: 20
  },
  forgotpassText:{
    textAlign: "center",
    top: "15%"
  },

  hereText: {
    color: "blue"
  },

  resetpwdtxt: {
    left:"6%", 
    fontSize: 15
  }
})
