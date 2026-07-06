import clsx from "clsx";
import AccountTab from "./AccountTab";
import OrganizationTab from "./OrganizationTab";
import GeneralTab from "./GeneralTab";
import AuditLogTab from "./AuditLogTab";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/common/ui/dialog";
import { useMain } from "@/pages/contexts/MainLayoutContext";
import { useState } from "react";
import { User, Users, Settings, LucideNotebookText } from "lucide-react";

type Tab = "account" | "organization" | "general" | "auditlog";

type SidebarItem = {
  label: "Account" | "Organization" | "General" | "Audit Log";
  tab: Tab;
  icon: React.ElementType;
};

const sidebarItems: SidebarItem[] = [
  { label: "Account", tab: "account", icon: User },
  { label: "Organization", tab: "organization", icon: Users },
  { label: "General", tab: "general", icon: Settings },
  { label: "Audit Log", tab: "auditlog", icon: LucideNotebookText },
];

const tabMap: Record<Tab, React.ReactNode> = {
  account: <AccountTab />,
  organization: <OrganizationTab />,
  general: <GeneralTab />,
  auditlog: <AuditLogTab />,
};

const SettingsDialog = () => {
  const [activeTab, setActiveTab] = useState<Tab>("account");
  const { settingsDialogOpen, setSettingsDialogOpen } = useMain();
  return (
    <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
      <DialogContent className="gap-0 p-0 sm:max-w-225">
        <DialogHeader className="border-b p-4">
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="flex h-125 w-full">
          <div className="bg-sidebar/30 flex h-full w-fit flex-col gap-1 p-2">
            {sidebarItems.map((i, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(i.tab)}
                className={clsx(
                  "hover:text-sidebar-accent-foreground hover:bg-sidebar-accent",
                  "flex items-center gap-2 rounded-sm p-2 hover:cursor-pointer",
                  {
                    "bg-sidebar-accent text-sidebar-accent-foreground":
                      i.tab === activeTab,
                  },
                )}
              >
                <i.icon className="size-4 shrink-0" color="#1e2939" />
                <span>{i.label}</span>
              </button>
            ))}
          </div>
          <div className="flex-1 border-l p-2">{tabMap[activeTab]}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
