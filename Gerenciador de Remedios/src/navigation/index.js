import { Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Welcome from '../screens/Welcome';
import SignIn from '../screens/SignIn';
import Lista from '../screens/Lista';
import Resumo from '../screens/Resumo';
import Cadastro from '../screens/Cadastro';
import Historico from '../screens/Historico';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const PRIMARY = '#2D9C95';

function TabIcon({ symbol, color }) {
  return <Text style={{ fontSize: 20, color }}>{symbol}</Text>;
}

function TabNavigate() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: PRIMARY,
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        tabBarStyle: {
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: '#F3F4F6',
        },
      }}
    >
      <Tab.Screen
        name="Lista"
        component={Lista}
        options={{
          title: 'Remédios',
          tabBarIcon: ({ color }) => <TabIcon symbol="💊" color={color} />,
        }}
      />
      <Tab.Screen
        name="Historico"
        component={Historico}
        options={{
          title: 'Histórico',
          tabBarIcon: ({ color }) => <TabIcon symbol="📊" color={color} />,
        }}
      />
      <Tab.Screen
        name="Resumo"
        component={Resumo}
        options={{
          title: 'Resumo',
          tabBarIcon: ({ color }) => <TabIcon symbol="📈" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
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