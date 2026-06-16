import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Welcome from '../pages/Welcome';
import SignIn from '../pages/SignIn';
import Lista from '../pages/Lista';
import Teste from '../pages/Teste';
import Cadastro from '../pages/Cadastro';

const Stack = createNativeStackNavigator();
const Tab=createBottomTabNavigator();

function TabNavigate(){
  return(
    <Tab.Navigator>
      <Tab.Screen name='Lista' component={Lista}/>
      <Tab.Screen name='Teste' component={Teste}/>
    </Tab.Navigator>
  )
}

export default function Routes() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Welcome"
        component={Welcome}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Home"
        component={TabNavigate}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Cadastro"
        component={Cadastro}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}