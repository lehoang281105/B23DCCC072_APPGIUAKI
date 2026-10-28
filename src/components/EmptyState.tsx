import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../theme/colors';

interface EmptyStateProps {
  iconName?: string;
  title: string;
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  iconName = 'football-outline',
  title,
  message,
}) => {
  return (
    <View style={styles.container}>
      <Ionicons name={iconName} size={64} color={colors.textLight} />
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 13,
    color: colors.textLight,
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 18,
  },
});

