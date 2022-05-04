import { StyleSheet, Text, View,TextInput,TouchableHighlight,Alert,BackHandler } from 'react-native'
import React from 'react'
import ImageBackground from 'react-native/Libraries/Image/ImageBackground'
import { fireAuth,fireFunc } from '../firebase';
import { signOut, updatePassword } from 'firebase/auth';
import ValidationComponent from 'react-native-form-validator';
import HideWithKeyboard from 'react-native-hide-with-keyboard';
import { useEffect, useState } from 'react/cjs/react.development';
import { httpsCallable } from 'firebase/functions';
import {getGlobalState,setGlobalState} from '../global';

const deleteAccount = httpsCallable(fireFunc, 'deleteAccount');

const HomeScreen = ({navigation}) => {
  const handleBackButton = () => {
    Alert.alert('Exit','Are you sure you want to exit?',[
      {text: 'No', onPress: () => {}, style: 'cancel'},
      {text: 'Yes', onPress: () => BackHandler.exitApp()},
    ]);
    return true;
  }

  useEffect(()=>{
    const back = BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () => {
      back.remove();  
    };
  },[]);

  const [password, setPassword] = useState('');

  const handleSignOut = () => {
    signOut(fireAuth).then(()=>{
      navigation.navigate('AuthHandler');
      setGlobalState('userData',{
        username: '',
        firstName: '',
        lastName: '',
        phone: ''
      });
      setGlobalState('needUpdate',true);
    })
  }

  const handleChangePassword = ()=>{
    updatePassword(fireAuth.currentUser,password).then(()=>{
      Alert.alert('Password Updated','Please login with your new password');
      signOut(fireAuth).then(()=>{
        navigation.navigate('AuthHandler');
      });
    });
  }
  
  return (
    <ImageBackground source={require('../images/streets.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
          <Text 
          style={styles.buttonText}>
          Welcome, {getGlobalState('userData').firstName.concat(" ",getGlobalState('userData').lastName,"!")}</Text>
        <Text
        style={styles.fieldLabel}
        >Change password</Text>

        <TextInput
        style={styles.input}
        secureTextEntry
        onChangeText={setPassword}
        placeholder={'New password'}
        placeholderTextColor={'#aaaaaa'}
        />

        <TouchableHighlight
        onPress={handleChangePassword}
        style={styles.button}
        underlayColor={'#22e6ab'}
        >
            <Text
            style={styles.buttonText}
            >Submit</Text>
        </TouchableHighlight>

        <TouchableHighlight
        onPress={()=>{navigation.navigate('ProfileSetup')}}
        style={styles.button}
        underlayColor={'#22e6ab'}
        >
            <Text
            style={styles.buttonText}
            >Edit Profile</Text>
        </TouchableHighlight>


        <TouchableHighlight
        onPress={handleSignOut}
        style={styles.button}
        underlayColor={'#22e6ab'}
        >
            <Text
            style={styles.buttonText}
            >Sign out</Text>
        </TouchableHighlight>

        <TouchableHighlight
        onPress={()=>{
          Alert.alert(
            'Delete your account?',
            'This action cannot be undone.',
            [
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'OK', onPress: () => {
                deleteAccount().then(()=>{
                  fireAuth.signOut().then(()=>{
                    navigation.navigate('AuthHandler')
                  });
                });
              }},
            ],
            { cancelable: false }
          )
        }}
        style={styles.button}
        underlayColor={'#22e6ab'}
        >
            <Text
            style={[styles.buttonText,{
              color:'red',
            }]}
            >Delete account</Text>
        </TouchableHighlight>

      </View>
    </ImageBackground>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  backgroundImage:{
      height: '100%',
      backgroundColor:'#203b38'
  },
  logo:{
      height:120,
      resizeMode: 'contain',
      marginBottom:20,
  },  
  container: {
      paddingVertical: 50,
      paddingHorizontal: 30,
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
  },
  input: {
      color:'white',
      backgroundColor: "#0c1f1c",
      paddingHorizontal: 15,
      paddingVertical: 15,
      borderRadius: 10,
      marginTop: 10,
      borderWidth:2,
      borderColor:'#22e6ab',
      fontSize:20,
      width:'100%'
  },
  inputContainer: {
      width:'80%',
      paddingTop:40
  },
  buttonContainer: {
      width:"60%",
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 40,
      marginTop: 20
  },
  button: {
      backgroundColor: '#2c472e',
      width: "100%",
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 15,
      borderColor: '#22e6ab',
      borderWidth: 2,
  },
  buttonText: {
      color: '#e6e6e6',
      fontWeight: '700',
      fontSize: 20,
  },
  hyperlink: {
      color: '#086dcc',
      fontWeight: '700',
      fontSize: 16,
      alignSelf: 'center',
      marginBottom:60
  },
  error: {
      color: 'red',
      fontSize: 12,
      marginTop: 5,
      marginBottom: 5
  },
  fieldLabel: {
    color: 'white',
    fontSize: 20,
    marginTop: 10
  }
})