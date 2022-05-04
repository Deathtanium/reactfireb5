import { StyleSheet, Text, View,Image,Alert } from 'react-native'
import React,{useState,useEffect} from 'react'
import { KeyboardAvoidingView, TextInput, TouchableHighlight,TouchableOpacity } from 'react-native'
import { useValidation,customValidationMessages } from 'react-native-form-validator';
import ImageBackground from 'react-native/Libraries/Image/ImageBackground';
import HidewithKeyboard from 'react-native-hide-with-keyboard';

import {fireAuth} from '../firebase';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';

const AuthHandler = ({navigation}) => {
  
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(fireAuth,user => {
            if(user){
                navigation.navigate('HomeScreen');
            }
        });
        return unsubscribe;
    });
        

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const {validate, isFieldInError,getErrorsInField} = useValidation({
        state:{ email, password },
        messages: customValidationMessages
    });

    const validateInput = function(){
        return validate({
            email: { required: true, email: true },
            password: { required: true, minLength: 6}
        });
    }

    const handleSignIn = () => {
        if(validateInput()){
            signInWithEmailAndPassword(fireAuth,email,password).then(()=>{
                console.log('success');
            }).catch(error=>{
                console.log(error);
                Alert.alert("Authentication failed",error.message);
            });
        }
    };

    const handleSignUp = () => {
        if(validateInput()){
            createUserWithEmailAndPassword(fireAuth,email,password).then(()=>{
                console.log('success');
            }).catch(error=>{
                console.log(error);
                Alert.alert("Registration failed",error.message);
            });
        }
    }
    
    return (
        <ImageBackground source={require('../images/streets.png')} style={styles.backgroundImage}>
            <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
            >
                <HidewithKeyboard><Image source={require('../images/Logo.png')} style={styles.logo} /></HidewithKeyboard>
    
                <View style={styles.inputContainer}>
                    <TextInput
                    placeholder="Email"
                    placeholderTextColor={'#bababa'}
                    //value={''}
                    onChangeText={setEmail}
                    style={styles.input}
                    />
                    {isFieldInError('email') && getErrorsInField('email').map(errorMessage => <Text style={styles.error}>{errorMessage}</Text>)}

                    <TextInput
                    placeholder="Password"
                    placeholderTextColor={'#bababa'}
                    secureTextEntry
                    //value={''}
                    onChangeText={setPassword}
                    style={styles.input}
                    />
                    {isFieldInError('password') && getErrorsInField('password').map(errorMessage => <Text style={styles.error}>{errorMessage}</Text>)}
                </View>
                
                <View
                style={styles.buttonContainer}
                >
                    <TouchableHighlight
                    onPress={()=>{handleSignIn()}}
                    style={styles.button}
                    underlayColor={'#22e6ab'}
                    >
                        <Text
                        style={styles.buttonText}
                        >Login</Text>
                    </TouchableHighlight>

                    <TouchableHighlight
                    onPress={()=>{handleSignUp()}}
                    style={styles.button}
                    underlayColor={'#22e6ab'}
                    >
                        <Text
                        style={styles.buttonText}
                        >Register</Text>
                    </TouchableHighlight>

                </View>
            </KeyboardAvoidingView>
            <TouchableOpacity>
                <Text
                style={styles.hyperlink}
                >Forgot password?</Text>
            </TouchableOpacity>
        </ImageBackground>
    );
}

export default AuthHandler

const styles = StyleSheet.create({
    backgroundImage:{
        height: '100%',
        backgroundColor:'#203b38'
    },
    logo:{
        height:120,
        resizeMode: 'contain',
        marginTop:100,
    },  
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        
    },
    inputContainer: {
        width:'80%',
        paddingTop:100
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
    }
})