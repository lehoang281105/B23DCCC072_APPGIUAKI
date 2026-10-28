import AsyncStorage from '@react-native-async-storage/async-storage';
import { Booking, Field } from '../types';
import { INITIAL_BOOKINGS, INITIAL_FIELDS } from '../utils/initialData';

const FIELDS_STORAGE_KEY = '@football_app_fields';
const BOOKINGS_STORAGE_KEY = '@football_app_bookings';

export const loadInitialData = async (): Promise<{ fields: Field[]; bookings: Booking[] }> => {
  try {
    const [fieldsJson, bookingsJson] = await Promise.all([
      AsyncStorage.getItem(FIELDS_STORAGE_KEY),
      AsyncStorage.getItem(BOOKINGS_STORAGE_KEY),
    ]);

    let fields: Field[] = INITIAL_FIELDS;
    let bookings: Booking[] = INITIAL_BOOKINGS;

    if (fieldsJson !== null) {
      try {
        fields = JSON.parse(fieldsJson);
      } catch (e) {
        console.error('Error parsing fields JSON', e);
      }
    } else {
      // Lưu lại dữ liệu mẫu cho lần sau
      await AsyncStorage.setItem(FIELDS_STORAGE_KEY, JSON.stringify(INITIAL_FIELDS));
    }

    if (bookingsJson !== null) {
      try {
        bookings = JSON.parse(bookingsJson);
      } catch (e) {
        console.error('Error parsing bookings JSON', e);
      }
    } else {
      // Lưu lại dữ liệu mẫu cho lần sau
      await AsyncStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(INITIAL_BOOKINGS));
    }

    return { fields, bookings };
  } catch (error) {
    console.error('Error loading data from AsyncStorage', error);
    return { fields: INITIAL_FIELDS, bookings: INITIAL_BOOKINGS };
  }
};

export const saveFields = async (fields: Field[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(FIELDS_STORAGE_KEY, JSON.stringify(fields));
  } catch (error) {
    console.error('Error saving fields to AsyncStorage', error);
  }
};

export const saveBookings = async (bookings: Booking[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
  } catch (error) {
    console.error('Error saving bookings to AsyncStorage', error);
  }
};

