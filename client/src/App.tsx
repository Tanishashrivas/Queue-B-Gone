import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AuthPage from './components/auth' 
import StudentDashboard from './components/student-dashboard'
import AdminDashboard from './components/admin-dashboard' 
import PrivateRoute from './components/protected-route' 
import AdminDetails from './components/admin-details'

function App() {
  return (
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
  )
}

export default App
