import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext'; 
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import Profile from './screens/Profile';
import Game1 from './screens/Game1';
import Games from './screens/Games'; // Prazna komponenta za igre
import LoggedOutView from './components/LoggedOutView';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import Leaderboard from './screens/Leaderboard';


const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();


function LoggedInNavigator() {
  const { user } = useContext(AuthContext); 

  if (!user) {
    return null; 
  }

    return (
      <Drawer.Navigator>
        <Drawer.Screen name="Moj profil" component={Profile} />
        <Drawer.Screen name="Igrice" component={Games} />
        <Drawer.Screen name="Game#1" component={Game1} initialParams={{ userId: user.uid }}  />
        <Drawer.Screen name="Leaderboard" component={Leaderboard} />
      </Drawer.Navigator>
    );
  }
  
  function AuthNavigator() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Dobrodosli" component={LoggedOutView} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    );
  }
  
  export default function Navigation() {
    const { isLoggedIn } = useContext(AuthContext);
  
    return (
      <NavigationContainer>
        {isLoggedIn ? <LoggedInNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    );
  }
