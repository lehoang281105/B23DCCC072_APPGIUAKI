import React from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Booking, Field } from '../types';
import { colors } from '../theme/colors';
import { formatCurrency, formatTimeSlot } from '../utils/formatters';

interface BookingCardProps {
  booking: Booking;
  field?: Field;
  onCancel: () => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  field,
  onCancel,
}) => {
  const pricePerHour = field ? field.pricePerHour : 0;
  const totalPrice = pricePerHour * booking.hours;

  const handleConfirmCancel = () => {
    Alert.alert(
      'Xác nhận huỷ đặt sân',
      `Bạn có chắc chắn muốn huỷ lượt đặt của khách "${booking.customerName}" ngày ${booking.date} (${booking.startHour}h - ${booking.startHour + booking.hours}h)?`,
      [
        { text: 'Không', style: 'cancel' },
        { text: 'Huỷ đặt', style: 'destructive', onPress: onCancel },
      ]
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.customerRow}>
          <Ionicons name="person-circle-outline" size={24} color={colors.primary} />
          <Text style={styles.customerName}>{booking.customerName}</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.cancelButton}
          onPress={handleConfirmCancel}
        >
          <Ionicons name="close-circle-outline" size={16} color={colors.danger} />
          <Text style={styles.cancelButtonText}>Huỷ</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.infoRow}>
          <Ionicons name="call-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.infoText}>{booking.phone}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.infoText}>Ngày: {booking.date}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.infoText}>
            Khung giờ: {formatTimeSlot(booking.startHour, booking.hours)}
          </Text>
        </View>

        {pricePerHour > 0 && (
          <View style={styles.priceRow}>
            <Ionicons name="cash-outline" size={16} color={colors.primary} />
            <Text style={styles.priceLabel}>Thành tiền:</Text>
            <Text style={styles.priceValue}>{formatCurrency(totalPrice)}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 14,
    marginVertical: 6,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dangerBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  cancelButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.danger,
  },
  content: {
    gap: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    gap: 6,
  },
  priceLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
});

