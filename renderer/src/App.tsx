import AppWindow from "./AppWindow";
import Redirector from "./pages/Redirector";
import MainLayout from "./pages/MainLayout";
import LoginPage from "./pages/LoginPage";
import SetupPage from "./pages/SetupPage";
import JevForm from "./components/form/jev/JevForm";
import Dashboard from "./components/dashboard/Dashboard";
import List from "./components/list/List";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./pages/AuthContext";

const App = () => {
  return (
    <AppWindow>
      <HashRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" index element={<Redirector />} />
            <Route path="/login" index element={<LoginPage />} />
            <Route path="/create-organization" index element={<SetupPage />} />

            <Route path="/main" element={<MainLayout />}>
              <Route index element={<Navigate to="jev/create" replace />} />
              <Route path="jev/dashboard" element={<Dashboard />} />
              <Route path="jev/create" element={<JevForm />} />
              <Route path="jev/list" element={<List />} />
            </Route>
          </Routes>
        </AuthProvider>
      </HashRouter>
    </AppWindow>
  );
};

export default App;
