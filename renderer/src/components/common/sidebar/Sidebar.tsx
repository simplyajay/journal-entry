import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  SquarePen,
  List,
  LayoutDashboard,
  PanelLeft,
  LogOut,
  Settings,
} from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth } from "@/pages/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useMain } from "@/pages/contexts/MainLayoutContext";

const items = [
  { title: "Dashboard", url: "jev/dashboard", icon: LayoutDashboard },
  { title: "New JEV", url: "jev/create", icon: SquarePen },
  { title: "Journal Entries", url: "jev/list", icon: List },
];

const EXPANDED_WIDTH = "200px";
const COLLAPSED_WIDTH = "48px";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout, currentUser: user } = useAuth();
  const { setSettingsDialogOpen } = useMain();

  return (
    <div
      className="bg-sidebar/50 relative flex h-full shrink-0 flex-col overflow-hidden border-r text-gray-700 transition-[width] duration-200 ease-linear"
      style={{ width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH }}
    >
      <div className="flex h-14 shrink-0 items-center px-2">
        <div
          className={cn(
            "flex items-center gap-2 overflow-hidden transition-all duration-200",
            collapsed ? "w-0 opacity-0" : "flex-1 opacity-100",
          )}
        >
          <div className="bg-foreground text-background flex size-6 shrink-0 items-center justify-center rounded text-xs font-bold">
            A
          </div>
          <span className="text-sm font-medium whitespace-nowrap">App</span>
        </div>

        <button
          onClick={() => setCollapsed((c) => !c)}
          className="hover:text-sidebar-accent-foreground hover:bg-sidebar-accent flex size-8 shrink-0 items-center justify-center rounded-md transition-colors hover:cursor-pointer"
        >
          <PanelLeft className="size-4" />
        </button>
      </div>

      <div className="flex-1 overflow-x-hidden overflow-y-auto py-2">
        <div className="mb-1 flex h-6 items-center px-2">
          <span
            className={cn(
              "text-sidebar-foreground/70 font-manrope text-xs font-semibold whitespace-nowrap transition-opacity duration-200",
              collapsed ? "opacity-0" : "opacity-100",
            )}
          >
            Journal Entry Voucher
          </span>
        </div>

        <ul className="flex flex-col gap-0.5 px-2">
          {items.map((item) => (
            <li key={item.title}>
              <NavLink
                to={item.url}
                className={({ isActive }) =>
                  cn(
                    "font-manrope flex h-8 items-center gap-2 rounded-md px-2 text-sm transition-colors",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground",
                  )
                }
              >
                <item.icon className="size-4 shrink-0" color="#1e2939" />
                <span
                  className={cn(
                    "overflow-hidden whitespace-nowrap text-gray-800 transition-all duration-200",
                    collapsed ? "w-0 opacity-0" : "opacity-100",
                  )}
                >
                  {item.title}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground flex h-12 w-full items-center gap-2 rounded-md p-2 transition-colors hover:cursor-pointer">
              <div className="bor der flex size-7 shrink-0 items-center justify-center rounded-full bg-gray-400 text-[16px] font-medium">
                {user?.firstName.charAt(0).toUpperCase()}
              </div>
              <span
                className={cn(
                  "font-manrope overflow-hidden text-sm whitespace-nowrap transition-all duration-200",
                  collapsed ? "w-0 opacity-0" : "opacity-100",
                )}
              >
                {user?.firstName}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="p-1"
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            <DropdownMenuLabel>{user?.username}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:cursor-pointer">
              <button
                className="flex w-full items-center gap-2 p-1"
                onClick={() => setSettingsDialogOpen(true)}
              >
                <Settings className="size-4" />
                Settings
              </button>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <button
                className="flex w-full items-center gap-2 p-1 hover:cursor-pointer"
                onClick={logout}
              >
                <LogOut className="size-4" />
                Sign out
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Sidebar;
