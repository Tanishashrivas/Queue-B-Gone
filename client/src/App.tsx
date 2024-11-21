import { ToastProvider } from "@radix-ui/react-toast";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import AdminDashboard from "./components/admin-dashboard";
import AdminDetails from "./components/admin-details";
import AuthPage from "./components/auth";
import PrivateRoute from "./components/protected-route";
import StudentDashboard from "./components/student-dashboard";

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />

          <Route element={<PrivateRoute />}>
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin-details/:id" element={<AdminDetails />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
