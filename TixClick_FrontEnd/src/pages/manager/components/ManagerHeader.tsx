
interface DashboardHeaderProps {
  heading: string
  text?: string
}

export function ManagerHeader({ heading, text }: DashboardHeaderProps) {
  return (
    <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b border-[#333333] bg-[#1E1E1E] px-6">
      {/* <SidebarTrigger /> */}
      <div className="flex-1">
        <h1 className="text-lg font-semibold text-white">{heading}</h1>
        {text && <p className="text-sm text-gray-400">{text}</p>}
      </div>
    </header>
  )
}

