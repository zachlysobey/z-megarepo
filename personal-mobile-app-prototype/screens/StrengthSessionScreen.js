import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { useSessions } from '../context/SessionContext';

export default function StrengthSessionScreen({ navigation, route }) {
  const { sessions } = useSessions();
  const newSessionId = route?.params?.newSessionId;
  const highlightAnimations = useRef({});

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // Initialize animation for a session if it doesn't exist
  const getAnimation = (sessionId, isNewSession = false) => {
    if (!highlightAnimations.current[sessionId]) {
      highlightAnimations.current[sessionId] = {
        opacity: new Animated.Value(isNewSession ? 0 : 1),
        backgroundColor: new Animated.Value(0),
      };
    }
    return highlightAnimations.current[sessionId];
  };

  // Animate new session highlight
  useEffect(() => {
    if (newSessionId) {
      // Small delay to ensure the component has rendered
      const timer = setTimeout(() => {
        const anim = getAnimation(newSessionId, true);
        
        // Ensure starting values
        anim.opacity.setValue(0);
        anim.backgroundColor.setValue(0);

        // Fade in with subtle green highlight
        Animated.parallel([
          Animated.timing(anim.opacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: false,
          }),
          Animated.timing(anim.backgroundColor, {
            toValue: 1,
            duration: 400,
            useNativeDriver: false,
          }),
        ]).start(() => {
          // After highlight, fade out the highlight color but keep opacity
          Animated.timing(anim.backgroundColor, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: false,
          }).start();
        });
      }, 50);

      // Clear the param after a short delay to prevent re-triggering
      setTimeout(() => {
        navigation.setParams({ newSessionId: undefined });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [newSessionId, navigation]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('SessionTypeSelection')}
        >
          <Text style={styles.buttonText}>New Session</Text>
        </TouchableOpacity>

        <View style={styles.historicalSection}>
          <Text style={styles.sectionTitle}>Historical Sessions</Text>
          {sessions.length === 0 ? (
            <TouchableOpacity style={styles.placeholderButton} disabled>
              <Text style={styles.placeholderText}>No sessions yet</Text>
            </TouchableOpacity>
          ) : (
            sessions.map((session) => {
              const isNew = session.id === newSessionId;
              const anim = getAnimation(session.id, isNew);
              
              const backgroundColor = anim.backgroundColor.interpolate({
                inputRange: [0, 1],
                outputRange: ['#f9f9f9', '#e8f5e9'], // Normal to light green
              });

              const borderColor = anim.backgroundColor.interpolate({
                inputRange: [0, 1],
                outputRange: ['#e0e0e0', '#4caf50'], // Normal to green border
              });

              return (
                <Animated.View
                  key={session.id}
                  style={[
                    styles.sessionCardWrapper,
                    {
                      opacity: anim.opacity,
                      backgroundColor,
                      borderColor,
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.sessionCard}
                    onPress={() =>
                      navigation.navigate('SessionDetail', { sessionId: session.id })
                    }
                  >
                    <View style={styles.sessionCardHeader}>
                      <Text style={styles.sessionType}>{session.sessionType}</Text>
                      <Text style={styles.sessionDate}>
                        {formatDate(session.date)}
                      </Text>
                    </View>
                    {session.data && (
                      <Text style={styles.sessionPreview} numberOfLines={2}>
                        {session.data}
                      </Text>
                    )}
                  </TouchableOpacity>
                </Animated.View>
              );
            })
          )}
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
  button: {
    width: '100%',
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  historicalSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000',
  },
  placeholderButton: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#999',
    fontSize: 16,
  },
  sessionCardWrapper: {
    width: '100%',
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  sessionCard: {
    width: '100%',
    padding: 16,
    backgroundColor: 'transparent',
  },
  sessionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sessionType: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  sessionDate: {
    fontSize: 14,
    color: '#666',
  },
  sessionPreview: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

