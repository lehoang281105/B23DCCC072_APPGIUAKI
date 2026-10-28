import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Field } from '../types';
import { colors, typography } from '../theme/colors';
import { formatPricePerHour } from '../utils/formatters';

interface FieldCardProps {
  field: Field;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const FieldCard: React.FC<FieldCardProps> = ({
  field,
  onPress,
  onEdit,
  onDelete,
}) => {
  const isActive = field.status === 'Hoạt động';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.card}
      onPress={onPress}
    >
      <View style={styles.cardHeader}>
        <View style={styles.titleRow}>
          <Ionicons
            name="football-outline"
            size={22}
            color={colors.primary}
            style={styles.fieldIcon}
          />
          <Text style={styles.fieldName}>{field.name}</Text>
        </View>

        {/* Nhãn trạng thái màu: Xanh cho Hoạt động, Cam cho Bảo trì */}
        <View
          style={[
            styles.statusBadge,
            isActive ? styles.statusBadgeActive : styles.statusBadgeMaintenance,
          ]}
        >
          <Ionicons
            name={isActive ? 'checkmark-circle' : 'construct'}
            size={14}
            color={isActive ? colors.statusActive : colors.statusMaintenance}
            style={styles.statusIcon}
          />
          <Text
            style={[
              styles.statusText,
              isActive ? styles.statusTextActive : styles.statusTextMaintenance,
            ]}
          >
            {field.status}
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.typeBadge}>
          <Ionicons name="people-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.typeText}>{field.type}</Text>
        </View>

        <Text style={styles.priceText}>
          {formatPricePerHour(field.pricePerHour)}
        </Text>
      </View>

      <View style={styles.divider} />

      {/* Các nút thao tác */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.editButton}
          onPress={onEdit}
        >
          <Ionicons name="create-outline" size={16} color={colors.primary} />
          <Text style={styles.editButtonText}>Sửa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.deleteButton}
          onPress={onDelete}
        >
          <Ionicons name="trash-outline" size={16} color={colors.danger} />
          <Text style={styles.deleteButtonText}>Xoá</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fieldIcon: {
    marginRight: 8,
  },
  fieldName: {
    ...typography.cardTitle,
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeActive: {
    backgroundColor: colors.statusActiveBg,
  },
  statusBadgeMaintenance: {
    backgroundColor: colors.statusMaintenanceBg,
  },
  statusIcon: {
    marginRight: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusTextActive: {
    color: colors.statusActive,
  },
  statusTextMaintenance: {
    color: colors.statusMaintenance,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  typeText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  priceText: {
    ...typography.price,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginBottom: 10,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: colors.primaryLight,
    gap: 4,
  },
  editButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: colors.dangerBg,
    gap: 4,
  },
  deleteButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.danger,
  },
});

