import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import React, {useEffect, useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator , HeaderBackButton} from '@react-navigation/native-stack';

import LandingScreen from './screens/landingscreen.js'
import WelcomeScreen from './screens/welcome.js';
import SignUpScreen from './screens/signup.js';
import LoginScreen from './screens/login.js';
import ResetPasswordScreen from './screens/resetpassword.js';
import HomeScreen from './screens/home.js';
import CreateTaskScreen  from './screens/createtask.js';
import EditTaskScreen from './screens/edittask.js';
import ManageCategoriesScreen from './screens/managecategories.js';
import CreateTeamScreen from './screens/createteam.js';
import TeamScreen from './screens/team.js';
import TeamListScreen from './screens/teamlist.js';
import CreateProjectScreen from './screens/createproject.js';
import ManageFoldersScreen from './screens/managefolders.js';
import EditProjectScreen from './screens/editproject.js';
import MemberListScrren from './screens/memberlist.js';
import ProjectTasksScreen from './screens/projecttasks.js';
import CreateProjectTaskScreen from './screens/createprojtask.js';
import EditProjectTaskScreen from './screens/editprojecttask.js';



export default function App (navigation) {

  const Stack = createNativeStackNavigator();

  
  //navigation for all the screens
  return (
    <NavigationContainer>
    <Stack.Navigator >
      <Stack.Screen name="Taskio" component={LandingScreen} options={{headerShown: false}} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{headerShown: false}}/>
      <Stack.Screen name="Signup" component={SignUpScreen} options={{ headerTransparent: true, headerTitle:'', headerStyle: {backgroundColor: '#BEFDBE'}, headerShadowVisible: false}}/>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerTransparent: true, headerTitle:'', headerStyle: {backgroundColor: '#BEFDBE'}, headerShadowVisible: false}}/>
      <Stack.Screen name="ResetPwd" component={ResetPasswordScreen} options={{ headerTransparent: true, headerTitle:'', headerStyle: {backgroundColor: '#BEFDBE'}, headerShadowVisible: false}}/>
      <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
      <Stack.Screen name="CreateTask" component={CreateTaskScreen} options={{headerTransparent: true, headerTitle:'', headerStyle: {backgroundColor: 'white'}, headerShadowVisible: false}}/>
      <Stack.Screen name="ManageCategories" component={ManageCategoriesScreen} options={{headerTransparent: true, headerTitle:'', headerStyle: {backgroundColor: 'white'}, headerShadowVisible: false}}/>
      <Stack.Screen name="EditTask" component={EditTaskScreen}  options={{headerTransparent: true, headerTitle:'', headerStyle: {backgroundColor: 'white'}, headerShadowVisible: false}}/>
      <Stack.Screen name="CreateTeam" component={CreateTeamScreen} options={{headerTransparent: true, headerTitle:'', headerStyle: {backgroundColor: 'white'}, headerShadowVisible: false}}/>
      <Stack.Screen name="Team" component={TeamScreen}  options={{ headerTransparent: true, headerTitle:'', headerStyle: {backgroundColor: 'white'}, headerShadowVisible: false}}/>
      <Stack.Screen name="TeamList" component={TeamListScreen}  options={{ headerTransparent: true, headerTitle:'', headerStyle: {backgroundColor: 'white'}, headerShadowVisible: false}}/>
      <Stack.Screen name="CreateProject" component={CreateProjectScreen} options={{headerTransparent: true, headerTitle:'', headerStyle: {backgroundColor: 'white'}, headerShadowVisible: false}}/>
      <Stack.Screen name="ManageFolders" component={ManageFoldersScreen} options={{headerTransparent: true, headerTitle:'', headerStyle: {backgroundColor: 'white'}, headerShadowVisible: false}}/>
      <Stack.Screen name="EditProject" component={EditProjectScreen}  options={{headerTransparent: true, headerTitle:'', headerStyle: {backgroundColor: 'white'}, headerShadowVisible: false}}/>
      <Stack.Screen name="MemberList" component={MemberListScrren}  options={{headerTransparent: true, headerTitle:'', headerStyle: {backgroundColor: 'white'}, headerShadowVisible: false}}/>
      <Stack.Screen name="ProjectTasks" component={ProjectTasksScreen}  options={{headerTransparent: true, headerTitle:'', headerStyle: {backgroundColor: 'white'}, headerShadowVisible: false}}/>
      <Stack.Screen name="CreateProjectTask" component={CreateProjectTaskScreen} options={{headerTransparent: true, headerTitle:'', headerStyle: {backgroundColor: 'white'}, headerShadowVisible: false}}/>
      <Stack.Screen name="EditProjectTask" component={EditProjectTaskScreen} options={{headerTransparent: true, headerTitle:'', headerStyle: {backgroundColor: 'white'}, headerShadowVisible: false}}/>
    
    </Stack.Navigator>
  </NavigationContainer>
  
  )
}
