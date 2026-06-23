import React, { useEffect, useState } from 'react';
import {View,Text,StyleSheet,ActivityIndicator,ScrollView,} from 'react-native';

import { initFirebaseAuth } from '../../config/firebase';
import { getRecentIntakes } from '../../services/firebase';

// Tela que mostra um ranking dos remédios mais esquecidos nos últimos 30 dias.
export default function Historico() {
  // Estados de carregamento e ranking.
  const [loading, setLoading] = useState(true);

  const [topForgotten, setTopForgotten] = useState([]);

  useEffect(() => {
    // Carrega histórico ao montar.
    async function loadHistory() {
      try {
        // Garante o uid do usuário (Firebase ou local).
        const user = await initFirebaseAuth();

        const since = new Date(); // Cria uma nova data representando o momento atual
        since.setDate(since.getDate() - 30); // Subtrai 30 dias da data atual. Essa data será usada como limite para buscar apenas os registros recentes

        const intakes = await getRecentIntakes(user.uid, since); // Busca no Firebase os registros de consumo de medicamentos do usuário
        const counts = {}; // Cria um objeto vazio que será usado para contar quantas vezes cada medicamento foi esquecido


        // Percorre todos os registros de consumo retornados do Firebase
        intakes.forEach((item) => {

          // Verifica se o status do registro indica que o usuário esqueceu de tomar o medicamento
          if (item.status === 'missed') {

            // Incrementa a quantidade de esquecimentos daquele medicamento
            counts[item.medicineName] = (counts[item.medicineName] || 0) + 1;
          }
        });
        
        // Converte o objeto "counts" em um array de pares chave/valor
        // Exemplo: { "Dipirona": 3, "Vitamina C": 1 }
        const entries = Object.entries(counts)
          .map(([medicineName, forgetCount]) => ({ medicineName, forgetCount }))
          .sort((a, b) => b.forgetCount - a.forgetCount)
          .slice(0, 5);

        setTopForgotten(entries); // Atualiza o estado "topForgotten" com a lista dos medicamentos mais esquecidos
      } catch (error) {
        console.warn('Erro ao carregar histórico:', error); //exibe mensagem de erro
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  // Calcula o maior número de esquecimentos entre os medicamentos da lista "topForgotten"
  const maxCount = topForgotten.reduce((max, item) => Math.max(max, item.forgetCount), 0) || 1;

  return (
  // ScrollView permite que o conteúdo da tela seja rolável,
  <ScrollView contentContainerStyle={styles.container}>

    <Text style={styles.title}>
      Histórico de Esquecimentos
    </Text>

    <Text style={styles.subtitle}>
      Visualize os remédios que você mais costuma esquecer nos últimos 30 dias.
    </Text>


    {/* Renderização condicional baseada no estado "loading" */}
    {loading ? (

      // Se ainda estiver carregando, exibe um indicador de carregamento
      <ActivityIndicator
        size="large"
        color="#2D9C95"
        style={styles.loader}
      />

    ) : topForgotten.length === 0 ? (

      // Se não estiver carregando e não houver dados, mostra uma mensagem 
      <Text style={styles.emptyText}>
        Nenhum esquecimento registrado nos últimos 30 dias.
      </Text>

    ) : (

      // Caso existam dados, exibe o gráfico/lista de esquecimentos
      <View style={styles.chartCard}>

        {/* Percorre a lista de medicamentos mais esquecidos */}
        {topForgotten.map((item) => (

          // Cada medicamento vira uma linha no "gráfico"
          <View key={item.medicineName} style={styles.barRow}>

            {/* Área com nome do medicamento e quantidade de esquecimentos */}
            <View style={styles.barInfo}>

              {/* Nome do medicamento */}
              <Text style={styles.barLabel}>
                {item.medicineName}
              </Text>

              {/* Quantidade de vezes que foi esquecido */}
              <Text style={styles.barValue}>
                {item.forgetCount}
              </Text>

            </View>


            {/* Barra de progresso representando visualmente os esquecimentos */}
            <View style={styles.barTrack}>

              {/* Parte preenchida da barra */}
              <View
                style={[
                  styles.barFill,

                  // Calcula a largura proporcional em relação ao maior valor (maxCount)
                  // Exemplo: se maxCount = 10 e item.forgetCount = 5 → 50%
                  { width: `${(item.forgetCount / maxCount) * 100}%` },
                ]}
              />
            </View>

          </View>
        ))}

      </View>
    )}
  </ScrollView>
);
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F7F9FB',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginVertical: 10,
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 20,
    lineHeight: 24,
  },
  loader: {
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 30,
    textAlign: 'center',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 6,
  },
  barRow: {
    marginBottom: 20,
  },
  barInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginRight: 10,
  },
  barValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2D9C95',
  },
  barTrack: {
    height: 16,
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
    overflow: 'hidden',
  },
  barFill: {
    height: 16,
    backgroundColor: '#2D9C95',
    borderRadius: 10,
  },
});
