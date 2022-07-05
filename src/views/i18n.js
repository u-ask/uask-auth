import { createI18n } from "./js/vue-i18n.runtime.esm-browser.min.js";

const loc = new Intl.Locale(navigator.language);

export const i18n = createI18n({
  legacy: false,
  locale: loc.language,
  fallbackLocale: "en",
});
