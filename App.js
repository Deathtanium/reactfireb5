import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import AuthHandler from './screens/AuthHandler';
import ProfileSetup from './screens/ProfileSetup';

import * as NavigationBar from 'expo-navigation-bar'
import { fireAuth } from './firebase';

const Stack = createNativeStackNavigator();
NavigationBar.setBackgroundColorAsync('#000000')

export default function App() {

  return (
    <NavigationContainer
      style={
        {
          backgroundColor: '#000000',
        }
      }
    >
      <StatusBar translucent={true} backgroundColor={'transparent'} />
      <Stack.Navigator>
        <Stack.Screen options={{headerShown:false}} name="AuthHandler" component={AuthHandler}/>
        <Stack.Screen options={{headerShown:false}} name="HomeScreen" component={HomeScreen}/>
        <Stack.Screen options={{headerShown:false}} name="ProfileSetup" component={ProfileSetup}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
