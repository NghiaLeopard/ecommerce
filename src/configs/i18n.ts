import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'

i18n
  .use(Backend)

  // Enable automatic language detection
  .use(LanguageDetector)

  // Enables the hook initialization module
  .use(initReactI18next)

  // initialize
  .init({
    lng: 'vi',
    backend: {
      /* translation file path */
      loadPath: '/locales/{{lng}}.json'
    },

    // default
    fallbackLng: 'vi',
    debug: false,
    keySeparator: false,
    react: {
      //
      useSuspense: false
    },
    interpolation: {
      // escapeValue: false then it will understand contain html ,...
      // escapeValue: true then it understand to key
      escapeValue: false,

      // format 100000: 100,000
      formatSeparator: ','
    }
  })

export default i18n


export const LANGUAGE_OPTION = [
  {
    lang: 'Tiếng Việt',
    value: 'vi'
  },
  {
    lang: 'English',
    value: 'en'
  }
]
