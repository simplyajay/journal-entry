import {
  AccountInformationForm,
  ProfileInformationForm,
} from "@/components/form/account/AccountForms";
import { useAuth } from "@/pages/contexts/AuthContext";
import type { LoginHistory } from "@/types/log";
import { useEffect, useState } from "react";

const sectionClass = "flex flex-col gap-4 border-b py-4";
const labelClass = "font-manrope text-xs font-bold text-gray-500";

const AccountTab = () => {
  const { currentUser } = useAuth();
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
  const [loading, setLoading] = useState(false);

  const getLoginHistory = async () => {
    setLoading(true);

    if (!currentUser) return;

    const result = await window.api.log.getLoginHistory(currentUser.id);

    if (result.success) setLoginHistory(result.data);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setLoading(false);
  };

  useEffect(() => {
    getLoginHistory();
  }, []);

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
          <div className="w-full bg-red-500">Loading</div>
        ) : (
          <div className="w-full">
            <table>
              <thead>
                <tr>
                  <th>Date - Time</th>
                  <th>Status</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {loginHistory.map((data) => (
                  <tr key={data.id}>
                    <td>{new Date(data.createdAt).toLocaleString()}</td>
                    <td>{data.status}</td>
                    <td>{data.reason ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountTab;
