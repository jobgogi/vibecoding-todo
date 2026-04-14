import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'ko', label: '한국어' },
  { code: 'ja', label: '日本語' },
  { code: 'zh', label: '中文' },
];

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const current = i18n.language;

  const handleChange = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('lang', code);
  };

  return (
    <div className="flex items-center gap-0.5">
      {LANGUAGES.map((lang, idx) => (
        <span key={lang.code} className="flex items-center">
          <button
            data-testid={`lang-${lang.code}`}
            onClick={() => handleChange(lang.code)}
            className={`px-2 py-1 text-xs rounded-lg transition-all ${
              current === lang.code
                ? 'bg-indigo-100 text-indigo-600 font-semibold'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
          >
            {lang.label}
          </button>
          {idx < LANGUAGES.length - 1 && (
            <span className="text-gray-200 text-xs select-none">·</span>
          )}
        </span>
      ))}
    </div>
  );
}
