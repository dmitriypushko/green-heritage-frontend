import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import uaTranslation from './locales/ua.json';
import ruTranslation from './locales/ru.json';
import enTranslation from './locales/en.json';

i18n
  // Подключаем детектор (он сначала проверит, менял ли пользователь язык раньше)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ua: { translation: uaTranslation },
      ru: { translation: ruTranslation },
      en: { translation: enTranslation }
    },
    fallbackLng: 'ua', // Если что-то сломалось — включаем UA
    
    // Настройки детектора, чтобы при первом заходе по закону стоял UA
    detection: {
      order: ['localStorage', 'navigator'], // сначала проверяем сохраненный выбор, потом язык браузера
      caches: ['localStorage'], // запоминаем выбор пользователя в браузере
    },

    interpolation: {
      escapeValue: false
    }
  });

// Если пользователь зашел впервые и язык не сохранен, принудительно ставим 'ua' по умолчанию
if (!localStorage.getItem('i18nextLng')) {
  i18n.changeLanguage('ua');
}

export default i18n;