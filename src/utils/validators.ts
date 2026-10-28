import { Booking, Field } from '../types';


export const validateFieldName = (
  name: string,
  existingFields: Field[],
  currentFieldId?: string
): string | null => {
  const trimmed = name.trim();
  if (!trimmed) {
    return 'Tên sân không được để trống.';
  }

  const isDuplicate = existingFields.some(
    f =>
      f.id !== currentFieldId &&
      f.name.trim().toLowerCase() === trimmed.toLowerCase()
  );

  if (isDuplicate) {
    return 'Tên sân đã tồn tại, vui lòng chọn tên khác.';
  }

  return null;
};


export const validateFieldPrice = (priceStr: string): string | null => {
  const trimmed = priceStr.trim();
  if (!trimmed) {
    return 'Giá thuê không được để trống.';
  }

  const num = Number(trimmed);
  if (isNaN(num)) {
    return 'Giá thuê phải là một số.';
  }

  if (num <= 0) {
    return 'Giá thuê phải lớn hơn 0.';
  }

  return null;
};


export const validateCustomerName = (name: string): string | null => {
  if (!name.trim()) {
    return 'Tên khách hàng không được để trống.';
  }
  return null;
};


export const validatePhone = (phone: string): string | null => {
  const trimmed = phone.trim();
  if (!trimmed) {
    return 'Số điện thoại không được để trống.';
  }

  const phoneRegex = /^0\d{9}$/;
  if (!phoneRegex.test(trimmed)) {
    return 'Số điện thoại phải có 10 chữ số và bắt đầu bằng số 0.';
  }

  return null;
};


export const validateDate = (dateStr: string): string | null => {
  const trimmed = dateStr.trim();
  if (!trimmed) {
    return 'Ngày đặt sân không được để trống.';
  }

  const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = trimmed.match(dateRegex);
  if (!match) {
    return 'Định dạng ngày phải là dd/mm/yyyy (ví dụ: 28/10/2026).';
  }

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);

  if (month < 1 || month > 12) {
    return 'Tháng không hợp lệ (phải từ 01 đến 12).';
  }

  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) {
    return `Ngày không hợp lệ trong tháng ${month} (từ 01 đến ${daysInMonth}).`;
  }

  return null;
};


export const validateStartHour = (startHour: number): string | null => {
  if (isNaN(startHour)) {
    return 'Giờ bắt đầu phải là số.';
  }
  if (!Number.isInteger(startHour)) {
    return 'Giờ bắt đầu phải là số nguyên.';
  }
  if (startHour < 6 || startHour > 22) {
    return 'Giờ bắt đầu phải từ 6 đến 22.';
  }
  return null;
};


export const validateHours = (hours: number): string | null => {
  if (isNaN(hours)) {
    return 'Số giờ thuê phải là số.';
  }
  if (!Number.isInteger(hours)) {
    return 'Số giờ thuê phải là số nguyên.';
  }
  if (hours < 1 || hours > 3) {
    return 'Số giờ thuê chỉ được từ 1 đến 3 giờ.';
  }
  return null;
};


export const validateEndHour = (startHour: number, hours: number): string | null => {
  const endHour = startHour + hours;
  if (endHour > 23) {
    return `Giờ kết thúc (${endHour}h) vượt quá 23h. Quán đóng cửa lúc 23h.`;
  }
  return null;
};


// check trùng lịch
export const checkBookingOverlap = (
  fieldId: string,
  date: string,
  startHour: number,
  hours: number,
  existingBookings: Booking[],
  currentBookingId?: string
): { isOverlap: boolean; conflictingBooking?: Booking } => {
  const newEndHour = startHour + hours;
  const targetDate = date.trim();

  for (const b of existingBookings) {
    if (currentBookingId && b.id === currentBookingId) {
      continue;
    }

    if (b.fieldId === fieldId && b.date.trim() === targetDate) {
      const bEndHour = b.startHour + b.hours;
      const overlapStart = Math.max(startHour, b.startHour);
      const overlapEnd = Math.min(newEndHour, bEndHour);

      if (overlapStart < overlapEnd) {
        return { isOverlap: true, conflictingBooking: b };
      }
    }
  }

  return { isOverlap: false };
};

