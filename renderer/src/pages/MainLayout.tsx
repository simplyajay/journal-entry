import Sidebar2 from "@/components/common/sidebar/Sidebar";
import SettingsDialog from "@/features/settings/dialog/SettingsDialog";
import { Outlet } from "react-router-dom";
import { MainProvider } from "./contexts/MainLayoutContext";

const MainLayout = () => {
  return (
    <MainProvider>
      <div className="flex h-full bg-white [--sidebar-width-icon:3rem] [--sidebar-width:12rem]">
        <Sidebar2 />

        <main className="flex flex-1 scrollbar-gutter-stable justify-center overflow-auto px-4 py-8">
          <div className="h-full w-full max-w-5xl">
            <Outlet />
          </div>
        </main>

        <SettingsDialog />
      </div>
    </MainProvider>
  );
};

export default MainLayout;
