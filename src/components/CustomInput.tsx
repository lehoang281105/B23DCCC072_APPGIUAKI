import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../theme/colors';

interface CustomInputProps extends TextInputProps {
  label: string;
  error?: string | null;
  iconName?: string;
  required?: boolean;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  error,
  iconName,
  required = false,
  style,
  ...props
}) => {
  const hasError = !!error;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label} {required && <Text style={styles.requiredStar}>*</Text>}
      </Text>
      
      <View
        style={[
          styles.inputContainer,
          hasError && styles.inputErrorBorder,
          props.editable === false && styles.inputDisabled,
        ]}
      >
        {iconName && (
          <Ionicons
            name={iconName}
            size={20}
            color={hasError ? colors.error : colors.textSecondary}
            style={styles.icon}
          />
        )}
        <TextInput
          placeholderTextColor={colors.textLight}
          style={[styles.input, style]}
          {...props}
        />
      </View>

      {hasError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  requiredStar: {
    color: colors.error,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    minHeight: 46,
  },
  inputErrorBorder: {
    borderColor: colors.error,
    backgroundColor: '#FEF2F2',
  },
  inputDisabled: {
    backgroundColor: colors.disabledBg,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    paddingVertical: 10,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});

