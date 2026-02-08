import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContexts';
import { Box, Loader } from '@mantine/core';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
    const { isAuthenticated, hasRole, loading } = useAuth();

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

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && !hasRole(requiredRole)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;