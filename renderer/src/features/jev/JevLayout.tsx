import { Outlet } from "react-router-dom";
import { JevListFilterProvider } from "./list/JevListFilterContext";

const JevLayout = () => {
  return (
    <JevListFilterProvider>
      <Outlet />
    </JevListFilterProvider>
  );
};

export default JevLayout;
