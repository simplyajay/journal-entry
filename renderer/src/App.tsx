import AppWindow from "./AppWindow";
import JevForm from "./components/form/jev/JevForm";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./pages/protected/AuthContext";
import ProtectedRoute from "./pages/protected/ProtectedRoute";
import AuthPage from "./pages/AuthPage";

const App = () => {
  return (
    <AppWindow>
      <HashRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to={"/auth"} replace />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/jev/new" element={<JevForm />} />
            </Route>
          </Routes>
        </AuthProvider>
      </HashRouter>
    </AppWindow>
  );
};

export default App;
