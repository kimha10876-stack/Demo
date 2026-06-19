import { useContext, useEffect, useState, type ReactNode } from "react";
import { Outlet } from "react-router";
import Header from "../../components/Header/Header";
import { ConsumerSidebar } from "./components/ConsumerSidebar";
import { Toaster } from "sonner";
import companyApi from "../../services/companyApi";
import { CompanyStatus } from "../../interface/company/Company";
import LockPage from "../../components/Lock/LockPage";
import { SidebarContext } from "../../contexts/SideBarContext";
import { cn } from "../../lib/utils";

export default function RootLayouts({ children }: { children?: ReactNode }) {
  const context = useContext(SidebarContext);
  const [statusCompany, setStatusCompany] = useState<CompanyStatus>();

  const checkStatusCompany = async () => {
    const response = await companyApi.isAccountHaveCompany();
    console.log(response);
    if (response.data.result) {
      setStatusCompany(response.data.result.status);
    }
  };
  // console.log(statusCompany);

  useEffect(() => {
    checkStatusCompany();
  }, []);
  return (
    <>
      {statusCompany == "PENDING" && (
        <LockPage
          status={statusCompany}
          message="Công ty của bạn chưa được quyền thao tác do chưa được chấp nhận"
        />
      )}
      {statusCompany == "REJECTED" && (
        <LockPage
          status={statusCompany}
          message="Công ty của bạn đã bị từ chối"
        />
      )}
      <Header />
      <div className="flex h-screen pt-16 bg-[#1a1a1a]">
        <aside className="fixed top-16 bottom-0">
          <ConsumerSidebar />
        </aside>

        <main
          className={cn(
            "flex-1 transition-all duration-300 bg-[#1e1e1e]",
            context?.isCollapsed == true ? "ml-20" : "ml-60"
          )}
        >
          {children || <Outlet />}
        </main>
      </div>

      <Toaster position="top-center" />
    </>
  );
}
