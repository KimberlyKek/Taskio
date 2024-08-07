import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, SafeAreaView, TouchableOpacity, TextInput, Alert, FlatList,RefreshControl,Modal} from 'react-native';
import { Separator } from 'react-native-tableview-simple';
import {Menu, MenuProvider, MenuOptions, MenuOption,MenuTrigger} from 'react-native-popup-menu';
import React, {useEffect, useState} from 'react';
import { getAuth} from 'firebase/auth';
import {app} from "../firebaseConfig.js"
import styles from '../css/ManageCategoriesCss.js'
import { getDocs, collection,getFirestore,query, where, push, deleteDoc,updateDoc, doc} from 'firebase/firestore';

//Manage categories function
export default function ManageCategoriesScreen() {

  //retrieves the authentication state
  const auth = getAuth();
  //get the current user authentication state
  const user = auth.currentUser;

  //For getting category details from firebase
  const [categoryinfo, setCategoryInfo] = useState([]);
  //Refresh data
  const [refreshing, setRefreshing] = useState(false);
  //visibility setting for modal
  const [modalVisible, setModalVisible] = useState(false);
 
  const [editCategory, setEditCatergory] = useState('');
  //DocId for edit category
  const [EditDocId, setEditDocId] = useState('');
  //DocId for delete category
  const [DeleteDocId, setDeleteDocId] = useState('');


  useEffect(()=>{
      getCategory();
    },[]);

  //get the category details from Category collection based on the user id
  const getCategory = async () => {

    try{
      const db = getFirestore(app);
      //Category main collection from firebase db
      const CategoryCollection = doc(db, 'Category', user.uid);
      //Category sub collection based on the user's id
      const CategorySubCollection = collection(CategoryCollection, 'Category')

      //get the category details from the sub collection
      const CategorySnapShot = await getDocs(CategorySubCollection);
      const Category = [];
      //save the category details to Category array
      CategorySnapShot.forEach((doc) => {
      const {Category_Title, DocId} = doc.data();
      Category.push({
          Category: Category_Title,
          DocId: DocId
      });
      });
      //save the category details from the array to setCategoryInfo state
      setCategoryInfo(Category);

    }
    catch(error)
    {
      console.log('Fail to get the category details: ', error);
    };

  };


  // delete category in the firebase collection based on category's DocId
  const deleteCategory = async () => {
    try{
        const db = getFirestore(app);
        //Category main collection from firebase db
        const CategoryCollection = doc(db, 'Category', user.uid);
        //Category sub collection based on the user's id
        const CategorySubCollection = collection(CategoryCollection, 'Category')
        //get the category details based on the DocId from the sub collection
        const CategoryQuery = query(CategorySubCollection, where('DocId', '==', DeleteDocId));
        const CategorySnapShot = await getDocs(CategoryQuery);
        //delete the category
        CategorySnapShot.forEach((doc)=>{
          deleteDoc(doc.ref);
            
           Alert.alert("Category deleted.");
           console.log("Category deleted: ", DeleteDocId);
        });
       
    }
    catch (error)
    {
        console.log("Failed to delete category: ", error);
    }
  };

  //edit category details based on the category's DocId
  const updateCategory = async () => {
        try{
          const db = getFirestore(app);
          //Category main collection from firebase db
          const CategoryCollection = doc(db, 'Category', user.uid);
          const CategorySubCollection = collection(CategoryCollection, 'Category')
          //get the category details based on the DocId
          const CategoryQuery = query(CategorySubCollection, where('DocId', '==', EditDocId));
          const CategorySnapShot = await getDocs(CategoryQuery);
          //Update the category details
          CategorySnapShot.forEach((doc)=>{
              updateDoc(doc.ref,{Category_Title: editCategory});

              Alert.alert("Category updated.");
              console.log("Category updated: ", DocIdInfo);
          });
          
      }
      catch (error)
      {
          console.log("Failed to update category: ", error);
      }
    };
  //-----------------------------------------------------------------------------------------
  //Confirm message for delete category
  ConfirmAlert =(DocId) => {
    //save the category's DocId to setDeleteDocId state. User has to press delete twice as the DocId is not saved to the state when first pressed
    setDeleteDocId(DocId);
    Alert.alert(
      'Confirmation',
      'Are you sure you want to delete this category? (Press delete twice)',
      [
        {text: 'Yes', onPress:()=>deleteCategory(DocId)},
        {text: 'Cancel', styles: 'cancel'}
      ]
    );

  };

//-------------------------------------------------------------------------------------------
  //Create CategoryItem constant to display the category data
  const CategoryItem = ({ Category, DocId }) => (
      <View>
        <MenuProvider skipInstanceCheck>
          <Text style={styles.CatItem}>{Category} </Text>
          <View>
            <Menu style={styles.CategoryMenuCon}>
              <MenuTrigger >
                <Image style={styles.kebabImg} source={require('../assets/images/kebabmenu.png')}/>
              </MenuTrigger>
              <MenuOptions customStyles={{optionsContainer: styles.CategoryMenu}}>
                <MenuOption onSelect={()=>{ConfirmAlert(DocId)}} value='Delete' text='Delete' customStyles={{optionWrapper: styles.CategoryOptions}}  />
                <MenuOption onSelect={() => {setModalVisible(!modalVisible), setEditCatergory(Category), setEditDocId(DocId)} }value='Edit' text='Edit' customStyles={{optionWrapper: styles.CategoryOptions}}/>
              </MenuOptions>
                  
              </Menu>
          </View>
        </MenuProvider>
      </View>
    );

  //render the category data
  const renderCategoryItem = ({ item }) => (
      <CategoryItem Category={item.Category} DocId={item.DocId} />
  );

  //Display message if no category created
  const emptyCategoryinfo = () =>
    {
      return(
        <View style={styles.container}>
          <View>
            <Text style={styles.categoryStyle}>You have not created category.</Text>
          </View>
        </View>
      )
    };

  //allow user to refresh the category list when there is an update
  const onRefresh = React.useCallback(() => {
  setRefreshing(true);
  setTimeout(()=> {
      getCategory();
      setRefreshing(false);
  },2000);
  },[],);

  return(
      <SafeAreaView style={styles.SafeAreaView}>
          <View style={styles.container}>
            <View style={styles.textcon}>
                <Text style={styles.TextContainer}>Manage Categories</Text>
            </View>
            <View style={styles.CategoryTxtCon}>
                <Text style={styles.CategoryTxt}>Categories display on homepage</Text>
            </View>

            <View style={{top:"12%"}}>
                {categoryinfo && (
                  <FlatList
                    data={categoryinfo}
                    renderItem={renderCategoryItem}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
                    ItemSeparatorComponent={Separator}
                    keyExtractor={(item, index)=> item.DocId}
                    ListEmptyComponent={emptyCategoryinfo}
                    />
                )}
            </View>

            <Modal animationType="slide"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => {setModalVisible(!modalVisible)}}>
              <View style={styles.modalView}>
                <Text style={styles.CatTextContainer}>Edit category</Text>
                <TextInput style={styles.textinput}  defaultValue ={editCategory} onChangeText={(value)=> setEditCatergory(value)} />
          
                <View style={styles.Catbuttoncontainer}>
                  <View>
                    <TouchableOpacity  style={styles.Catbutton}>
                      <Text style={styles.CatbuttonText} onPress={updateCategory}>Update</Text>
                    </TouchableOpacity>
                  </View>
                  <View>
                    <TouchableOpacity  style={styles.Catbutton}>
                      <Text style={styles.CatbuttonText}  onPress={() => setModalVisible(!modalVisible)}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>


          </View>

      </SafeAreaView>
  )
}