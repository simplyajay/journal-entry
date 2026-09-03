import DataTable from "@/components/common/table/DataTable";
import { AccountInformationForm } from "./AccountForms";
import { ProfileInformationForm } from "./AccountForms";
import { useCurrentUser } from "@/contexts/useAuth";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import type { DataTableColumn } from "@/components/common/table/DataTable";
import type { LoginHistory } from "@/types/log";

const sectionClass = "flex flex-col gap-4 border-b py-4";
const labelClass = "font-manrope text-xs font-bold text-gray-500";

const columns: DataTableColumn<LoginHistory>[] = [
  {
    label: "Date",
    name: "createdAt",
    render: (row) => new Date(row.createdAt).toLocaleString(),
  },
  {
    label: "Status",
    name: "status",
    render: (row) => (
      <span
        className={
          row.status === "success"
            ? "text-green-600"
            : row.status === "failed"
              ? "text-red-600"
              : ""
        }
      >
        {row.status}
      </span>
    ),
  },
  {
    label: "Reason",
    name: "reason",
  },
];

const Account = () => {
  const currentUser = useCurrentUser();
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = currentUser.id;

  useEffect(() => {
    let cancelled = false;

    const getLoginHistory = async () => {
      const result = await window.api.log.getLoginHistory(userId);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (cancelled) return;

      if (result.success) {
        setLoginHistory(result.data);
        setError(null);
      } else {
        setLoginHistory([]);
        setError("Could not load login history.");
      }

      setLoading(false);
    };

    getLoginHistory();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return (
    <div className="flex w-full flex-col gap-2 p-4">
      <div className={sectionClass}>
        <label htmlFor="profile" className={labelClass}>
          PROFILE
        </label>
        <div className="w-full">
          <ProfileInformationForm />
        </div>
      </div>
      <div className={sectionClass}>
        <label htmlFor="account" className={labelClass}>
          ACCOUNT
        </label>
        <div className="w-full">
          <AccountInformationForm />
        </div>
      </div>
      <div className={sectionClass}>
        <label htmlFor="account" className={labelClass}>
          LOGIN HISTORY
        </label>
        {loading ? (
          <div className="flex w-full items-center justify-center">
            <Loader2 className="mr-2 size-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="w-full">
            <DataTable<LoginHistory>
              columns={columns}
              getRowId={(row) => row.id}
              rows={loginHistory}
              emptyMessage={error ?? "No sign-ins recorded yet."}
              noBorder
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
