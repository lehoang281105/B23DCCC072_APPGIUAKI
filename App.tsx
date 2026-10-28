import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';

import { RootStackParamList } from './src/types';
import { AppProvider } from './src/context/AppContext';
import { colors } from './src/theme/colors';

import { FieldListScreen } from './src/screens/FieldListScreen';
import { FieldFormScreen } from './src/screens/FieldFormScreen';
import { FieldDetailScreen } from './src/screens/FieldDetailScreen';

enableScreens();

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <AppProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="FieldList"
            screenOptions={{
              headerStyle: {
                backgroundColor: colors.primary,
              },
              headerTintColor: colors.textWhite,
              headerTitleStyle: {
                fontWeight: '700',
                fontSize: 18,
              },
              contentStyle: {
                backgroundColor: colors.background,
              },
            }}
          >
            <Stack.Screen
              name="FieldList"
              component={FieldListScreen}
              options={{
                title: 'Quản Lý Sân Bóng',
              }}
            />
            <Stack.Screen
              name="FieldForm"
              component={FieldFormScreen}
              options={{
                title: 'Thông Tin Sân Bóng',
              }}
            />
            <Stack.Screen
              name="FieldDetail"
              component={FieldDetailScreen}
              options={{
                title: 'Chi Tiết Sân Bóng',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}

export default App;
