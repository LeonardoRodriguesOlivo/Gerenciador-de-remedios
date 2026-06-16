import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native/types_generated/index';
import { database} from '..firebaseConfig';
import { collection, getDocs } from '..firebase/firestore';

const[produtos, setProdutos]=useState([]);

useEffect(() =>{
    async function carregarProdutos() {
        try{
            const querySnapshot
        }
        
    }
})


export default function Home({navigation}) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>TITULO</Text>
      <Button title='AddProduct' onPress={() => (navigation.navigate ("AddProduct"))}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  text: {
    fontSize: 20,
    textAlign: 'justify'
  },

  cards: {
    alignItems: 'center',
  }
});