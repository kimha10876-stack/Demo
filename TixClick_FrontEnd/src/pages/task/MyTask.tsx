import { Outlet } from "react-router";
import { TaskSidebar } from "./components/TaskSidebar";
import Header from "../../components/Header/Header";
import { SidebarContext } from "../../contexts/SideBarContext";
import { useContext } from "react";
import { cn } from "../../lib/utils";

const MyTask = () => {
  const context = useContext(SidebarContext);
  return (
    <div className="min-h-screen pt-20 px-4 lg:px-14">
      <Header />
      <TaskSidebar />
      <main
        className={cn(
          "flex-1 transition-all duration-300 bg-[#1e1e1e]",
          context?.isCollapsed == true ? "ml-20" : "ml-60"
        )}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default MyTask;
