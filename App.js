import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import AuthHandler from './screens/AuthHandler';
import ProfileSetup from './screens/ProfileSetup';

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
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
