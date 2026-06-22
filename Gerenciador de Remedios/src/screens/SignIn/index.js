import {View,Text,StyleSheet,TextInput,TouchableOpacity,} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import * as Animatable from 'react-native-animatable';

export default function SignIn({ navigation }) {
  return (
    <View style={styles.container}>

      <Animatable.View
        animation="fadeInLeft"
        delay={500}
        style={styles.containerHeader}
      >
        <Text style={styles.message}>Bem-vindo(a)</Text>
      </Animatable.View>

      <Animatable.View
        animation="fadeInUp"
        style={styles.containerForm}
      >
        <Text style={styles.title}>Email</Text>

        <TextInput
          placeholder="Digite um email..."
          style={styles.input}
        />

        <Text style={styles.title}>Senha</Text>

        <TextInput
          placeholder="Digite sua senha"
          style={styles.input}
          secureTextEntry={true}
        />

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonRegister}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Cadastro')}
        >
          <Text style={styles.registerText}>Cadastre-se se já não possui uma conta</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.buttonRegister}>
          <Text style={styles.registerText}>
            Cadastre-se se já não possui uma conta
          </Text>
        </TouchableOpacity> */}
        

      </Animatable.View>

    </View>
  );
}

const PRIMARY = '#2D9C95';
const DARK = '#1F2937';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PRIMARY,
  },

  containerHeader: {
    marginTop: '14%',
    marginBottom: '8%',
    paddingStart: '5%',
  },

  message: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },

  containerForm: {
    backgroundColor: '#fff',
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: '6%',
    paddingTop: 10,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },

  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 24,
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    color: DARK,
    marginBottom: 4,
  },

  button: {
    backgroundColor: PRIMARY,
    width: '100%',
    height: 54,
    borderRadius: 27,
    marginTop: 28,
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  buttonRegister: {
    marginTop: 18,
    alignSelf: 'center',
  },

  registerText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
});