import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, SafeAreaView, TouchableOpacity} from 'react-native';
import React from 'react';
import styles from '../css/LandingCss.js'

// LaunchScreen function
export default function LandingScreen({ navigation}) {
    return (
      <SafeAreaView style={styles.SafeAreaView}>
        <View style={styles.container}>
       
          <View style={styles.textcon}>
            <Text style={styles.TextContainer}>Welcome to Taskio</Text>
            <View style={styles.textsecondcon}>
              <View style={styles.textsubcon}>
                <View>
                  <Image style={styles.image} source={require("../assets/images/task.png")}></Image>
                </View>
                <View>
                  <Text style={styles.TextSubcontainer}> Create Tasks Fast and Easy</Text>
                  <Text style={styles.TextThirdcontainer}> Add tasks, subtasks and repetive tasks</Text>
                </View>
              </View>
              <View style={styles.textsubcon}>
                <View>
                  <Image style={styles.image} source={require("../assets/images/reminder.png")}></Image>
                </View>
                <View>
                  <Text style={styles.TextSubcontainer}> Task Reminders</Text>
                  <Text style={styles.TextThirdcontainer}>{' Set reminders, and never miss important \n  tasks'}</Text>
                </View>
              </View>
              <View style={styles.textsubcon}>
                <View>
                  <Image style={styles.image} source={require("../assets/images/team.png")}></Image>
                </View>
                <View>
                  <Text style={styles.TextSubcontainer}> Team Collaboration</Text>
                  <Text style={styles.TextThirdcontainer}>{' Invite members to join the team, and work \n together'}</Text>
                </View>
              </View>

              <View style={styles.textsubcon}>
                <View>
                  <Image style={styles.image} source={require("../assets/images/analysis.png")}></Image>
                </View>
                <View>
                  <Text style={styles.TextSubcontainer}> Analysis Tasks</Text>
                  <Text style={styles.TextThirdcontainer}> Analysis the tasks in the tasks overview</Text>
                </View>
              </View>
            </View>
            <View style={styles.buttoncontainer}>
              <TouchableOpacity  style={styles.button}>
                <Text style={styles.buttonText} onPress={() => navigation.navigate("Welcome")}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

