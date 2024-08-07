import { StyleSheet } from "react-native";

export default StyleSheet.create({

    SafeAreaView: {
        flex: 1, 
        width:"100%", 
        height:"100%"
      },
      container: {
        flex: 1,
        backgroundColor: "white",
        top: "10%"
      },
    
      TextContainer: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 20,
        left: "5%"
      },
      
      Projbuttoncontainer: {
        width:"90%",
        textAlign: "center",
        left: "5%"
      },
      
      Projbutton: {
        alignItems: "center",
        backgroundColor: '#BEFDBE',
        borderRadius: 25,
        top: "10%"
      },
      ProjbuttonText: {
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
      txt: {
        fontSize: 20,
        left: "5%"
      },
      ColourStyle: {
        width: '80%',
        left: '10%'
      }
});