import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthenticationTitle } from '../Frontend/src/pages/Login';
import { ForgotPassword } from '../Frontend/src/pages/ForgotPassword';
import { CreateAccount } from '../Frontend/src/pages/Signin';
import { DashboardLayout } from '../Frontend/src/layouts/DashboardLayout';
import { Dashboard } from '../Frontend/src/pages/Dashboard';
import ProtectedRoute from '../Frontend/src/components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<AuthenticationTitle />} />
        <Route path="/signup" element={<CreateAccount />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Dashboard Routes */}
        <Route element={<DashboardLayout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute requiredRole="admin">
                <div style={{ color: 'white', padding: '20px' }}>
                  <h1>Users Management - Admin Only</h1>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <div style={{ color: 'white', padding: '20px' }}>
                  <h1>Products Page</h1>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <div style={{ color: 'white', padding: '20px' }}>
                  <h1>Orders Page</h1>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <div style={{ color: 'white', padding: '20px' }}>
                  <h1>Settings Page</h1>
                </div>
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;