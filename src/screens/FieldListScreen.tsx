import React from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Field, RootStackParamList } from '../types';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';
import { FieldCard } from '../components/FieldCard';
import { EmptyState } from '../components/EmptyState';

type Props = NativeStackScreenProps<RootStackParamList, 'FieldList'>;

export const FieldListScreen: React.FC<Props> = ({ navigation }) => {
  const { fields, deleteField } = useApp();

  // Thống kê sân"
  const activeCount = fields.filter(f => f.status === 'Hoạt động').length;
  const totalCount = fields.length;

  const handleDeleteField = (field: Field) => {
    Alert.alert(
      'Xác nhận xoá sân',
      `Bạn có chắc chắn muốn xoá "${field.name}" không?`,
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: () => {
            const result = deleteField(field.id);
            if (!result.success) {
              Alert.alert('Không thể xoá', result.error);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Thanh thống kê & Nút thêm sân */}
      <View style={styles.headerBar}>
        <View style={styles.statContainer}>
          <Ionicons name="stats-chart" size={18} color={colors.primary} />
          <Text style={styles.statText}>
            <Text style={styles.statHighlight}>{activeCount}/{totalCount}</Text> sân hoạt động
          </Text>
        </View>

        {/* Nút "+ Thêm sân"*/}
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.addButton}
          onPress={() => navigation.navigate('FieldForm')}
        >
          <Ionicons name="add-circle" size={18} color={colors.textWhite} />
          <Text style={styles.addButtonText}>+ Thêm sân</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách sân bằng FlatList*/}
      <FlatList
        data={fields}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <FieldCard
            field={item}
            onPress={() => navigation.navigate('FieldDetail', { fieldId: item.id })}
            onEdit={() => navigation.navigate('FieldForm', { field: item })}
            onDelete={() => handleDeleteField(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            iconName="football-outline"
            title="Chưa có sân bóng nào"
            message="Hãy nhấn '+ Thêm sân' ở góc trên để tạo sân mới."
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  statContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statText: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  statHighlight: {
    fontWeight: '700',
    color: colors.primary,
    fontSize: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  addButtonText: {
    color: colors.textWhite,
    fontSize: 14,
    fontWeight: '700',
  },
  listContent: {
    paddingVertical: 8,
    paddingBottom: 24,
  },
});

