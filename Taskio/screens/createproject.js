import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, SafeAreaView, TouchableOpacity, TextInput, Alert, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { getAuth} from 'firebase/auth';
import {app} from "../firebaseConfig.js"
import styles from '../css/CreateProjCss.js'
import { addDoc,getDocs, collection,getFirestore,doc} from 'firebase/firestore';
import ColorPicker from 'react-native-wheel-color-picker'
import {useRoute } from '@react-navigation/native';


//Create project function
export default function CreateProjectScreen() {

    //get the team's DocId from team.js
    const route = useRoute();
    const TeamDocId = route.params?.TeamDocId;

    const [project, setProject] = useState('')

    const [folderInfo, setFolderInfo] = useState([]);
    
    const [folderValue, setFolderValue] = useState('');

    const [colour, setColour] = useState();


    useEffect(()=>{
        getFolder();
      },[]);

    const Folderplaceholder = {
        label: 'Select folder...',
        value: null,
      };
      
    //convert folders object elements to array
    const Folderoptions = [];
    folderInfo.forEach((item)=>{
      Folderoptions.push({
        label: item.Folder_Name,
        value: item.Folder_Name
      })
    });


    //get the folder details from Folders collection 
    const getFolder = async () => {
      try{

        const db = getFirestore(app);
        //Folders collection from firebase db
        const FolderCollection = doc(db, 'Folders', TeamDocId);
        //Folders sub collection based on the team's DocId
        const FolderSubCollection = collection(FolderCollection, 'Folders');
      
        //get the folders details
        const FolderSnapShot = await getDocs(FolderSubCollection);
        const Folders = []
        //save the folders details to the array
        FolderSnapShot.forEach((doc) => {
          const {Folder_Name} = doc.data()
          Folders.push({
            Folder_Name: Folder_Name
        });
        });
        //save the array to setFolderInfo state
        setFolderInfo(Folders);
      
        return() => getFolder(Folders);
      }
      catch(error)
      {
        console.log('Fail to get the folders details: ', error);
      }
  
  };

  //allow user to create project and save it to Projects collection
  const addProject = async () => {
    try{
      //display alert message if project name is blank
      if (!project.trim())
        {
          Alert.alert("Error", "Project name must not be blank!")
        }
        else
        {
        const db = getFirestore(app);
        //Projects collection from firebase db
        const ProjectsCollection = doc(db, 'Projects', TeamDocId);
        //Projects sub collection based on the team's DocId
        const ProjectsSubCollection = collection(ProjectsCollection, 'Projects')
        //Create reference id as DocId
        const Ref = doc(ProjectsSubCollection);
        const id = Ref.id;
        //Save the projects details to the collection
        const ProjectRef = await addDoc(ProjectsSubCollection, {DocId: id,Project_Name: project, Folder: folderValue, Colour: colour});
        Alert.alert("Project created.");
        console.log("Project added: ", ProjectRef.id);
        }
    }
    catch (error)
    {
        Alert.alert("Error", "You fail to create a project.");
        console.log("Failed to add project: ", error);
    }
  };

    return (
        <SafeAreaView style={styles.SafeAreaView}>
          <View style={styles.container}>
            <View style={styles.textcon}>
            <Text style={styles.TextContainer}>Create New Project</Text>
            <ScrollView contentContainerStyle={{paddingBottom: 100}} >
              <TextInput style={styles.textinput} placeholder='New Project' value ={project} onChangeText={(value)=>setProject(value)} />
              <View>
                  
              <RNPickerSelect 
                placeholder={Folderplaceholder} 
                items={Folderoptions} 
                onValueChange={(value)=>setFolderValue(value)}
                value={folderValue}
                style={styles}
                useNativeAndroidPickerStyle={false}
                /> 
            
             <Text style={styles.txt}>Select colour:</Text>
              <ColorPicker
                  color={colour}
                  onColorChangeComplete={(color) => setColour(color)}
                  noSnap={true}
                  row={false}
                  swatches={false}
                  useNativeDriver={false}
                  useNativeLayout={false}
                  style={styles.ColourStyle}
              />
                <View style={styles.Projbuttoncontainer}>
                <TouchableOpacity  style={styles.Projbutton}>
                <Text style={styles.ProjbuttonText} onPress={addProject}>Create</Text>
                </TouchableOpacity>
                </View> 
                
                    </View>
                    </ScrollView>
                </View>
            </View>
          </SafeAreaView>
    )

}