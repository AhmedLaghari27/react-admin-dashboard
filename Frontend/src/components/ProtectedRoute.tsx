import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContexts';
import { Box, Loader } from '@mantine/core';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
    const { isAuthenticated, hasRole, loading } = useAuth();
    const location = useLocation();

    // Show loader while checking authentication
    if (loading) {
        return (
            <Box
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
                }}
            >
                <Loader size="xl" color="#4988C4" />
            </Box>
        );
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If role is required but user doesn't have it, redirect to unauthorized
    if (requiredRole && !hasRole(requiredRole)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // User is authenticated and has required role (if any)
    return <>{children}</>;
};

export default ProtectedRoute;