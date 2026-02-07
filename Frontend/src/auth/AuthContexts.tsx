import React, { createContext, useContext, useEffect, useState } from 'react';
import keycloakService from '../services/keycloakService';

interface User {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    roles: string[];
    hasRole: (role: string) => boolean;
    logout: () => void;
    login: (username: string, password: string) => Promise<void>;
    register: (userData: any) => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [roles, setRoles] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is authenticated on mount
        const checkAuth = () => {
            const authenticated = keycloakService.isAuthenticated();
            setIsAuthenticated(authenticated);

            if (authenticated) {
                const userInfo = keycloakService.getUserInfo();
                if (userInfo) {
                    setUser({
                        id: userInfo.sub,
                        username: userInfo.preferred_username,
                        email: userInfo.email,
                        firstName: userInfo.given_name || '',
                        lastName: userInfo.family_name || '',
                    });
                    setRoles(userInfo.roles || []);
                }
            }
            setLoading(false);
        };

        checkAuth();

        // Set up token refresh interval
        const interval = setInterval(async () => {
            if (keycloakService.isAuthenticated()) {
                try {
                    await keycloakService.refreshAccessToken();
                    console.log('Token refreshed');
                } catch (error) {
                    console.error('Failed to refresh token:', error);
                    handleLogout();
                }
            }
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, []);

    const handleLogin = async (username: string, password: string) => {
        setLoading(true);
        try {
            await keycloakService.login(username, password);
            const userInfo = keycloakService.getUserInfo();

            setIsAuthenticated(true);
            setUser({
                id: userInfo.sub,
                username: userInfo.preferred_username,
                email: userInfo.email,
                firstName: userInfo.given_name || '',
                lastName: userInfo.family_name || '',
            });
            setRoles(userInfo.roles || []);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (userData: any) => {
        setLoading(true);
        try {
            await keycloakService.register(userData);
            // Auto login after registration
            await handleLogin(userData.username, userData.password);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await keycloakService.logout();
        setIsAuthenticated(false);
        setUser(null);
        setRoles([]);
        window.location.href = '/login';
    };

    const hasRole = (role: string) => {
        return roles.includes(role);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                roles,
                hasRole,
                logout: handleLogout,
                login: handleLogin,
                register: handleRegister,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};