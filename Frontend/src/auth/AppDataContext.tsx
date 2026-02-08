import React, { createContext, useContext, useState, useEffect } from 'react';

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    status: 'active' | 'inactive' | 'out-of-stock';
    category: string;
    createdAt: string;
}

interface OrderItem {
    productName: string;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    customerName: string;
    customerEmail: string;
    items: OrderItem[];
    totalAmount: number;
    status: 'pending' | 'completed' | 'cancelled';
    date: string;
}

interface User {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    createdAt: string;
}

interface AppDataContextType {
    users: User[];
    products: Product[];
    orders: Order[];
    fetchUsers: () => Promise<void>;
    deleteUser: (userId: string) => Promise<void>;
    addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
    updateProduct: (id: string, product: Partial<Product>) => void;
    deleteProduct: (id: string) => void;
    addOrder: (order: Omit<Order, 'id'>) => void;
    updateOrderStatus: (id: string, status: 'pending' | 'completed' | 'cancelled') => void;
    loading: boolean;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

// Keycloak configuration
const KEYCLOAK_URL = 'http://localhost:8080';
const REALM = 'mantix';
const CLIENT_ID = 'mantix-app';
const CLIENT_SECRET = 'MDLf9MA8UELXQcPVH3dOZMkd99ChtzXL'; // ← REPLACE THIS WITH YOUR REAL SECRET!

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [products, setProducts] = useState<Product[]>([
        {
            id: '1',
            name: 'MacBook Pro 16"',
            price: 2499,
            stock: 25,
            status: 'active',
            category: 'Electronics',
            createdAt: '2024-01-15',
        },
        {
            id: '2',
            name: 'iPhone 15 Pro',
            price: 1199,
            stock: 150,
            status: 'active',
            category: 'Electronics',
            createdAt: '2024-01-20',
        },
        {
            id: '3',
            name: 'AirPods Pro',
            price: 249,
            stock: 200,
            status: 'active',
            category: 'Accessories',
            createdAt: '2024-02-01',
        },
        {
            id: '4',
            name: 'iPad Air',
            price: 599,
            stock: 45,
            status: 'active',
            category: 'Electronics',
            createdAt: '2024-02-05',
        },
        {
            id: '5',
            name: 'Magic Keyboard',
            price: 99,
            stock: 5,
            status: 'active',
            category: 'Accessories',
            createdAt: '2024-02-08',
        },
    ]);
    const [orders, setOrders] = useState<Order[]>([
        {
            id: 'ORD-2024-001',
            customerName: 'John Doe',
            customerEmail: 'john@example.com',
            items: [
                { productName: 'MacBook Pro 16"', quantity: 1, price: 2499 },
                { productName: 'AirPods Pro', quantity: 2, price: 249 },
            ],
            totalAmount: 2997,
            status: 'completed',
            date: '2024-02-08',
        },
        {
            id: 'ORD-2024-002',
            customerName: 'Jane Smith',
            customerEmail: 'jane@example.com',
            items: [{ productName: 'iPhone 15 Pro', quantity: 1, price: 1199 }],
            totalAmount: 1199,
            status: 'pending',
            date: '2024-02-07',
        },
    ]);
    const [loading, setLoading] = useState(false);

    const getAdminToken = async (): Promise<string> => {
        try {
            const params = new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
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
                console.error('Admin token error:', error);
                throw new Error('Failed to get admin token');
            }

            const data = await response.json();
            return data.access_token;
        } catch (error) {
            console.error('Get admin token error:', error);
            throw error;
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            console.log('Fetching users from Keycloak...');
            const adminToken = await getAdminToken();
            console.log('Admin token obtained');

            const response = await fetch(
                `${KEYCLOAK_URL}/admin/realms/${REALM}/users`,
                {
                    headers: {
                        Authorization: `Bearer ${adminToken}`,
                    },
                }
            );

            if (!response.ok) {
                console.error('Failed to fetch users:', response.status);
                throw new Error('Failed to fetch users');
            }

            const keycloakUsers = await response.json();
            console.log('Fetched users:', keycloakUsers.length);

            const formattedUsers: User[] = keycloakUsers.map((user: any) => ({
                id: user.id,
                username: user.username,
                email: user.email || '',
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                role: 'user',
                createdAt: new Date(user.createdTimestamp).toISOString().split('T')[0],
            }));

            setUsers(formattedUsers);
            console.log('Users set successfully');
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (userId: string) => {
        try {
            const adminToken = await getAdminToken();
            const response = await fetch(
                `${KEYCLOAK_URL}/admin/realms/${REALM}/users/${userId}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${adminToken}`,
                    },
                }
            );

            if (response.ok || response.status === 204) {
                setUsers(users.filter((u) => u.id !== userId));
                console.log('User deleted successfully');
            } else {
                throw new Error('Failed to delete user');
            }
        } catch (error) {
            console.error('Failed to delete user:', error);
            throw error;
        }
    };

    const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
        const newProduct: Product = {
            ...product,
            id: Date.now().toString(),
            createdAt: new Date().toISOString().split('T')[0],
        };
        setProducts([...products, newProduct]);
    };

    const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
        setProducts(products.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p)));
    };

    const deleteProduct = (id: string) => {
        setProducts(products.filter((p) => p.id !== id));
    };

    const addOrder = (order: Omit<Order, 'id'>) => {
        const newOrder: Order = {
            ...order,
            id: `ORD-2024-${String(orders.length + 1).padStart(3, '0')}`,
        };
        setOrders([...orders, newOrder]);
    };

    const updateOrderStatus = (id: string, status: 'pending' | 'completed' | 'cancelled') => {
        setOrders(orders.map((o) => (o.id === id ? { ...o, status } : o)));
    };

    // Fetch users on mount
    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <AppDataContext.Provider
            value={{
                users,
                products,
                orders,
                fetchUsers,
                deleteUser,
                addProduct,
                updateProduct,
                deleteProduct,
                addOrder,
                updateOrderStatus,
                loading,
            }}
        >
            {children}
        </AppDataContext.Provider>
    );
};

export const useAppData = () => {
    const context = useContext(AppDataContext);
    if (!context) {
        throw new Error('useAppData must be used within AppDataProvider');
    }
    return context;
};