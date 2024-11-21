import { ToastProvider } from "@radix-ui/react-toast";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
} from "react-router-dom";
import AdminDashboard from "./components/admin-dashboard";
import AdminDetails from "./components/admin-details";
import AuthPage from "./components/auth";
import PrivateRoute from "./components/protected-route";
import StudentDashboard from "./components/student-dashboard";
import PaymentSuccessful from "./components/payment-successfull";
import PaymentPage from "./components/payment-page";
import PaymentProcessing from "./components/payment-loading";

const onPaymentSuccess = () => {
  return <PaymentSuccessful />
};

function App() {
  
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />

          <Route path="/payment-successfull" element={<PaymentSuccessful />} />
          <Route path="/payment-loading" element={<PaymentProcessing onComplete={onPaymentSuccess}/>} />

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
