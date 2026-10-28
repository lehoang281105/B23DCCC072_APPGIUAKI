import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../types';
import { useApp } from '../context/AppContext';
import { colors, typography } from '../theme/colors';
import { formatPricePerHour } from '../utils/formatters';
import { BookingCard } from '../components/BookingCard';
import { BookingModal } from '../components/BookingModal';
import { EmptyState } from '../components/EmptyState';

type Props = NativeStackScreenProps<RootStackParamList, 'FieldDetail'>;

export const FieldDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { fieldId } = route.params;
  const { getFieldById, getBookingsByFieldId, addBooking, cancelBooking } = useApp();

  const [modalVisible, setModalVisible] = useState(false);

  const field = getFieldById(fieldId);
  const bookings = getBookingsByFieldId(fieldId);

  if (!field) {
    return (
      <View style={styles.container}>
        <EmptyState
          iconName="alert-circle-outline"
          title="Không tìm thấy sân bóng"
          message="Sân bóng có thể đã bị xoá."
        />
      </View>
    );
  }

  const isMaintenance = field.status === 'Bảo trì';

  const handleBookingSubmit = (data: {
    customerName: string;
    phone: string;
    date: string;
    startHour: number;
    hours: number;
  }) => {
    return addBooking({
      fieldId: field.id,
      customerName: data.customerName,
      phone: data.phone,
      date: data.date,
      startHour: data.startHour,
      hours: data.hours,
    });
  };

  return (
    <View style={styles.container}>
      {/* Thông tin chi tiết Sân bóng */}
      <View style={styles.fieldInfoCard}>
        <View style={styles.titleRow}>
          <View style={styles.nameContainer}>
            <Ionicons name="football" size={24} color={colors.primary} />
            <Text style={styles.fieldName}>{field.name}</Text>
          </View>

          {/* Badge trạng thái */}
          <View
            style={[
              styles.statusBadge,
              isMaintenance ? styles.statusBadgeMaintenance : styles.statusBadgeActive,
            ]}
          >
            <Ionicons
              name={isMaintenance ? 'construct' : 'checkmark-circle'}
              size={14}
              color={isMaintenance ? colors.statusMaintenance : colors.statusActive}
              style={styles.statusIcon}
            />
            <Text
              style={[
                styles.statusText,
                isMaintenance ? styles.statusTextMaintenance : styles.statusTextActive,
              ]}
            >
              {field.status}
            </Text>
          </View>
        </View>

        <View style={styles.detailGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Loại sân</Text>
            <View style={styles.typeBadge}>
              <Ionicons name="people-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.detailValue}>{field.type}</Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Giá thuê</Text>
            <Text style={styles.priceValue}>{formatPricePerHour(field.pricePerHour)}</Text>
          </View>
        </View>

        {/* Nút Đặt sân và Sửa */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.editButton}
            onPress={() => navigation.navigate('FieldForm', { field })}
          >
            <Ionicons name="create-outline" size={18} color={colors.primaryDark} />
            <Text style={styles.editButtonText}>Sửa sân</Text>
          </TouchableOpacity>

          {/*Không cho đặt sân đang Bảo trì: nút bị vô hiệu hoá */}
          <TouchableOpacity
            activeOpacity={0.7}
            disabled={isMaintenance}
            style={[
              styles.bookingButton,
              isMaintenance && styles.bookingButtonDisabled,
            ]}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons
              name={isMaintenance ? 'ban-outline' : 'calendar'}
              size={18}
              color={isMaintenance ? colors.disabled : colors.textWhite}
            />
            <Text
              style={[
                styles.bookingButtonText,
                isMaintenance && styles.bookingButtonTextDisabled,
              ]}
            >
              {isMaintenance ? 'Đang bảo trì' : 'Đặt sân ngay'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Danh sách lượt đặt sân */}
      <View style={styles.bookingListSection}>
        <View style={styles.sectionHeader}>
          <Ionicons name="list" size={18} color={colors.primary} />
          <Text style={styles.sectionTitle}>
            Danh sách lịch đặt ({bookings.length})
          </Text>
        </View>

        <FlatList
          data={bookings}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <BookingCard
              booking={item}
              field={field}
              onCancel={() => cancelBooking(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState
              iconName="calendar-clear-outline"
              title="Chưa có lượt đặt nào"
              message={
                isMaintenance
                  ? 'Sân đang bảo trì, không nhận lịch đặt.'
                  : 'Hãy nhấn "Đặt sân ngay" để tạo lịch mới cho khách.'
              }
            />
          }
        />
      </View>


      <BookingModal
        visible={modalVisible}
        field={field}
        onClose={() => setModalVisible(false)}
        onSubmit={handleBookingSubmit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  fieldInfoCard: {
    backgroundColor: colors.card,
    padding: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 3,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fieldName: {
    ...typography.headerTitle,
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
  detailGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
  },
  detailItem: {
    gap: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  priceValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  bookingButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  bookingButtonDisabled: {
    backgroundColor: colors.disabledBg,
  },
  bookingButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textWhite,
  },
  bookingButtonTextDisabled: {
    color: colors.disabled,
  },
  bookingListSection: {
    flex: 1,
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  listContent: {
    paddingBottom: 24,
  },
});

