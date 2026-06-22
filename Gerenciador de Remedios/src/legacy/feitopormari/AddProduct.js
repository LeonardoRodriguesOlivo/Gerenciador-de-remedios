import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image
} from "react-native";

import { useState } from "react";

import { addDoc, collection } from "firebase/firestore";

import { database } from "../../firebaseconfig";

export default function AddProducts() {

    const [nome, setNome] = useState('');
    const [valor, setValor] = useState('');
    const [imagem, setImagem] = useState('');

    const cadastrarProduto = async () => {

        try {

            await addDoc(collection(database, 'produtos'), {
                nome,
                valor: parseFloat(valor),
                imagem
            });

            alert('Produto cadastrado com sucesso!');

        } catch (error) {

            console.log('Erro ao cadastrar: ', error);

        }

    }

    return (
        <ScrollView contentContainerStyle={styles.container}>

            <Image
                source={{
                    uri: 'https://cdn-icons-png.flaticon.com/512/263/263142.png'
                }}
                style={styles.logo}
            />

            <Text style={styles.title}>Adicionar Produto</Text>

            <Text style={styles.subtitle}>
                Cadastre novos produtos para sua loja
            </Text>

            <View style={styles.card}>

                <Text style={styles.label}>Nome do Produto</Text>

                <TextInput
                    placeholder="Digite o nome do produto"
                    placeholderTextColor="#999"
                    value={nome}
                    onChangeText={setNome}
                    style={styles.input}
                />

                <Text style={styles.label}>Valor</Text>

                <TextInput
                    placeholder="Digite o valor"
                    placeholderTextColor="#999"
                    value={valor}
                    onChangeText={setValor}
                    style={styles.input}
                />

                <Text style={styles.label}>URL da Imagem</Text>

                <TextInput
                    placeholder="Cole a URL da imagem"
                    placeholderTextColor="#999"
                    value={imagem}
                    onChangeText={setImagem}
                    style={styles.input}
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={cadastrarProduto}
                >
                    <Text style={styles.buttonText}>
                        Cadastrar Produto
                    </Text>
                </TouchableOpacity>

            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({

    container: {
        flexGrow: 1,
        backgroundColor: '#121212',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 25,
    },

    logo: {
        width: 90,
        height: 90,
        marginBottom: 20,
    },

    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
    },

    subtitle: {
        fontSize: 15,
        color: '#aaa',
        marginTop: 5,
        marginBottom: 30,
    },

    card: {
        width: '100%',
        backgroundColor: '#1E1E1E',
        borderRadius: 25,
        padding: 25,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },

    label: {
        color: '#fff',
        fontSize: 16,
        marginBottom: 8,
        marginTop: 15,
        fontWeight: '600',
    },

    input: {
        backgroundColor: '#2A2A2A',
        color: '#fff',
        borderRadius: 15,
        padding: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#333',
    },

    button: {
        backgroundColor: '#FF8C00',
        padding: 18,
        borderRadius: 18,
        alignItems: 'center',
        marginTop: 30,
        shadowColor: '#FF8C00',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 8,
    },

    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },

});