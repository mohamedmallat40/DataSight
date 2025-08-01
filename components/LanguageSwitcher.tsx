import { useState, useCallback } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Selection,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useLocale } from "@react-aria/i18n";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  flagIcon: string;
  rtl?: boolean;
}

interface LanguageSwitcherProps {
  onChange: (locale: string) => void;
  variant?: "compact" | "full";
  size?: "sm" | "md" | "lg";
  showFlag?: boolean;
  showNative?: boolean;
}

const languages: Language[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
    flagIcon: "circle-flags:us",
  },
  {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    flag: "🇸🇦",
    flagIcon: "circle-flags:sa",
    rtl: true,
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    flag: "🇫🇷",
    flagIcon: "circle-flags:fr",
  },
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
    flagIcon: "circle-flags:es",
  },
  {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    flag: "🇩🇪",
    flagIcon: "circle-flags:de",
  },
];

export const LanguageSwitcher = ({
  onChange,
  variant = "compact",
  size = "sm",
  showFlag = true,
  showNative = false,
}: LanguageSwitcherProps) => {
  const { locale } = useLocale();
  const [selectedKeys, setSelectedKeys] = useState<Selection>(
    new Set([locale || "en"]),
  );

  const currentLanguage =
    languages.find((lang) => lang.code === locale) || languages[0];

  const handleSelectionChange = useCallback(
    (keys: Selection) => {
      const selectedKey = Array.from(keys)[0] as string;

      if (selectedKey && selectedKey !== locale) {
        setSelectedKeys(keys);
        onChange(selectedKey);

        // Update document direction for RTL languages
        const selectedLang = languages.find(
          (lang) => lang.code === selectedKey,
        );

        if (selectedLang?.rtl) {
          document.documentElement.setAttribute("dir", "rtl");
          document.documentElement.setAttribute("lang", selectedKey);
        } else {
          document.documentElement.setAttribute("dir", "ltr");
          document.documentElement.setAttribute("lang", selectedKey);
        }
      }
    },
    [locale, onChange],
  );

  const renderLanguageItem = (
    language: Language,
    isSelected: boolean = false,
  ) => {
    return (
      <div className="flex items-center gap-2 w-full">
        {showFlag && (
          <Icon
            className="rounded-full"
            height={18}
            icon={language.flagIcon}
            style={{ minWidth: "18px" }}
            width={18}
          />
        )}
        <div className="flex flex-col">
          <span
            className={`font-medium ${isSelected ? "text-primary" : "text-foreground"}`}
          >
            {showNative ? language.nativeName : language.name}
          </span>
          {variant === "full" && (
            <span className="text-tiny text-default-500">
              {showNative ? language.name : language.nativeName}
            </span>
          )}
        </div>
        {isSelected && (
          <Icon
            className="text-primary ml-auto"
            height={16}
            icon="solar:check-circle-bold"
            width={16}
          />
        )}
      </div>
    );
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          aria-label="Select language"
          className="min-w-[60px] h-unit-10 px-2 text-default-600 hover:text-foreground transition-colors"
          size={size}
          variant="light"
        >
          {variant === "compact" ? (
            <div className="flex items-center gap-1.5">
              {showFlag && (
                <Icon
                  className="rounded-full"
                  height={16}
                  icon={currentLanguage.flagIcon}
                  style={{ minWidth: "16px" }}
                  width={16}
                />
              )}
              <span className="text-tiny font-medium uppercase tracking-wide">
                {currentLanguage.code}
              </span>
              <Icon height={12} icon="solar:alt-arrow-down-linear" width={12} />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {renderLanguageItem(currentLanguage, true)}
              <Icon height={14} icon="solar:alt-arrow-down-linear" width={14} />
            </div>
          )}
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        aria-label="Language selection"
        className="min-w-[200px]"
        itemClasses={{
          base: "py-2 px-3 data-[hover=true]:bg-default-100 data-[selected=true]:bg-primary/10",
        }}
        selectedKeys={selectedKeys}
        selectionMode="single"
        onSelectionChange={handleSelectionChange}
      >
        {languages.map((language) => (
          <DropdownItem
            key={language.code}
            className="group"
            textValue={language.name}
          >
            {renderLanguageItem(language, language.code === locale)}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default LanguageSwitcher;
