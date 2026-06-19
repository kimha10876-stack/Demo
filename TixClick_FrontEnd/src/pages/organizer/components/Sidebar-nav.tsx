import { Book, FileText, PlusCircle } from 'lucide-react'
import { useLanguage } from './LanguageContext'


export function SidebarNav() {
  const { t } = useLanguage()
  
  return (
    <nav className="fixed left-0 top-20 w-64 h-[calc(100vh-64px)] bg-[#0a0a0a] text-white p-4">
      <div className="space-y-1">
        <a 
          href="/MyEvent" 
          className="flex items-center gap-3 px-4 py-2 text-white hover:bg-white/10 rounded-lg"
        >
          <FileText className="w-5 h-5" />
          <span>{t.nav.events}</span>
        </a>
        <a 
          href="/ExportFileManagement" 
          className="flex items-center gap-3 px-4 py-2 text-white hover:bg-white/10 rounded-lg"
        >
          <FileText className="w-5 h-5" />
          <span>{t.nav.fileManagement}</span>
        </a>
        <a 
          href="#" 
          className="flex items-center gap-3 px-4 py-2 text-white hover:bg-white/10 rounded-lg"
        >
          <PlusCircle className="w-5 h-5" />
          <span>{t.nav.createEvent}</span>
        </a>
        <a 
          href="#" 
          className="flex items-center gap-3 px-4 py-2 text-white hover:bg-white/10 rounded-lg"
        >
          <Book className="w-5 h-5" />
          <span>{t.nav.terms}</span>
        </a>
      </div>
    </nav>
  )
}

