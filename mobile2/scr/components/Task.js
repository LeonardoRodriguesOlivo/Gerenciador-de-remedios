
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

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#4A90E2',
    borderRadius: 12,
    marginRight: 15,
  },

  checked: {
    backgroundColor: '#4A90E2',
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
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },

  time: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginLeft: 10,
  },

  completed: {
    textDecorationLine: 'line-through',
    color: '#999',
  },

  subtitle: {
    color: '#777',
    marginTop: 5,
  },
});