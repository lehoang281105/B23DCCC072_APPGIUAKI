/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// Đăng ký ứng dụng cho cả tên project hiện tại và các app alias trên emulator/thiết bị
AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent('th3', () => App);
AppRegistry.registerComponent('FootballFieldApp', () => App);

