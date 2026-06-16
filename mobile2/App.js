// import Login from "./Screens/Login";
// import Home from "./Screens/Home";
// import { createStackNavigator } from '@react-navigation/stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { NavigationContainer } from "@react-navigation/native";
// import Home from "./Screens/AddProduct";

// function TabNavigator(){
//   const Tab = createBottomTabNavigator();
//   return(
//     <Tab.Navigator>
//       <Tab.Screen  name ="Home" component={Home}/>
//       <Tab.Screen  name ="AddProduct" component={AddProduct}/>
//     </Tab.Navigator>
//   )
// }


// export default function App() {
//   const Stack = createStackNavigator();
//   return (
//     <NavigationContainer>
//       <Stack.Navigator screenOptions={{headerShown:false}}>
//         <Stack.Screen name="Login" component={Login}/>
//         <Stack.Screen name="Home" component={TabNavigator}/> 
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

import React from 'react';
import { StatusBar } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import Routes from './scr/routes';

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#38A69D" barStyle="light-content"/>
      <Routes />
    </NavigationContainer>
  );
}

