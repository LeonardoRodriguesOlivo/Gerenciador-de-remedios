import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';

import { initializeApp } from 'firebase/app';

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';

import { firebaseConfig } from '../../firebaseConfig';

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function Login({ navigation }) {

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // Criar conta
  const criarConta = () => {

    createUserWithEmailAndPassword(auth, email, senha)
      .then((userCredential) => {

        const user = userCredential.user;

        Alert.alert("Conta criada com sucesso!");

        navigation.navigate('Home');

      })
      .catch((error) => {

        console.log(error);

        Alert.alert(error.message);

      });
  };

  // Login
  const login = () => {

    signInWithEmailAndPassword(auth, email, senha)
      .then((userCredential) => {

        const user = userCredential.user;

        Alert.alert("Login realizado!");

        navigation.navigate('Home');

      })
      .catch((error) => {

        console.log(error);

        Alert.alert(error.message);

      });
  };

  return (
    <View style={styles.container}>

      <Text style={styles.texto}>Login</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#ffffff"
        value={email}
        onChangeText={setEmail}
        style={styles.txtInput}
      />

      <TextInput
        placeholder="Senha"
        placeholderTextColor="#ffffff"
        value={senha}
        onChangeText={setSenha}
        style={styles.txtInput}
        secureTextEntry={true}
      />

      <Button
        title="Entrar"
        color="#000"
        onPress={login}
      />

      <Button
        title="Criar conta"
        color="#000"
        onPress={criarConta}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3e47c5"
  },

  texto: {
    fontSize: 30,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 20
  },

  txtInput: {
    borderColor: "#fff",
    borderWidth: 2,
    padding: 5,
    margin: 10,
    width: 200,
    color: "#fff"
  }
});