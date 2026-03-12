import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSessions } from '../context/SessionContext';

export default function SessionDetailScreen({ route }) {
  const { sessionId } = route.params || {};
  const { getSession } = useSessions();
  const session = getSession(sessionId);

  if (!session) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Session not found</Text>
      </View>
    );
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerSection}>
          <Text style={styles.sessionType}>{session.sessionType}</Text>
          <Text style={styles.sessionDate}>{formatDate(session.date)}</Text>
        </View>

        <View style={styles.dataSection}>
          <Text style={styles.sectionLabel}>Session Data / Notes</Text>
          <View style={styles.dataBox}>
            <Text style={styles.dataText}>
              {session.data || 'No data entered'}
            </Text>
          </View>
        </View>
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
  headerSection: {
    marginBottom: 24,
  },
  sessionType: {
    fontSize: 28,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  sessionDate: {
    fontSize: 16,
    color: '#666',
  },
  dataSection: {
    marginTop: 8,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  dataBox: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    minHeight: 150,
  },
  dataText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 40,
  },
});

