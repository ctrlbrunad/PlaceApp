import axios from 'axios';
import { Platform } from 'react-native';

// 1. Defina o IP CORRETO (do seu ipconfig)
const ipDoSeuPC = '192.168.1.13'; // <-- CORREÇÃO AQUI

// O resto do código já está certo
const baseURL_Web = 'http://localhost:3000';
const baseURL_Mobile = `http://${ipDoSeuPC}:3000`;

const baseURL = Platform.OS === 'web' ? baseURL_Web : baseURL_Mobile;

const api = axios.create({
  baseURL: baseURL,
});

console.log(`API inicializada com baseURL: ${baseURL}`);

export default api;