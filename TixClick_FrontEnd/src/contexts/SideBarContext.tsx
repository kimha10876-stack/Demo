import { createContext, useState } from "react";

// Tạo context với giá trị khởi tạo là undefined, để đảm bảo sử dụng đúng context.
const SidebarContext = createContext<
  | {
      isCollapsed: boolean;
      toggleSidebar: () => void;
    }
  | undefined
>(undefined); // Ban đầu không có giá trị

const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev); // Đổi trạng thái mỗi lần toggle
  };

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export { SidebarProvider, SidebarContext };
