import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../Frontend/src/auth/AuthContexts';
import { AuthenticationTitle } from '../Frontend/src/pages/Login';
import { ForgotPassword } from '../Frontend/src/pages/ForgotPassword';
import { CreateAccount } from '../Frontend/src/pages/Signin';
import { DashboardLayout } from '../Frontend/src/layouts/DashboardLayout';
import { Dashboard } from '../Frontend/src/pages/Dashboard';
import { Products } from '../Frontend/src/pages/Products'; // ← New
import { Orders } from '../Frontend/src/pages/Orders'; // ← New
import ProtectedRoute from '../Frontend/src/components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<AuthenticationTitle />} />
          <Route path="/signup" element={<CreateAccount />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route
              path="users"
              element={
                <ProtectedRoute requiredRole="admin">
                  <div style={{ color: 'white', padding: '20px' }}>
                    <h1>Users Management - Admin Only</h1>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route path="products" element={<Products />} /> {/* ← New */}
            <Route path="orders" element={<Orders />} /> {/* ← New */}
            <Route
              path="settings"
              element={
                <div style={{ color: 'white', padding: '20px' }}>
                  <h1>Settings Page</h1>
                </div>
              }
            />
          </Route>

          {/* Unauthorized Page */}
          <Route
            path="/unauthorized"
            element={
              <div
                style={{
                  color: 'white',
                  padding: '40px',
                  textAlign: 'center',
                  minHeight: '100vh',
                  background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                }}
              >
                <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>🚫 Unauthorized</h1>
                <p style={{ fontSize: '20px' }}>You don't have permission to access this page.</p>
              </div>
            }
          />

          {/* Redirects */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;