import { Platform } from 'react-native'

// Адрес API для локального запуска: Android-эмулятор обращается к хосту через 10.0.2.2,
// а iOS-симулятор и web могут использовать localhost.
const fallback = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000'

// В реальной сборке значение задаётся переменной EXPO_PUBLIC_API_URL.
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? fallback
