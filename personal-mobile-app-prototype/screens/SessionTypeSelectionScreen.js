import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function SessionTypeSelectionScreen({ navigation }) {
  const handleSessionTypeSelect = (sessionType) => {
    navigation.navigate('SessionInput', { sessionType });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleSessionTypeSelect('Session A')}
      >
        <Text style={styles.buttonText}>Session A</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleSessionTypeSelect('Session B')}
      >
        <Text style={styles.buttonText}>Session B</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleSessionTypeSelect('Blank')}
      >
        <Text style={styles.buttonText}>Blank</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  button: {
    width: '100%',
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

