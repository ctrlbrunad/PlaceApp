import axios from 'axios';
import { Platform } from 'react-native';

const ipDoSeuPC = '192.168.1.10'; 

const baseURL_Web = 'http://localhost:3000';
const baseURL_Mobile = 'http://192.168.1.10:3000';

const baseURL = Platform.OS === 'web' ? baseURL_Web : baseURL_Mobile;

const api = axios.create({
  baseURL: baseURL,
});

console.log(`API inicializada com baseURL: ${baseURL}`);

export default api;