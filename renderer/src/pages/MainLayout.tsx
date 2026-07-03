import Sidebar2 from "@/components/common/sidebar/Sidebar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex h-full [--sidebar-width-icon:3rem] [--sidebar-width:12rem]">
      <Sidebar2 />

      <main className="flex flex-1 justify-center overflow-auto bg-white px-4 py-8">
        <div className="h-fit w-full max-w-5xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
