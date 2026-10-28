import { Booking, Field } from '../types';

export const INITIAL_FIELDS: Field[] = [
  {
    id: 'field_1',
    name: 'Sân A1',
    type: '5 người',
    pricePerHour: 250000,
    status: 'Hoạt động',
  },
  {
    id: 'field_2',
    name: 'Sân A2',
    type: '5 người',
    pricePerHour: 250000,
    status: 'Hoạt động',
  },
  {
    id: 'field_3',
    name: 'Sân B1',
    type: '7 người',
    pricePerHour: 400000,
    status: 'Hoạt động',
  },
  {
    id: 'field_4',
    name: 'Sân C1',
    type: '7 người',
    pricePerHour: 350000,
    status: 'Bảo trì',
  },
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'booking_1',
    fieldId: 'field_1',
    customerName: 'Nguyễn Văn Tuấn',
    phone: '0912345678',
    date: '28/10/2026',
    startHour: 17,
    hours: 2,
  },
  {
    id: 'booking_2',
    fieldId: 'field_2',
    customerName: 'Trần Hải Nam',
    phone: '0987654321',
    date: '28/10/2026',
    startHour: 19,
    hours: 1,
  },
  {
    id: 'booking_3',
    fieldId: 'field_3',
    customerName: 'Lê Hoàng Phúc',
    phone: '0903123456',
    date: '29/10/2026',
    startHour: 8,
    hours: 2,
  },
];

