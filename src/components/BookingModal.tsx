import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Field } from '../types';
import { colors } from '../theme/colors';
import { CustomInput } from './CustomInput';
import { formatCurrency } from '../utils/formatters';
import {
  validateCustomerName,
  validateDate,
  validateEndHour,
  validateHours,
  validatePhone,
  validateStartHour,
} from '../utils/validators';

interface BookingModalProps {
  visible: boolean;
  field: Field;
  onClose: () => void;
  onSubmit: (data: {
    customerName: string;
    phone: string;
    date: string;
    startHour: number;
    hours: number;
  }) => { success: boolean; error?: string };
}

export const BookingModal: React.FC<BookingModalProps> = ({
  visible,
  field,
  onClose,
  onSubmit,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [startHourStr, setStartHourStr] = useState('17');
  const [hoursStr, setHoursStr] = useState('1');

  // Lỗi form
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  // Reset form khi modal mở
  useEffect(() => {
    if (visible) {
      setCustomerName('');
      setPhone('');
      // Gợi ý ngày hôm nay dd/mm/yyyy
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const yyyy = today.getFullYear();
      setDate(`${dd}/${mm}/${yyyy}`);
      setStartHourStr('17');
      setHoursStr('1');
      setErrors({});
    }
  }, [visible]);

  const currentHours = parseInt(hoursStr, 10);
  const validHours = !isNaN(currentHours) && currentHours >= 1 && currentHours <= 3 ? currentHours : 0;
  const totalPrice = validHours > 0 ? field.pricePerHour * validHours : 0;

  const handleSubmit = () => {
    const nameErr = validateCustomerName(customerName);
    const phoneErr = validatePhone(phone);
    const dateErr = validateDate(date);

    const startHourNum = parseInt(startHourStr, 10);
    const startHourErr = validateStartHour(startHourNum);

    const hoursNum = parseInt(hoursStr, 10);
    const hoursErr = validateHours(hoursNum);

    let endHourErr: string | null = null;
    if (!startHourErr && !hoursErr) {
      endHourErr = validateEndHour(startHourNum, hoursNum);
    }

    const newErrors = {
      customerName: nameErr,
      phone: phoneErr,
      date: dateErr,
      startHour: startHourErr,
      hours: hoursErr || endHourErr,
    };

    setErrors(newErrors);

    if (nameErr || phoneErr || dateErr || startHourErr || hoursErr || endHourErr) {
      return;
    }

    const result = onSubmit({
      customerName: customerName.trim(),
      phone: phone.trim(),
      date: date.trim(),
      startHour: startHourNum,
      hours: hoursNum,
    });

    if (result.success) {
      Alert.alert('Thành công', 'Đặt sân thành công!');
      onClose();
    } else {
      Alert.alert('Lỗi đặt sân', result.error || 'Không thể đặt sân lúc này.');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.titleContainer}>
              <Ionicons name="calendar" size={22} color={colors.primary} />
              <Text style={styles.modalTitle}>Đặt {field.name}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.formScroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Tên khách */}
            <CustomInput
              label="Tên khách hàng"
              required
              placeholder="Ví dụ: Nguyễn Văn A"
              iconName="person-outline"
              value={customerName}
              onChangeText={text => {
                setCustomerName(text);
                if (errors.customerName) setErrors(prev => ({ ...prev, customerName: null }));
              }}
              error={errors.customerName}
            />

            {/* Số điện thoại */}
            <CustomInput
              label="Số điện thoại"
              required
              placeholder="Ví dụ: 0912345678"
              iconName="call-outline"
              keyboardType="phone-pad"
              maxLength={10}
              value={phone}
              onChangeText={text => {
                setPhone(text);
                if (errors.phone) setErrors(prev => ({ ...prev, phone: null }));
              }}
              error={errors.phone}
            />

            {/* Ngày đặt */}
            <CustomInput
              label="Ngày đặt sân (dd/mm/yyyy)"
              required
              placeholder="dd/mm/yyyy (ví dụ: 28/10/2026)"
              iconName="calendar-outline"
              value={date}
              onChangeText={text => {
                setDate(text);
                if (errors.date) setErrors(prev => ({ ...prev, date: null }));
              }}
              error={errors.date}
            />

            {/* Khung giờ & Số giờ thuê */}
            <View style={styles.row}>
              <View style={styles.flexHalf}>
                <CustomInput
                  label="Giờ bắt đầu (6 - 22)"
                  required
                  placeholder="6 - 22"
                  iconName="time-outline"
                  keyboardType="numeric"
                  maxLength={2}
                  value={startHourStr}
                  onChangeText={text => {
                    setStartHourStr(text);
                    if (errors.startHour) setErrors(prev => ({ ...prev, startHour: null }));
                  }}
                  error={errors.startHour}
                />
              </View>

              <View style={styles.flexHalf}>
                <CustomInput
                  label="Số giờ thuê (1 - 3)"
                  required
                  placeholder="1 - 3"
                  iconName="hourglass-outline"
                  keyboardType="numeric"
                  maxLength={1}
                  value={hoursStr}
                  onChangeText={text => {
                    setHoursStr(text);
                    if (errors.hours) setErrors(prev => ({ ...prev, hours: null }));
                  }}
                  error={errors.hours}
                />
              </View>
            </View>

            {/* Khung tính Thành tiền tức thì */}
            <View style={styles.priceCalculationBox}>
              <View style={styles.priceRow}>
                <Text style={styles.calcLabel}>Giá sân:</Text>
                <Text style={styles.calcValue}>{field.pricePerHour.toLocaleString('vi-VN')} đ/giờ</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.calcLabel}>Thời gian:</Text>
                <Text style={styles.calcValue}>{validHours} giờ</Text>
              </View>
              <View style={styles.calcDivider} />
              <View style={styles.priceRow}>
                <Text style={styles.totalPriceLabel}>Thành tiền:</Text>
                <Text style={styles.totalPriceValue}>{formatCurrency(totalPrice)}</Text>
              </View>
            </View>

            {/* Nút hành động */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.cancelBtn}
                onPress={onClose}
              >
                <Ionicons name="arrow-back-outline" size={18} color={colors.textSecondary} />
                <Text style={styles.cancelBtnText}>Đóng</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.confirmBtn}
                onPress={handleSubmit}
              >
                <Ionicons name="checkmark-outline" size={18} color={colors.textWhite} />
                <Text style={styles.confirmBtnText}>Xác nhận đặt</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  formScroll: {
    maxHeight: 460,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flexHalf: {
    flex: 1,
  },
  priceCalculationBox: {
    backgroundColor: colors.primaryLight,
    padding: 14,
    borderRadius: 10,
    marginTop: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 2,
  },
  calcLabel: {
    fontSize: 13,
    color: colors.primaryDark,
  },
  calcValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  calcDivider: {
    height: 1,
    backgroundColor: '#86EFAC',
    marginVertical: 8,
  },
  totalPriceLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  totalPriceValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 10,
    marginBottom: 10,
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.disabledBg,
    gap: 6,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.primary,
    gap: 6,
  },
  confirmBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textWhite,
  },
});

