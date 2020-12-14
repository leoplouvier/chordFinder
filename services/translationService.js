import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./translations/en.json";
import fr from "./translations/fr.json";
import { NativeModules } from "react-native";

const locale = NativeModules.I18nManager.localeIdentifier;
const languageDetector = {
  type: "languageDetector",
  async: true,
  detect: (cb) => {
    const lang = locale.includes("fr") ? "fr" : "en";
    cb(lang);
  },
  init: () => {},
  cacheUserLanguage: () => {},
};
const resources = {
  en: { translation: en },
  fr: { translation: fr },
};
i18n
  .use(languageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
