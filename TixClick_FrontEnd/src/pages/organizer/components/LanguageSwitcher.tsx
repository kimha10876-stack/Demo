import English from "../../../assets/Eng-flag.png"
import Vietnam from "../../../assets/Vie-flag.png"
import { useLanguage } from "./LanguageContext"

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className="fixed bottom-4 left-4 flex items-center gap-2">
      <span className="text-sm text-gray-400">{t.language}</span>
      <button
        onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
        className="flex items-center gap-2 px-3 py-1.5 rounded bg-gray-800 text-white text-sm"
      >
        {language === 'vi' ? 'Vie' : 'Eng'}
        <img 
          src={language === 'vi' ? Vietnam : English}
          alt={language === 'vi' ? 'Vietnamese' : 'English'}
          className="w-4 h-3 object-cover"
        />
      </button>
    </div>
  )
}
