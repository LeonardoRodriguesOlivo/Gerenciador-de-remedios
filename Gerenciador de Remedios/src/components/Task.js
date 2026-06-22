
import React from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

export default function Task({
  text,
  dosage,
  time,
  checked,
}) {
  return (
    <View style={styles.item}>
      <View style={styles.left}>

        <View
          style={[
            styles.checkbox,
            checked && styles.checked,
          ]}
        />

        <View style={styles.content}>

          <View style={styles.header}>
            <Text
              style={[
                styles.title,
                checked && styles.completed,
              ]}
            >
              {text}
            </Text>

            <Text style={styles.time}>
              {time}
            </Text>
          </View>

          <Text style={styles.subtitle}>
            {dosage}
          </Text>

        </View>
      </View>
    </View>
  );
}

const PRIMARY = '#2D9C95';
const DARK = '#1F2937';

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#FFF',
    padding: 18,
    borderRadius: 18,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkbox: {
    width: 26,
    height: 26,
    borderWidth: 2,
    borderColor: PRIMARY,
    borderRadius: 13,
    marginRight: 15,
  },

  checked: {
    backgroundColor: PRIMARY,
  },

  content: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 17,
    fontWeight: '700',
    color: DARK,
    flex: 1,
  },

  time: {
    fontSize: 13,
    fontWeight: '700',
    color: PRIMARY,
    marginLeft: 10,
    backgroundColor: '#E6F5F3',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },

  completed: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },

  subtitle: {
    color: '#6B7280',
    fontSize: 14,
    marginTop: 4,
  },
});