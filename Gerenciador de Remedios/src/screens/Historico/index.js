import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import { initFirebaseAuth } from '../../config/firebase';
import { getRecentIntakes } from '../../services/firebase';

export default function Historico() {
  const [loading, setLoading] = useState(true);
  const [topForgotten, setTopForgotten] = useState([]);

  useEffect(() => {
    async function loadHistory() {
      try {
        const user = await initFirebaseAuth();
        const since = new Date();
        since.setDate(since.getDate() - 30);

        const intakes = await getRecentIntakes(user.uid, since);
        const counts = {};

        intakes.forEach((item) => {
          if (item.status === 'missed') {
            counts[item.medicineName] = (counts[item.medicineName] || 0) + 1;
          }
        });

        const entries = Object.entries(counts)
          .map(([medicineName, forgetCount]) => ({ medicineName, forgetCount }))
          .sort((a, b) => b.forgetCount - a.forgetCount)
          .slice(0, 5);

        setTopForgotten(entries);
      } catch (error) {
        console.warn('Erro ao carregar histórico:', error);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  const maxCount = topForgotten.reduce((max, item) => Math.max(max, item.forgetCount), 0) || 1;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Histórico de Esquecimentos</Text>
      <Text style={styles.subtitle}>
        Visualize os remédios que você mais costuma esquecer nos últimos 30 dias.
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#2D9C95" style={styles.loader} />
      ) : topForgotten.length === 0 ? (
        <Text style={styles.emptyText}>
          Nenhum esquecimento registrado nos últimos 30 dias.
        </Text>
      ) : (
        <View style={styles.chartCard}>
          {topForgotten.map((item) => (
            <View key={item.medicineName} style={styles.barRow}>
              <View style={styles.barInfo}>
                <Text style={styles.barLabel}>{item.medicineName}</Text>
                <Text style={styles.barValue}>{item.forgetCount}</Text>
              </View>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
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
