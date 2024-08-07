import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, SafeAreaView, TouchableOpacity, TextInput, Alert, FlatList,RefreshControl,Modal} from 'react-native';
import { Separator } from 'react-native-tableview-simple';
import {Menu, MenuProvider, MenuOptions, MenuOption,MenuTrigger} from 'react-native-popup-menu';
import React, {useEffect, useState} from 'react';
import { getAuth} from 'firebase/auth';
import {app} from "../firebaseConfig.js"
import styles from '../css/ManageFolderCss.js'
import {useRoute } from '@react-navigation/native';
import { getDocs, collection,getFirestore,query, where, deleteDoc,updateDoc, doc} from 'firebase/firestore';

//Manage folders function
export default function ManageFoldersScreen() {

    //retrieves the authentication state
    const auth = getAuth();
    //get the current user authentication state
    const user = auth.currentUser;

    //get the DocId from TaskScreen function in home.js
    const route = useRoute();
    const TeamDocId = route.params?.TeamDocId;

    //Folder DocId for update
    const [UpdateDocId, setUpdateDocId] = useState('');
    //Folder DocId for delete
    const [DeleteDocId, setDeleteDocId] = useState('');

    const [folderInfo, setFolderInfo] = useState([]);
    const [editFolder, setEditFolder] = useState('');

    //For refresh data
    const [refreshing, setRefreshing] = useState(false);
    //visibility setting for modal
    const [modalVisible, setModalVisible] = useState(false);


    useEffect(() => {
        getFolder();
    },[]);

    //get the folder details from Folders collection
    const getFolder = async () => {
        try{

            const db = getFirestore(app);
            //Folders collection from firebase db
            const FolderCollection = doc(db, 'Folders', TeamDocId);
            //Folders sub collection based on the team's DocId
            const FolderSubCollection = collection(FolderCollection, 'Folders');
        
            //Get the folders details 
            const FolderSnapShot = await getDocs(FolderSubCollection);
            const Folders = []
            //save the folders details to the array
            FolderSnapShot.forEach((doc) => {
            const {Folder_Name, DocId} = doc.data()
            Folders.push({
                Folder_Name: Folder_Name,
                DocId: DocId
            });
            });
            //save the array to the setFolderInfo state
            setFolderInfo(Folders);
        
        
            return() => getFolder(Folders);
        }
        catch(error)
        {
            console.log('Fail to get all the folders: ', error);
        }
        
    };

    //allow members to edit folder details
    const UpdateFolder = async () => {

        try{

            const db = getFirestore(app);
            //Folders collection from firebase db
            const FolderCollection = doc(db, 'Folders', TeamDocId);
            //Folders sub collection based on the team's DocId
            const FolderSubCollection = collection(FolderCollection, 'Folders')
        
            //get the folders details based on the folder's DocId
            const FolderQuery = query(FolderSubCollection, where('DocId', '==', UpdateDocId));
            const FolderSnapShot = await getDocs(FolderQuery);

            //Update the folder details
            FolderSnapShot.forEach((doc)=>{
                updateDoc(doc.ref,{Folder_Name: editFolder});

                Alert.alert("Folder updated.");
                console.log("Folder updated: ", UpdateDocId);
            });
        }
        catch(error)
        {
            console.log("Fail to update folder", error);
        }
       
    };

    //allow members to delete the folders
    const DeleteFolder = async () => {
        try{

            const db = getFirestore(app);
            //Folders collection from firebase db
            const FolderCollection = doc(db, 'Folders', TeamDocId);
            //Folders sub collection based on the team's DocId
            const FolderSubCollection = collection(FolderCollection, 'Folders')
        
            //get the folder details based on the folder's DocId
            const FolderQuery = query(FolderSubCollection, where('DocId', '==', DeleteDocId));
            const FolderSnapShot = await getDocs(FolderQuery);

            //Delete the folder
            FolderSnapShot.forEach((doc)=>{
                deleteDoc(doc.ref);

                Alert.alert("Folder deleted.");
                console.log("Folder deleted: ", DeleteDocId);
            });
        }
        catch(error)
        {
            console.log("Fail to delete folder", error);
        }
    };
//-------------------------------------------------------------------------------------------

    //Create FolderItem constant to display the folders data
    const FolderItem = ({Folder_Name, DocId}) =>
    (
        <View>
            <MenuProvider skipInstanceCheck>
            <Text style={styles.FolderItem}>{Folder_Name}</Text>
            <View>
                <Menu style={styles.FolderMenuCon}>
                <MenuTrigger>
                    <Image style={styles.kebabImg} source={require('../assets/images/kebabmenu.png')}/>
                </MenuTrigger>
                <MenuOptions customStyles={{optionsContainer: styles.FolderMenu}}>
                    <MenuOption onSelect={()=>{ConfirmAlert(DocId)}} value='Delete' text='Delete' customStyles={{optionWrapper: styles.FolderOptions}}  />
                    <MenuOption onSelect={() => {setModalVisible(!modalVisible), setEditFolder(Folder_Name), setUpdateDocId(DocId)} }value='Edit' text='Edit' customStyles={{optionWrapper: styles.FolderOptions}}/>
                </MenuOptions>
                    
                </Menu>
            </View>
            </MenuProvider>
        </View>
    );

    //render the folders data
    const renderFolderItem = ({ item }) => (
        <FolderItem Folder_Name={item.Folder_Name} DocId={item.DocId} />
    );


    //Display message if no folder created
    const emptyFolderInfo = () =>
    {
        return(
            <View style={styles.container}>
            <View>
                <Text style={styles.categoryStyle}>You have not created folder.</Text>
            </View>
            </View>
        )
    };

    //Confirm message for delete folder
    ConfirmAlert =(DocId) => {
        //save the folder's DocId to setDeleteDocId state. User has to press delete twice as the DocId is not saved to the state when first pressed
        setDeleteDocId(DocId);
        Alert.alert(
        'Confirmation',
        'Are you sure you want to delete this folder? (Press delete twice)',
        [
            {text: 'Yes', onPress:()=>DeleteFolder(DocId)},
            {text: 'Cancel', styles: 'cancel'}
        ]
        );

    };

    //allow user to refresh the folder list when there is an update
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(()=> {
            getFolder();
            setRefreshing(false);
        },2000);
        },[],);


    return(
        <SafeAreaView style={styles.SafeAreaView}>
            <View style={styles.container}>
                <View style={styles.textcon}>
                    <Text style={styles.TextContainer}>Manage Folders</Text>
                </View>
                <View style={styles.FolderTxtCon}>
                    <Text style={styles.FolderTxt}>Folders display on the team homepage</Text>
                </View>

                <View style={{top:"12%"}}>
                    {folderInfo && (
                        <FlatList
                        data={folderInfo}
                        renderItem={renderFolderItem}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
                        ItemSeparatorComponent={Separator}
                        keyExtractor={(item, index)=> item.DocId}
                        ListEmptyComponent={emptyFolderInfo}
                        />
                    )}
                </View>

                <Modal animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {setModalVisible(!modalVisible)}}>
                    <View style={styles.modalView}>
                    <Text style={styles.FolderTextContainer}>Edit folder</Text>
                    <TextInput style={styles.textinput}  defaultValue ={editFolder} onChangeText={(value)=> setEditFolder(value)} />
                
                    <View style={styles.Folderbuttoncontainer}>
                        <View>
                        <TouchableOpacity  style={styles.Folderbutton}>
                            <Text style={styles.FolderbuttonText} onPress={UpdateFolder}>Update</Text>
                        </TouchableOpacity>
                        </View>
                        <View>
                        <TouchableOpacity  style={styles.Folderbutton}>
                            <Text style={styles.FolderbuttonText}  onPress={() => setModalVisible(!modalVisible)}>Cancel</Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                    </View>
                </Modal>

            </View>
        </SafeAreaView>
    );
    

}