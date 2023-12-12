// StartScreen.js
import React from 'react';
import { View, StyleSheet, Image, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ThemedButton } from "react-native-really-awesome-button";

const StartScreen = ({ navigation }) => {

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <View>
        <Image style={styles.logoWhite} source={require('../../assets/img/logo-ecomente-quiz-white.png')} />
      </View>
      <ThemedButton name="bruce" type="secondary"
        style={styles.btnAnima} onPress={() => navigation.navigate('PlayerScreen')}
        >START</ThemedButton>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#1785eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnStart:{
    margin: 8,
    height: 55,
    width: 200,
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderBottomColor: 'yellow',
    borderBottom: 3,
    borderRadius: 22,
    padding: 7,
    position: 'relative',
    bottom: 60,  
    borderStyle: 'solid',
    borderBottomWidth: 10,
    borderBottomEndRadius: 10,  
  },
  logoWhite:{
    width: 350,
    height: 350,
    position: 'relative',
    bottom: 80,
  },

})

export default StartScreen;