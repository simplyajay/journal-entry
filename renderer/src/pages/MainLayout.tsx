import Sidebar2 from "@/components/common/sidebar/Sidebar";
import SettingsDialog from "@/components/common/dialog/SettingsDialog";
import { Outlet } from "react-router-dom";
import { MainProvider } from "./contexts/MainLayoutContext";

const MainLayout = () => {
  return (
    <MainProvider>
      <div className="flex h-full [--sidebar-width-icon:3rem] [--sidebar-width:12rem]">
        <Sidebar2 />

        <main className="flex flex-1 justify-center overflow-auto bg-white px-4 py-8">
          <div className="h-fit w-full max-w-5xl">
            <Outlet />
          </div>
        </main>

        <SettingsDialog />
      </div>
    </MainProvider>
  );
};

export default MainLayout;
