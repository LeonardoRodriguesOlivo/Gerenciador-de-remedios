import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import { initFirebaseAuth } from '../../config/firebase';
import { subscribeMedicines, getRecentIntakes } from '../../services/firebase';

const PRIMARY = '#2D9C95';
const DARK = '#1F2937';

// Calcula a maior sequência de dias consecutivos, a partir de hoje, sem
// nenhuma dose marcada como "missed". Um dia sem nenhum registro não quebra
// a sequência (pode ser um dia em que ainda não chegou a hora do remédio).
function calculateStreak(intakes) {
  const missedDates = new Set(
    intakes
      .filter((item) => item.status === 'missed' && item.createdAt)
      .map((item) => item.createdAt.toDateString())
  );

  let streak = 0;
  const cursor = new Date();

  // Limite de segurança de 60 dias para nunca rodar um laço infinito.
  for (let i = 0; i < 60; i += 1) {
    if (missedDates.has(cursor.toDateString())) {
      break;
    }
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export default function Resumo() {
  const [loading, setLoading] = useState(true);
  const [medicineCount, setMedicineCount] = useState(0);
  const [adherenceRate, setAdherenceRate] = useState(null);
  const [streak, setStreak] = useState(0);
  const [takenCount, setTakenCount] = useState(0);
  const [missedCount, setMissedCount] = useState(0);

  useEffect(() => {
    let unsubscribeMedicines = () => {};
    let active = true;

    async function load() {
      try {
        const user = await initFirebaseAuth();

        unsubscribeMedicines = subscribeMedicines(user.uid, (items) => {
          if (active) {
            setMedicineCount(items.length);
          }
        });

        const since = new Date();
        since.setDate(since.getDate() - 30);
        const intakes = await getRecentIntakes(user.uid, since);

        if (!active) return;

        const taken = intakes.filter((item) => item.status === 'taken').length;
        const missed = intakes.filter((item) => item.status === 'missed').length;
        const total = taken + missed;

        setTakenCount(taken);
        setMissedCount(missed);
        setAdherenceRate(total > 0 ? Math.round((taken / total) * 100) : null);
        setStreak(calculateStreak(intakes));
      } catch (error) {
        console.warn('Erro ao carregar resumo:', error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
      unsubscribeMedicines();
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={PRIMARY} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Resumo</Text>
      <Text style={styles.subtitle}>
        Sua visão geral de adesão ao tratamento nos últimos 30 dias.
      </Text>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, styles.statCardSpacing]}>
          <Text style={styles.statValue}>{medicineCount}</Text>
          <Text style={styles.statLabel}>
            {medicineCount === 1 ? 'Remédio ativo' : 'Remédios ativos'}
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{streak}</Text>
          <Text style={styles.statLabel}>
            {streak === 1 ? 'Dia em dia' : 'Dias em dia'}
          </Text>
        </View>
      </View>

      <View style={styles.adherenceCard}>
        <Text style={styles.adherenceLabel}>Taxa de adesão</Text>

        {adherenceRate === null ? (
          <Text style={styles.emptyText}>
            Nenhuma dose registrada ainda nos últimos 30 dias.
          </Text>
        ) : (
          <>
            <Text style={styles.adherenceValue}>{adherenceRate}%</Text>
            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFill, { width: `${adherenceRate}%` }]}
              />
            </View>
            <Text style={styles.adherenceDetail}>
              {takenCount} tomadas no horário · {missedCount} esquecidas
            </Text>
          </>
        )}
      </View>

      <Text style={styles.footerHint}>
        Cadastre seus remédios na aba Remédios e marque cada dose como
        tomada ou esquecida para manter este resumo atualizado.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    backgroundColor: '#F7F9FB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#F7F9FB',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: DARK,
  },

  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 6,
    marginBottom: 24,
    lineHeight: 22,
  },

  statsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },

  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 22,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
  },

  statCardSpacing: {
    marginRight: 14,
  },

  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: PRIMARY,
  },

  statLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },

  adherenceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 22,
    marginBottom: 20,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
  },

  adherenceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },

  adherenceValue: {
    fontSize: 36,
    fontWeight: '700',
    color: DARK,
    marginBottom: 12,
  },

  progressTrack: {
    height: 14,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
  },

  progressFill: {
    height: 14,
    backgroundColor: PRIMARY,
    borderRadius: 8,
  },

  adherenceDetail: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 10,
  },

  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
  },

  footerHint: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 10,
  },
});
