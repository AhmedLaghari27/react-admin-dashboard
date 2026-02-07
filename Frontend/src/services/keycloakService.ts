const KEYCLOAK_URL = 'http://localhost:8080';
const REALM = 'mantix';
const CLIENT_ID = 'mantix-app';
const CLIENT_SECRET = 'MDLf9MA8UELXQcPVH3dOZMkd99ChtzXL'; // ← REPLACE WITH YOUR REAL SECRET!

interface LoginResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
}

interface UserData {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
}

class KeycloakService {
    private accessToken: string | null = null;
    private refreshToken: string | null = null;

    // Login with username/email and password
    async login(username: string, password: string): Promise<LoginResponse> {
        try {
            const params = new URLSearchParams({
                grant_type: 'password',
                client_id: "mantix-app",
                client_secret: "MDLf9MA8UELXQcPVH3dOZMkd99ChtzXL",
                username: username,
                password: password,
            });

            const response = await fetch(
                `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: params.toString(),
                }
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error_description || 'Invalid username or password');
            }

            const data: LoginResponse = await response.json();
            this.accessToken = data.access_token;
            this.refreshToken = data.refresh_token;

            // Store tokens in localStorage
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);

            return data;
        } catch (error: any) {
            console.error('Login error:', error);
            throw new Error(error.message || 'Login failed. Please try again.');
        }
    }

    // Register new user
    async register(userData: UserData): Promise<void> {
        try {
            console.log('Starting registration for:', userData.username);

            // First, get admin token
            const adminToken = await this.getAdminToken();
            console.log('Admin token obtained');

            // Create user in Keycloak
            const response = await fetch(
                `${KEYCLOAK_URL}/admin/realms/${REALM}/users`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${adminToken}`,
                    },
                    body: JSON.stringify({
                        username: userData.username,
                        email: userData.email,
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        enabled: true,
                        emailVerified: true,
                        credentials: [
                            {
                                type: 'password',
                                value: userData.password,
                                temporary: false,
                            },
                        ],
                    }),
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.error('User creation failed:', errorText);

                let errorMessage = 'Registration failed';
                try {
                    const error = JSON.parse(errorText);
                    errorMessage = error.errorMessage || error.error || 'Registration failed';
                } catch (e) {
                    errorMessage = errorText || 'Registration failed';
                }

                throw new Error(errorMessage);
            }

            console.log('User created successfully');

            // Get the created user ID from Location header
            const location = response.headers.get('Location');
            if (location) {
                const userId = location.split('/').pop();
                console.log('User ID:', userId);

                // Assign default "user" role
                await this.assignUserRole(userId!, adminToken);
                console.log('User role assigned');
            }

            console.log('Registration completed successfully');
        } catch (error: any) {
            console.error('Registration error:', error);
            throw new Error(error.message || 'Registration failed. Please try again.');
        }
    }

    // Get admin token using service account
    private async getAdminToken(): Promise<string> {
        try {
            const params = new URLSearchParams({
                grant_type: 'client_credentials', // Changed from 'password'
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                // No username/password needed with service account!
            });

            const response = await fetch(
                `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: params.toString(),
                }
            );

            if (!response.ok) {
                const error = await response.json();
                console.error('Service account token error:', error);
                throw new Error('Failed to get service account token');
            }

            const data = await response.json();
            console.log('Service account token obtained successfully');
            return data.access_token;
        } catch (error: any) {
            console.error('Get service account token error:', error);
            throw new Error('Failed to get service account token: ' + error.message);
        }
    }
    // Assign user role to new user
    private async assignUserRole(userId: string, adminToken: string): Promise<void> {
        try {
            // Get the user role ID
            const rolesResponse = await fetch(
                `${KEYCLOAK_URL}/admin/realms/${REALM}/roles/user`,
                {
                    headers: {
                        Authorization: `Bearer ${adminToken}`,
                    },
                }
            );

            if (!rolesResponse.ok) {
                console.error('Failed to get user role');
                return;
            }

            const roleData = await rolesResponse.json();

            // Assign role to user
            const assignResponse = await fetch(
                `${KEYCLOAK_URL}/admin/realms/${REALM}/users/${userId}/role-mappings/realm`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${adminToken}`,
                    },
                    body: JSON.stringify([roleData]),
                }
            );

            if (!assignResponse.ok) {
                console.error('Failed to assign role');
            }
        } catch (error) {
            console.error('Assign role error:', error);
        }
    }

    // Logout
    async logout(): Promise<void> {
        const refreshToken = localStorage.getItem('refresh_token');

        if (refreshToken) {
            try {
                const params = new URLSearchParams({
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                    refresh_token: refreshToken,
                });

                await fetch(
                    `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/logout`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: params.toString(),
                    }
                );
            } catch (error) {
                console.error('Logout error:', error);
            }
        }

        // Clear tokens
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        this.accessToken = null;
        this.refreshToken = null;
    }

    // Get user info from token
    getUserInfo(): any {
        const token = localStorage.getItem('access_token');
        if (!token) return null;

        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );

            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error('Error parsing token:', error);
            return null;
        }
    }

    // Check if user is authenticated
    isAuthenticated(): boolean {
        const token = localStorage.getItem('access_token');
        if (!token) return false;

        const userInfo = this.getUserInfo();
        if (!userInfo) return false;

        // Check if token is expired
        const now = Date.now() / 1000;
        return userInfo.exp > now;
    }

    // Refresh token
    async refreshAccessToken(): Promise<void> {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('No refresh token available');

        const params = new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            refresh_token: refreshToken,
        });

        const response = await fetch(
            `${KEYCLOAK_URL}/realms/${REALM}/protocol/openid-connect/token`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params.toString(),
            }
        );

        if (!response.ok) {
            throw new Error('Token refresh failed');
        }

        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
    }

    // Get access token
    getAccessToken(): string | null {
        return localStorage.getItem('access_token');
    }
}

export default new KeycloakService();