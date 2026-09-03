import AppWindow from "./AppWindow";
import ProtectedRoute from "./pages/ProtectedRoute";
import MainLayout from "./pages/MainLayout";
import LoginPage from "./pages/LoginPage";
import SetupPage from "./pages/SetupPage";
import Dashboard from "./features/dashboard/Dashboard";
import List from "./features/jev/list/List";
import ViewJev from "./features/jev/view/ViewJev";
import CreateJev from "./features/jev/create/CreateJev";
import EditJev from "./features/jev/edit/EditJev";
import JevLayout from "./features/jev/JevLayout";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";

const App = () => {
  return (
    <AppWindow>
      <HashRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/main" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/create-organization" element={<SetupPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/main" element={<MainLayout />}>
                <Route
                  index
                  element={<Navigate to="jev/dashboard" replace />}
                />
                <Route path="jev" element={<JevLayout />}>
                  <Route index element={<Navigate to="list" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="list" element={<List />} />
                  <Route path="create" element={<CreateJev />} />
                  <Route path="edit/:jevId" element={<EditJev />} />
                  <Route path="view/:jevId" element={<ViewJev />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </HashRouter>
    </AppWindow>
  );
};

export default App;
