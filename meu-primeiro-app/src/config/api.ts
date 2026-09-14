import { Platform } from 'react-native';

// Altere para o IP da sua máquina se estiver testando no celular físico (Expo Go)
const LOCAL_IP = '192.168.1.16';

export const API_BASE_URL = Platform.OS === 'web'
  ? 'http://localhost:3000'
  : `http://${LOCAL_IP}:3000`;
