import { StatusBar } from 'expo-status-bar';
import { Text, View, SafeAreaView,TouchableOpacity, TextInput, Alert,ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { getAuth} from 'firebase/auth';
import {app} from "../firebaseConfig.js"
import styles from '../css/CreateProjCss.js'
import { getDocs, collection,getFirestore,query, where,updateDoc, doc} from 'firebase/firestore';
import ColorPicker from 'react-native-wheel-color-picker'
import {useRoute } from '@react-navigation/native';

//Edit project function
export default function EditProjectScreen() {

    //get the DocId from TaskScreen function in home.js
    const route = useRoute();
    const ProjectdocId = route.params?.DocId;
    const TeamDocId = route.params?.TeamDocId;

    const [projectName, setProjectName] = useState('');
    const [projectColour, setProjectColour] = useState('')

    const [folderInfo, setFolderInfo] = useState([]);
    
    const [folderValue, setFolderValue] = useState('');

    useEffect(()=>{
        getFolder();
        getProjectInfo();
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


    //get the Folder details from Folders collection 
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
            console.log(doc.data())
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
            console.log('Fail to get the folders: ', error);

        }
    
    };

    //get the project details from the Projects collection
    const getProjectInfo = async() => {
        try{
            const db = getFirestore(app);
            //Projects collection from firebase db
            const ProjectCollection = doc(db, 'Projects', TeamDocId);
            //Projects sub collection based on the team's DocId
            const ProjectSubCollection = collection(ProjectCollection, 'Projects');

            //get the project details
            const ProjectQuery = query(ProjectSubCollection, where('DocId', '==', ProjectdocId));
            const ProjectsSnapShot = await getDocs(ProjectQuery);
            const Projects = []
            //save the project details to the array
            ProjectsSnapShot.forEach((doc) => {
                const {DocId, Project_Name, Folder,Colour} = doc.data()
                Projects.push({
                DocId: DocId,
                Project_Name: Project_Name,
                Folder: Folder,
                Colour: Colour
            });
            });

            //save the elements from the array to each state respectively
            setProjectName(Projects[0].Project_Name)
            setFolderValue(Projects[0].Folder);
            setProjectColour(Projects[0].Colour)
        }
        catch (error)
        {
            console.log("Unable to get the project info", error);
        }
    };

    //allow members to edit project details
    const UpdateProject = async() => {
        try{
            //display alert message if project name field is empty
            if (!projectName.trim())
                {
                Alert.alert("Project name must not be blank!");
                }
            else {
                const db = getFirestore(app);
                //Projects collection from firebase db
                const ProjectCollection = doc(db, 'Projects', TeamDocId);
                //Projects sub collection based on the team's DocId
                const ProjectSubCollection = collection(ProjectCollection, 'Projects')
    
                //get the project details 
                const ProjectQuery = query(ProjectSubCollection, where('DocId', '==', ProjectdocId));
                const ProjectsSnapShot = await getDocs(ProjectQuery);

                //update the project details
                ProjectsSnapShot.forEach((doc)=>{
                    updateDoc(doc.ref, {Project_Name: projectName, Folder: folderValue, Colour: projectColour});
                    Alert.alert('Project updated.');
                    console.log('Project updated', ProjectdocId);
                })
            }
        }
        catch(error)
        {
            console.log("Fail to update project info", error)
        }
    };

    return (
        <SafeAreaView style={styles.SafeAreaView}>
          <View style={styles.container}>
            <View style={styles.textcon}>
              <View style={styles.textsubcon}>
                <Text style={styles.TextContainer}>Edit {projectName} </Text>
              </View>
              <ScrollView contentContainerStyle={{paddingBottom: 100}} >
                <TextInput style={styles.textinput}  defaultValue ={projectName} onChangeText={(value)=>setProjectName(value)} />
               
                <View>
                <Text style={styles.txt}>Folder:</Text>
              <RNPickerSelect 
                placeholder={Folderplaceholder} 
                items={Folderoptions} 
                onValueChange={(value)=>setFolderValue(value)}
                value={folderValue}
                style={styles}
                useNativeAndroidPickerStyle={false}
                /> 
            </View>

            <View>
            <Text style={styles.txt}>Select colour:</Text>
                <ColorPicker
                    color={projectColour}
                    onColorChangeComplete={(color) => setProjectColour(color)}
                    noSnap={true}
                    row={false}
                    swatches={false}
                    useNativeDriver={false}
                    useNativeLayout={false}
                    style={styles.ColourStyle}
                />
                </View>
                <View style={styles.Projbuttoncontainer}>
                <TouchableOpacity  style={styles.Projbutton}>
                <Text style={styles.ProjbuttonText} onPress={UpdateProject}>Save</Text>
                </TouchableOpacity>
                </View> 
                    </ScrollView>
              </View>
              </View>
              </SafeAreaView>
    )

}