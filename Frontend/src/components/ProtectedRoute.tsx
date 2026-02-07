import { Navigate } from 'react-router-dom';
import keycloakService from '../services/keycloakService';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
    const isAuthenticated = keycloakService.isAuthenticated();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole) {
        const userInfo = keycloakService.getUserInfo();
        const roles = userInfo?.roles || [];

        if (!roles.includes(requiredRole)) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;