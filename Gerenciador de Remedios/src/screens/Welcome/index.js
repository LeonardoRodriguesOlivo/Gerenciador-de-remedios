// import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

// import * as Animatable from 'react-native-animatable'

// import { useNavigation } from '@react-navigation/native'

// export default function Welcome() {
//   const navigation = useNavigation();
//   return (
//     <View style={styles.container}>

//       <View style={styles.containerLogo}>
//         <Animatable.Image
//         animation='flipInY'
//         //--------------------------------------------------------------------------
//           // source={require('../../assets/logo.png')}//ainda não baixei image--temos que fazer isso 
//         //--------------------------------------------------------------------------  
//         style={styles.logo}
//           resizeMode="contain"
//         />
//       </View>

//       <Animatable.View delay={600} animation='fadeInUp' style={styles.containerForm}>
//         <Text style={styles.title}>
//           Monitore, organize seus gastos de qualquer lugar!
//         </Text>

//         <Text style={styles.text}>
//           Faça o login para começar
//         </Text>

//         <TouchableOpacity
//          style={styles.button}
//          onPress={() => navigation.navigate ('SignIn')}>
//           <Text style={styles.buttonText}>Acessar</Text>
//         </TouchableOpacity>
//       </Animatable.View>

//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#38a69d",
//   },

//   containerLogo: {
//     flex: 2,
//     backgroundColor:"#38a69d",
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   logo: {
//     width: '100%',
//     height: 180,
//   },

//   containerForm: {
//     flex: 1,
//     backgroundColor:"#38a69d",
//     borderTopLeftRadius: 25,
//     borderTopRightRadius: 25,
//     paddingStart: '5%',
//     paddingEnd: '5%',
//   },

//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginTop: 28,
//     marginBottom: 12,
//   },

//   text: {
//     color: '#a1a1a1',
//     textAlign: 'center',
//   },

//   button: {
//     position: "absolute",
//     backgroundColor: "#38a69d",
//     borderRadius: 50,
//     paddingVertical: 8,
//     width: "60%",
//     alignSelf: 'center',
//     bottom: '15%,',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   buttonText: {
//     color: '#FFF',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';

export default function Welcome() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.containerLogo}>
        <Animatable.Image
          animation="zoomIn"
          source={require('../Welcome/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Animatable.View
        delay={400}
        animation="fadeInUp"
        style={styles.containerForm}
      >
        <Text style={styles.title}>
          Gerencie seus remédios de forma eficaz.
        </Text>

        <Text style={styles.text}>
          Explicando e corrigindo seus erros.
        </Text>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('SignIn')}
        >
          <Text style={styles.buttonText}>Começar</Text>
        </TouchableOpacity>
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

  containerLogo: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    width: 220,
    height: 220,
  },

  containerForm: {
    flex: 1.3,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingHorizontal: 30,
    paddingTop: 35,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: DARK,
    textAlign: 'center',
    marginBottom: 15,
  },

  text: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },

  button: {
    backgroundColor: PRIMARY,
    height: 55,
    borderRadius: 30,

    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: PRIMARY,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});