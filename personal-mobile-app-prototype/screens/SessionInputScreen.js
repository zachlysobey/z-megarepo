import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useSessions } from '../context/SessionContext';

export default function SessionInputScreen({ navigation, route }) {
  const sessionType = route?.params?.sessionType || 'Session';
  const { addSession } = useSessions();
  
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const [sessionDate, setSessionDate] = useState(today);
  const [sessionData, setSessionData] = useState('');

  const handleSave = () => {
    let sessionId = null;
    if (sessionData.trim()) {
      sessionId = addSession({
        sessionType,
        date: sessionDate,
        data: sessionData,
      });
    }
    navigation.navigate('StrengthSession', { newSessionId: sessionId });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>{sessionType}</Text>

        <View style={styles.dateContainer}>
          <Text style={styles.label}>Date</Text>
          <TextInput
            style={styles.dateInput}
            placeholder="YYYY-MM-DD"
            value={sessionDate}
            onChangeText={setSessionDate}
          />
        </View>

        <View style={styles.dataContainer}>
          <Text style={styles.label}>Session Data / Notes</Text>
          <TextInput
            style={styles.textArea}
            multiline={true}
            numberOfLines={10}
            placeholder="Enter your session data/notes here..."
            value={sessionData}
            onChangeText={setSessionData}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>Save/Done</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    color: '#000',
  },
  dateContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  dateInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  dataContainer: {
    marginBottom: 20,
  },
  textArea: {
    width: '100%',
    minHeight: 200,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    width: '100%',
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

