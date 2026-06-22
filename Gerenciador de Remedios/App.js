import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/navigation';
import { initializeNotifications, addNotificationResponseListener } from './src/services/notifications';
import { addIntakeForNotification } from './src/services/firebase';

export default function App() {
  useEffect(() => {
    initializeNotifications();

    const subscription = addNotificationResponseListener(async (response) => {
      const actionIdentifier = response.actionIdentifier;
      const data = response.notification.request.content.data;

      if (actionIdentifier === 'TAKEN' || actionIdentifier === 'MISSED') {
        await addIntakeForNotification(data, actionIdentifier);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <NavigationContainer>
      <StatusBar backgroundColor="#38A69D" barStyle="light-content" />
      <Routes />
    </NavigationContainer>
  );
}