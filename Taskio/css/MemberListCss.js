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
  MemberListCon:{
    paddingTop: 80,
    backgroundColor:'white',
    flexDirection: 'row'
  },

TextContainer: {
  fontSize: 30,
  fontWeight: 'bold',
  color: 'black',
  marginBottom: 20,
  left: "10%"
},
row: {
    flexDirection: 'row',
    borderColor: '#DCDCDC',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    padding: 10,
    left: '10%'
  },
  pic: {
    borderRadius: 30,
    width: 60,
    height: 60,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 280,
  },
  nameTxt: {
    marginLeft: '5%',
    fontSize: 20,
    width: '70%',
  },
  removeBtn: {
    top:'60%',
    fontSize: 20,
  },
  RoleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  RoleTxt: {
    fontWeight: '400',
    color: '#008B8B',
    fontSize: 20,
    marginLeft: '5%',
  },

})