import { StyleSheet, Text, View,KeyboardAvoidingView, TextInput,TouchableHighlight,Alert,BackHandler } from 'react-native'
import React from 'react'
import { useEffect, useState } from 'react/cjs/react.development'
import { useValidation } from 'react-native-form-validator';

import {getGlobalState,setGlobalState} from '../global';

import { fireFunc } from '../firebase';
import { httpsCallable } from 'firebase/functions';
import ImageBackground from 'react-native/Libraries/Image/ImageBackground';

const insertProfile = httpsCallable(fireFunc, 'insertProfile');

const ProfileSetup = ({navigation}) => {
  
  const handleBackButton = () => {
    if(getGlobalState('needUpdate')){
      navigation.navigate('AuthHandler');
    }else{
      navigation.navigate('HomeScreen');
    }
    return true;
  }

  useEffect(() => {
    const back = BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () => {
      back.remove();
    };
  }, []);

  const [username,setUsername] = useState('');
  const [firstName,setFirstName] = useState('');
  const [lastName,setLastName] = useState('');
  const [phone,setPhone] = useState('');

  const { validate, isFieldInError, getErrorMessages} =
    useValidation({
      state: { firstName, lastName, username, phone }
    });
  
  useEffect(()=>{
    if(!getGlobalState('needUpdate')){
      setUsername(getGlobalState('userData').username);
      setFirstName(getGlobalState('userData').firstName);
      setLastName(getGlobalState('userData').lastName);
      setPhone(getGlobalState('userData').phone);
    }
  },[]);

  const handleSubmit = () => {
    if( validate({
          firstName: { minlenth: 3, maxlength: 15, required: true },
          lastName: { minlenth: 3, maxlength: 15, required: true },
          username: { minlenth: 3, maxlength: 20,required: true },
          phone: { minlength: 10, maxlength: 10, numbers: true, required: true },
        }) ){
          //insert profile
          insertProfile({
            username: username,
            firstName: firstName,
            lastName: lastName,
            phone: phone
          }).then(response=>{
            if(response.data['status']==0){
              //success
              setGlobalState('userData',{
                username: username,
                firstName: firstName,
                lastName: lastName,
                phone: phone
              });
              setGlobalState('needUpdate',false);
              navigation.navigate('HomeScreen');
            }else{
              //failed, alert with error message
              Alert.alert('Profile update failed',response.data['message']);
            }
          }).catch(error=>{
            console.log("signup error");
            console.log(error);
          });
        }
  };

  return (
    <ImageBackground source={require('../images/streets.png')} style={styles.backgroundImage}>
      <KeyboardAvoidingView
      style={styles.container}
      >
        <TouchableHighlight
        style={[styles.button,{width: 100}]}
        onPress={handleBackButton}
        >
          <Text
          style={styles.buttonText}
          >Back</Text>
          </TouchableHighlight>
        <View style={styles.inputContainer}>
          <TextInput
          style={styles.input}
          defaultValue={username}
          onChangeText={setUsername}
          placeholder={'Username'}
          placeholderTextColor={'#aaaaaa'}
          />
          {isFieldInError('username') && <Text style={styles.error}>*Username must be between 3 and 20 characters!</Text>}
          <TextInput
          style={styles.input}
          defaultValue={firstName}
          onChangeText={setFirstName}
          placeholder={'First Name'}
          placeholderTextColor={'#aaaaaa'}
          />
          {isFieldInError('firstName') && <Text style={styles.error}>*First Name must be between 3 and 15 characters!</Text>}
          <TextInput
          style={styles.input}
          defaultValue={lastName}
          onChangeText={setLastName}
          placeholder={'Last Name'}
          placeholderTextColor={'#aaaaaa'}
          />
          {isFieldInError('lastName') && <Text style={styles.error}>*Last Name must be between 3 and 15 characters!</Text>}
          <TextInput
          style={styles.input}
          defaultValue={phone}
          onChangeText={setPhone}
          placeholder={'Phone number'}
          placeholderTextColor={'#aaaaaa'}
          />
          {isFieldInError('phone') && <Text style={styles.error}>*Phone number must have 10 digits!</Text>}
          <TouchableHighlight
          onPress={()=>{handleSubmit();}}
          style={styles.button}
          underlayColor={'#22e6ab'}
          >
            <Text
            style={styles.buttonText}
            >Submit</Text>
          </TouchableHighlight>
        </View>
      </KeyboardAvoidingView>
   </ImageBackground>
  )
}

export default ProfileSetup

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
      width:'100%',
      
  },
  inputContainer: {
      width:'100%',
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