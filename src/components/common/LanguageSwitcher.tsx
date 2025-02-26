import React from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language.startsWith('zh') ? 'zh-CN' : 'en';

  const toggleLanguage = () => {
    const nextLang = currentLang === 'en' ? 'zh-CN' : 'en';
    i18n.changeLanguage(nextLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`
        px-3 py-1 rounded-md text-sm font-medium transition-colors
        ${currentLang === 'en' 
          ? 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100' 
          : 'text-primary-600 hover:text-primary-700 hover:bg-primary-50'
        }
      `}
      aria-label="Toggle language"
    >
      {currentLang === 'en' ? '中文' : 'EN'}
    </button>
  );
};
