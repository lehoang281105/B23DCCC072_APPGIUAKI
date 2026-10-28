import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FieldStatus, FieldType, RootStackParamList } from '../types';
import { useApp } from '../context/AppContext';
import { colors, typography } from '../theme/colors';
import { CustomInput } from '../components/CustomInput';
import { validateFieldName, validateFieldPrice } from '../utils/validators';

type Props = NativeStackScreenProps<RootStackParamList, 'FieldForm'>;

export const FieldFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const existingField = route.params?.field;
  const isEditing = !!existingField;

  const { fields, addField, updateField } = useApp();

  const [name, setName] = useState(existingField?.name || '');
  const [type, setType] = useState<FieldType>(existingField?.type || '5 người');
  const [pricePerHourStr, setPricePerHourStr] = useState(
    existingField ? existingField.pricePerHour.toString() : ''
  );
  const [status, setStatus] = useState<FieldStatus>(
    existingField?.status || 'Hoạt động'
  );

  const [errors, setErrors] = useState<{ name?: string | null; price?: string | null }>({});

  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Sửa thông tin sân' : 'Thêm sân bóng mới',
    });
  }, [isEditing, navigation]);

  const handleSubmit = () => {
    // Validate tên không trống và không trùng
    const nameErr = validateFieldName(name, fields, existingField?.id);
    // Validate giá là số > 0
    const priceErr = validateFieldPrice(pricePerHourStr);

    setErrors({ name: nameErr, price: priceErr });

    if (nameErr || priceErr) {
      return;
    }

    const pricePerHour = Number(pricePerHourStr.trim());
    const fieldData = {
      name: name.trim(),
      type,
      pricePerHour,
      status,
    };

    if (isEditing && existingField) {
      const res = updateField(existingField.id, fieldData);
      if (res.success) {
        Alert.alert('Thành công', 'Cập nhật sân thành công!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Lỗi', res.error || 'Không thể cập nhật sân.');
      }
    } else {
      const res = addField(fieldData);
      if (res.success) {
        Alert.alert('Thành công', 'Thêm sân mới thành công!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Lỗi', res.error || 'Không thể thêm sân.');
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardContainer}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            {isEditing ? 'Cập nhật thông tin' : 'Điền thông tin sân'}
          </Text>

          {/* Ô nhập Tên sân */}
          <CustomInput
            label="Tên sân"
            required
            placeholder="Ví dụ: Sân A1"
            iconName="football-outline"
            value={name}
            onChangeText={text => {
              setName(text);
              if (errors.name) setErrors(prev => ({ ...prev, name: null }));
            }}
            error={errors.name}
          />

          {/* Chọn Loại sân bằng nút bấm*/}
          <View style={styles.groupContainer}>
            <Text style={styles.label}>
              Loại sân <Text style={styles.requiredStar}>*</Text>
            </Text>
            <View style={styles.toggleRow}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles.toggleButton,
                  type === '5 người' && styles.toggleButtonActive,
                ]}
                onPress={() => setType('5 người')}
              >
                <Ionicons
                  name="people"
                  size={16}
                  color={type === '5 người' ? colors.textWhite : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.toggleButtonText,
                    type === '5 người' && styles.toggleButtonTextActive,
                  ]}
                >
                  Sân 5 người
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles.toggleButton,
                  type === '7 người' && styles.toggleButtonActive,
                ]}
                onPress={() => setType('7 người')}
              >
                <Ionicons
                  name="people"
                  size={16}
                  color={type === '7 người' ? colors.textWhite : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.toggleButtonText,
                    type === '7 người' && styles.toggleButtonTextActive,
                  ]}
                >
                  Sân 7 người
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Ô nhập Giá thuê */}
          <CustomInput
            label="Giá thuê mỗi giờ (VNĐ)"
            required
            placeholder="Ví dụ: 300000"
            iconName="cash-outline"
            keyboardType="numeric"
            value={pricePerHourStr}
            onChangeText={text => {
              setPricePerHourStr(text);
              if (errors.price) setErrors(prev => ({ ...prev, price: null }));
            }}
            error={errors.price}
          />

          {/* Chọn Trạng thái bằng nút bấm */}
          <View style={styles.groupContainer}>
            <Text style={styles.label}>
              Trạng thái <Text style={styles.requiredStar}>*</Text>
            </Text>
            <View style={styles.toggleRow}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles.toggleButton,
                  status === 'Hoạt động' && styles.toggleButtonActiveGreen,
                ]}
                onPress={() => setStatus('Hoạt động')}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={
                    status === 'Hoạt động' ? colors.textWhite : colors.statusActive
                  }
                />
                <Text
                  style={[
                    styles.toggleButtonText,
                    status === 'Hoạt động' && styles.toggleButtonTextActive,
                  ]}
                >
                  Hoạt động
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles.toggleButton,
                  status === 'Bảo trì' && styles.toggleButtonActiveOrange,
                ]}
                onPress={() => setStatus('Bảo trì')}
              >
                <Ionicons
                  name="construct"
                  size={16}
                  color={
                    status === 'Bảo trì' ? colors.textWhite : colors.statusMaintenance
                  }
                />
                <Text
                  style={[
                    styles.toggleButtonText,
                    status === 'Bảo trì' && styles.toggleButtonTextActive,
                  ]}
                >
                  Bảo trì
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Nút lưu */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Ionicons name="save-outline" size={20} color={colors.textWhite} />
            <Text style={styles.submitButtonText}>
              {isEditing ? 'Lưu thay đổi' : 'Tạo sân'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  sectionTitle: {
    ...typography.cardTitle,
    marginBottom: 16,
    color: colors.primaryDark,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  requiredStar: {
    color: colors.error,
  },
  groupContainer: {
    marginBottom: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.card,
    gap: 6,
  },
  toggleButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  toggleButtonActiveGreen: {
    backgroundColor: colors.statusActive,
    borderColor: colors.statusActive,
  },
  toggleButtonActiveOrange: {
    backgroundColor: colors.statusMaintenance,
    borderColor: colors.statusMaintenance,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  toggleButtonTextActive: {
    color: colors.textWhite,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textWhite,
  },
});

