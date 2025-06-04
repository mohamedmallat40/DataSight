import { useLocale } from "@react-aria/i18n";

import { translations, type TranslationKey } from "../i18n/translations";

export function useTranslations() {
  const { locale } = useLocale();
  // Get first two characters of the locale (e.g., "en" from "en-US")
  const lang = locale.slice(0, 2) as keyof typeof translations;

  const t = (key: TranslationKey) => {
    // Type assertion to tell TypeScript each language object has the same structure
    return (
      (translations[lang] as Record<TranslationKey, string>)?.[key] ||
      translations.en[key]
    );
  };

  return { t };
}
