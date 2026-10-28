import React, { createContext, useContext, useEffect, useState } from 'react';
import { Booking, Field } from '../types';
import { loadInitialData, saveBookings, saveFields } from '../services/storage';
import { checkBookingOverlap, validateFieldName, validateFieldPrice } from '../utils/validators';

interface AppContextType {
  fields: Field[];
  bookings: Booking[];
  isLoading: boolean;
  addField: (fieldData: Omit<Field, 'id'>) => { success: boolean; error?: string };
  updateField: (id: string, fieldData: Omit<Field, 'id'>) => { success: boolean; error?: string };
  deleteField: (id: string) => { success: boolean; error?: string };
  addBooking: (bookingData: Omit<Booking, 'id'>) => { success: boolean; error?: string };
  cancelBooking: (id: string) => void;
  getBookingsByFieldId: (fieldId: string) => Booking[];
  getFieldById: (fieldId: string) => Field | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fields, setFields] = useState<Field[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const init = async () => {
      const data = await loadInitialData();
      setFields(data.fields);
      setBookings(data.bookings);
      setIsLoading(false);
    };
    init();
  }, []);

  const addField = (fieldData: Omit<Field, 'id'>): { success: boolean; error?: string } => {
    const nameError = validateFieldName(fieldData.name, fields);
    if (nameError) {
      return { success: false, error: nameError };
    }

    const priceError = validateFieldPrice(fieldData.pricePerHour.toString());
    if (priceError) {
      return { success: false, error: priceError };
    }

    const newField: Field = {
      ...fieldData,
      id: `field_${Date.now()}`,
      name: fieldData.name.trim(),
    };

    const updatedFields = [...fields, newField];
    setFields(updatedFields);
    saveFields(updatedFields);
    return { success: true };
  };

  const updateField = (id: string, fieldData: Omit<Field, 'id'>): { success: boolean; error?: string } => {
    const nameError = validateFieldName(fieldData.name, fields, id);
    if (nameError) {
      return { success: false, error: nameError };
    }

    const priceError = validateFieldPrice(fieldData.pricePerHour.toString());
    if (priceError) {
      return { success: false, error: priceError };
    }

    const updatedFields = fields.map(f =>
      f.id === id ? { ...fieldData, id, name: fieldData.name.trim() } : f
    );
    setFields(updatedFields);
    saveFields(updatedFields);
    return { success: true };
  };

  const deleteField = (id: string): { success: boolean; error?: string } => {
    // Không cho xoá sân đang có lượt đặt, báo lỗi bằng Alert.
    const hasBooking = bookings.some(b => b.fieldId === id);
    if (hasBooking) {
      return {
        success: false,
        error: 'Không thể xoá sân đang có lượt đặt! Vui lòng huỷ các lượt đặt trước khi xoá sân.',
      };
    }

    const updatedFields = fields.filter(f => f.id !== id);
    setFields(updatedFields);
    saveFields(updatedFields);
    return { success: true };
  };

  const addBooking = (bookingData: Omit<Booking, 'id'>): { success: boolean; error?: string } => {
    // Kiểm tra trùng lịch: cùng sân, cùng ngày và khung giờ giao nhau
    const overlapResult = checkBookingOverlap(
      bookingData.fieldId,
      bookingData.date,
      bookingData.startHour,
      bookingData.hours,
      bookings
    );

    if (overlapResult.isOverlap) {
      const conflict = overlapResult.conflictingBooking!;
      const conflictEnd = conflict.startHour + conflict.hours;
      return {
        success: false,
        error: `Trùng lịch! Đã có khách "${conflict.customerName}" đặt khung giờ ${conflict.startHour}h - ${conflictEnd}h ngày ${conflict.date}.`,
      };
    }

    const newBooking: Booking = {
      ...bookingData,
      id: `booking_${Date.now()}`,
      customerName: bookingData.customerName.trim(),
      phone: bookingData.phone.trim(),
      date: bookingData.date.trim(),
    };

    const updatedBookings = [newBooking, ...bookings];
    setBookings(updatedBookings);
    saveBookings(updatedBookings);
    return { success: true };
  };

  const cancelBooking = (id: string) => {
    const updatedBookings = bookings.filter(b => b.id !== id);
    setBookings(updatedBookings);
    saveBookings(updatedBookings);
  };

  const getBookingsByFieldId = (fieldId: string): Booking[] => {
    return bookings.filter(b => b.fieldId === fieldId);
  };

  const getFieldById = (fieldId: string): Field | undefined => {
    return fields.find(f => f.id === fieldId);
  };

  return (
    <AppContext.Provider
      value={{
        fields,
        bookings,
        isLoading,
        addField,
        updateField,
        deleteField,
        addBooking,
        cancelBooking,
        getBookingsByFieldId,
        getFieldById,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

