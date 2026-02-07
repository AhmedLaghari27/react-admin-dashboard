const KEYCLOAK_URL = 'http://localhost:8080';
const REALM = 'mantix';
const CLIENT_ID = 'mantix-app';
const CLIENT_SECRET = 'MDLf9MA8UELXQcPVH3dOZMkd99ChtzXL'; // Get this from Keycloak Client Credentials tab

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
        const params = new URLSearchParams({
            grant_type: 'password',
            client_id: 'mantix-app',
            client_secret: 'MDLf9MA8UELXQcPVH3dOZMkd99ChtzXL',
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
            throw new Error(error.error_description || 'Login failed');
        }

        const data: LoginResponse = await response.json();
        this.accessToken = data.access_token;
        this.refreshToken = data.refresh_token;

        // Store tokens in localStorage
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);

        return data;
    }

    // Register new user
    async register(userData: UserData): Promise<void> {
        // First, get admin token
        const adminToken = await this.getAdminToken();

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
            const error = await response.json();
            throw new Error(error.errorMessage || 'Registration failed');
        }

        // Get the created user ID from Location header
        const location = response.headers.get('Location');
        if (location) {
            const userId = location.split('/').pop();

            // Assign default "user" role
            await this.assignUserRole(userId!, adminToken);
        }
    }

    // Get admin token for user creation
    private async getAdminToken(): Promise<string> {
        const params = new URLSearchParams({
            grant_type: 'password',
            client_id: "mantix-app",
            client_secret: "MDLf9MA8UELXQcPVH3dOZMkd99ChtzXL",
            username: 'admin.user', // Your admin username
            password: 'Admin', // Your admin password
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

        const data = await response.json();
        return data.access_token;
    }

    // Assign user role to new user
    private async assignUserRole(userId: string, adminToken: string): Promise<void> {
        // Get the user role ID
        const rolesResponse = await fetch(
            `${KEYCLOAK_URL}/admin/realms/${REALM}/roles/user`,
            {
                headers: {
                    Authorization: `Bearer ${adminToken}`,
                },
            }
        );

        const roleData = await rolesResponse.json();

        // Assign role to user
        await fetch(
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
    }

    // Logout
    async logout(): Promise<void> {
        const refreshToken = localStorage.getItem('refresh_token');

        if (refreshToken) {
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