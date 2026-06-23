import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/navigation';
import {initializeNotifications,addNotificationResponseListener,} from './src/services/notifications'; // initializeNotifications: inicializa/configura as notificações
import { addIntakeForNotification } from './src/services/firebase'; // Importa a função responsável por registrar no Firebase o consumo de um medicamento

export default function App() {
  // Inicializa notificações e registra um listener global para respostas
  // das notificações (quando o usuário toca e aperta “Tomei/Esqueci”).
  useEffect(() => {
    initializeNotifications();

    const subscription = addNotificationResponseListener(async (response) => {
      // actionIdentifier indica qual botão/ação foi pressionado.
      const actionIdentifier = response.actionIdentifier;

      // data inclui o conteúdo customizado da notificação.
      const data = response.notification.request.content.data;

      // Se o usuário marcou tomada como taken/missed, persiste no Firestore.
      if (actionIdentifier === 'TAKEN' || actionIdentifier === 'MISSED') {
        await addIntakeForNotification(data, actionIdentifier);
      }
    });

    // cleanup: remove o listener ao desmontar o componente.
    return () => {
      subscription.remove();
    };
  }, []);


  return (
    // NavigationContainer gerencia o estado de navegação.
    <NavigationContainer>
      {/* StatusBar controla cor e estilo da barra do sistema */}
      <StatusBar backgroundColor="#38A69D" barStyle="light-content" />

      {/* Rotas/telas do app */}
      <Routes />
    </NavigationContainer>
  );
}
