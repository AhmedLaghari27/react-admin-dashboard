import {
    Box,
    Text,
    Paper,
    Table,
    Badge,
    Group,
    Button,
    Modal,
    TextInput,
    Select,
    ActionIcon,
    rem,
    Tooltip,
    Alert,
    Loader,
    Avatar,
    PasswordInput,
} from '@mantine/core';
import {
    IconPlus,
    IconEdit,
    IconTrash,
    IconSearch,
    IconUser,
    IconRefresh,
    IconAlertCircle,
    IconCheck,
    IconClock,
    IconMail,
    IconShieldCheck,
} from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { useAppData } from '../auth/AppDataContext';
import keycloakService from '../services/keycloakService';

interface UserForm {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    role: 'admin' | 'user';
}

export function Users() {
    const { users, fetchUsers, deleteUser, loading } = useAppData();
    const [searchQuery, setSearchQuery] = useState('');
    const [addModalOpened, setAddModalOpened] = useState(false);
    const [editModalOpened, setEditModalOpened] = useState(false);
    const [deleteModalOpened, setDeleteModalOpened] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [formData, setFormData] = useState<UserForm>({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        role: 'user',
    });
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');

    const handleAddUser = () => {
        setFormData({
            username: '',
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            role: 'user',
        });
        setFormError('');
        setFormSuccess('');
        setAddModalOpened(true);
    };

    const handleEditUser = (user: any) => {
        setSelectedUser(user);
        setFormData({
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            password: '',
            role: user.role || 'user',
        });
        setFormError('');
        setFormSuccess('');
        setEditModalOpened(true);
    };

    const handleDeleteClick = (user: any) => {
        setSelectedUser(user);
        setDeleteModalOpened(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedUser) return;
        setFormLoading(true);
        try {
            await deleteUser(selectedUser.id);
            setDeleteModalOpened(false);
            setSelectedUser(null);
            setFormSuccess('User deleted successfully!');
            setTimeout(() => setFormSuccess(''), 3000);
        } catch (error) {
            console.error('Error deleting user:', error);
            setFormError('Failed to delete user');
        } finally {
            setFormLoading(false);
        }
    };

    const handleCreateUser = async () => {
        setFormError('');
        setFormSuccess('');

        // Validation
        if (!formData.username || !formData.email || !formData.firstName || !formData.password) {
            setFormError('Please fill in all required fields');
            return;
        }

        if (formData.password.length < 6) {
            setFormError('Password must be at least 6 characters long');
            return;
        }

        setFormLoading(true);

        try {
            await keycloakService.register({
                username: formData.username,
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                password: formData.password,
            });

            // If admin role selected, assign it
            if (formData.role === 'admin') {
                // Note: This requires getting the user ID and assigning admin role
                // For simplicity, we'll just create the user for now
                console.log('Admin role assignment would happen here');
            }

            setFormSuccess('User created successfully!');
            await fetchUsers(); // Refresh user list
            setTimeout(() => {
                setAddModalOpened(false);
                setFormSuccess('');
            }, 2000);
        } catch (error: any) {
            console.error('Create user error:', error);
            setFormError(error.message || 'Failed to create user');
        } finally {
            setFormLoading(false);
        }
    };

    const handleUpdateUser = async () => {
        setFormError('');
        setFormSuccess('');

        if (!selectedUser) return;

        // Validation
        if (!formData.email || !formData.firstName) {
            setFormError('Please fill in all required fields');
            return;
        }

        setFormLoading(true);

        try {
            const adminToken = await getAdminToken();

            // Update user in Keycloak
            const updateData: any = {
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
            };

            const response = await fetch(
                `http://localhost:8080/admin/realms/mantix/users/${selectedUser.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${adminToken}`,
                    },
                    body: JSON.stringify(updateData),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to update user');
            }

            // Update password if provided
            if (formData.password) {
                await fetch(
                    `http://localhost:8080/admin/realms/mantix/users/${selectedUser.id}/reset-password`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${adminToken}`,
                        },
                        body: JSON.stringify({
                            type: 'password',
                            value: formData.password,
                            temporary: false,
                        }),
                    }
                );
            }

            setFormSuccess('User updated successfully!');
            await fetchUsers(); // Refresh user list
            setTimeout(() => {
                setEditModalOpened(false);
                setFormSuccess('');
            }, 2000);
        } catch (error: any) {
            console.error('Update user error:', error);
            setFormError(error.message || 'Failed to update user');
        } finally {
            setFormLoading(false);
        }
    };

    const getAdminToken = async (): Promise<string> => {
        const params = new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: 'mantix-app',
            client_secret: ' MDLf9MA8UELXQcPVH3dOZMkd99ChtzXL  ', // Replace with your actual secret
        });

        const response = await fetch(
            'http://localhost:8080/realms/mantix/protocol/openid-connect/token',
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
    };

    const filteredUsers = users.filter(
        (user) =>
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.firstName + ' ' + user.lastName).toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Box>
            {/* Header */}
            <Group justify="space-between" mb="xl">
                <Box>
                    <Text
                        size="xl"
                        fw={900}
                        style={{
                            background: 'linear-gradient(135deg, #4988C4 0%, #667eea 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontSize: rem(32),
                        }}
                    >
                        User Management 👥
                    </Text>
                    <Text c="dimmed" size="sm" mt={5}>
                        Manage user accounts and permissions
                    </Text>
                </Box>
                <Group>
                    <Button
                        leftSection={<IconRefresh size={18} />}
                        variant="light"
                        onClick={fetchUsers}
                        loading={loading}
                    >
                        Refresh
                    </Button>
                    <Button
                        leftSection={<IconPlus size={20} />}
                        onClick={handleAddUser}
                        style={{
                            background: 'linear-gradient(135deg, #4988C4 0%, #667eea 100%)',
                            fontWeight: 700,
                        }}
                    >
                        Add User
                    </Button>
                </Group>
            </Group>

            {/* Success/Error Messages */}
            {formSuccess && (
                <Alert
                    icon={<IconCheck size={16} />}
                    color="green"
                    mb="md"
                    styles={{
                        root: {
                            background: 'rgba(81, 207, 102, 0.1)',
                            border: '1px solid rgba(81, 207, 102, 0.3)',
                        },
                    }}
                >
                    {formSuccess}
                </Alert>
            )}

            {formError && (
                <Alert
                    icon={<IconAlertCircle size={16} />}
                    color="red"
                    mb="md"
                    styles={{
                        root: {
                            background: 'rgba(255, 107, 107, 0.1)',
                            border: '1px solid rgba(255, 107, 107, 0.3)',
                        },
                    }}
                    onClose={() => setFormError('')}
                >
                    {formError}
                </Alert>
            )}

            {/* Search */}
            <Group mb="lg">
                <TextInput
                    placeholder="Search users by name, email, or username..."
                    leftSection={<IconSearch size={16} />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ flex: 1 }}
                    styles={{
                        input: {
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(73, 136, 196, 0.3)',
                            color: 'white',
                            '&::placeholder': {
                                color: 'rgba(255, 255, 255, 0.4)',
                            },
                        },
                    }}
                />
            </Group>

            {/* Stats */}
            <Group mb="lg" grow>
                <Paper
                    p="md"
                    radius="lg"
                    style={{
                        background: 'rgba(73, 136, 196, 0.1)',
                        border: '1px solid rgba(73, 136, 196, 0.3)',
                    }}
                >
                    <Group gap="xs">
                        <IconUser size={20} color="#4988C4" />
                        <Box>
                            <Text size="xs" c="dimmed">
                                Total Users
                            </Text>
                            <Text size="lg" fw={700} c="white">
                                {users.length}
                            </Text>
                        </Box>
                    </Group>
                </Paper>

                <Paper
                    p="md"
                    radius="lg"
                    style={{
                        background: 'rgba(102, 126, 234, 0.1)',
                        border: '1px solid rgba(102, 126, 234, 0.3)',
                    }}
                >
                    <Group gap="xs">
                        <IconShieldCheck size={20} color="#667eea" />
                        <Box>
                            <Text size="xs" c="dimmed">
                                Admins
                            </Text>
                            <Text size="lg" fw={700} c="white">
                                {users.filter((u) => u.role === 'admin').length}
                            </Text>
                        </Box>
                    </Group>
                </Paper>

                <Paper
                    p="md"
                    radius="lg"
                    style={{
                        background: 'rgba(81, 207, 102, 0.1)',
                        border: '1px solid rgba(81, 207, 102, 0.3)',
                    }}
                >
                    <Group gap="xs">
                        <IconUser size={20} color="#51cf66" />
                        <Box>
                            <Text size="xs" c="dimmed">
                                Regular Users
                            </Text>
                            <Text size="lg" fw={700} c="white">
                                {users.filter((u) => u.role !== 'admin').length}
                            </Text>
                        </Box>
                    </Group>
                </Paper>
            </Group>

            {/* Users Table */}
            <Paper
                p="xl"
                radius="lg"
                style={{
                    background: 'rgba(20, 20, 35, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(73, 136, 196, 0.2)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                }}
            >
                {loading ? (
                    <Box ta="center" py="xl">
                        <Loader size="lg" color="#4988C4" />
                        <Text c="dimmed" mt="md">
                            Loading users...
                        </Text>
                    </Box>
                ) : (
                    <>
                        <Table horizontalSpacing="md" verticalSpacing="md" style={{ color: 'white' }}>
                            <Table.Thead>
                                <Table.Tr
                                    style={{
                                        borderBottom: '1px solid rgba(73, 136, 196, 0.2)',
                                    }}
                                >
                                    <Table.Th style={{ color: 'rgba(255, 255, 255, 0.7)' }}>USER</Table.Th>
                                    <Table.Th style={{ color: 'rgba(255, 255, 255, 0.7)' }}>EMAIL</Table.Th>
                                    <Table.Th style={{ color: 'rgba(255, 255, 255, 0.7)' }}>USERNAME</Table.Th>
                                    <Table.Th style={{ color: 'rgba(255, 255, 255, 0.7)' }}>ROLE</Table.Th>
                                    <Table.Th style={{ color: 'rgba(255, 255, 255, 0.7)' }}>JOINED</Table.Th>
                                    <Table.Th style={{ color: 'rgba(255, 255, 255, 0.7)' }}>ACTIONS</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {filteredUsers.map((user) => (
                                    <Table.Tr
                                        key={user.id}
                                        style={{
                                            borderBottom: '1px solid rgba(73, 136, 196, 0.1)',
                                        }}
                                    >
                                        <Table.Td>
                                            <Group gap="sm">
                                                <Avatar
                                                    size={40}
                                                    radius="xl"
                                                    style={{
                                                        background: 'linear-gradient(135deg, #4988C4 0%, #667eea 100%)',
                                                    }}
                                                >
                                                    {user.firstName?.charAt(0) || user.username?.charAt(0) || 'U'}
                                                    {user.lastName?.charAt(0) || ''}
                                                </Avatar>
                                                <Box>
                                                    <Text size="sm" fw={600} c="white">
                                                        {user.firstName} {user.lastName}
                                                    </Text>
                                                    <Text size="xs" c="dimmed">
                                                        ID: {user.id.substring(0, 8)}...
                                                    </Text>
                                                </Box>
                                            </Group>
                                        </Table.Td>
                                        <Table.Td>
                                            <Group gap="xs">
                                                <IconMail size={14} color="rgba(255, 255, 255, 0.5)" />
                                                <Text size="sm" c="white">
                                                    {user.email || 'N/A'}
                                                </Text>
                                            </Group>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm" c="white">
                                                {user.username}
                                            </Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Badge
                                                variant="light"
                                                style={{
                                                    background:
                                                        user.role === 'admin'
                                                            ? 'rgba(102, 126, 234, 0.2)'
                                                            : 'rgba(73, 136, 196, 0.2)',
                                                    color: user.role === 'admin' ? '#667eea' : '#4988C4',
                                                    textTransform: 'capitalize',
                                                }}
                                            >
                                                {user.role || 'user'}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            <Group gap="xs">
                                                <IconClock size={14} color="rgba(255, 255, 255, 0.5)" />
                                                <Text size="sm" c="dimmed">
                                                    {user.createdAt}
                                                </Text>
                                            </Group>
                                        </Table.Td>
                                        <Table.Td>
                                            <Group gap="xs">
                                                <Tooltip label="Edit User">
                                                    <ActionIcon
                                                        variant="light"
                                                        color="blue"
                                                        onClick={() => handleEditUser(user)}
                                                    >
                                                        <IconEdit size={16} />
                                                    </ActionIcon>
                                                </Tooltip>
                                                <Tooltip label="Delete User">
                                                    <ActionIcon
                                                        variant="light"
                                                        color="red"
                                                        onClick={() => handleDeleteClick(user)}
                                                    >
                                                        <IconTrash size={16} />
                                                    </ActionIcon>
                                                </Tooltip>
                                            </Group>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>

                        {filteredUsers.length === 0 && (
                            <Box ta="center" py="xl">
                                <Text c="dimmed">No users found</Text>
                            </Box>
                        )}
                    </>
                )}
            </Paper>

            {/* Add User Modal */}
            <Modal
                opened={addModalOpened}
                onClose={() => setAddModalOpened(false)}
                title={
                    <Group gap="xs">
                        <IconPlus size={20} color="#4988C4" />
                        <Text fw={700} size="lg">
                            Add New User
                        </Text>
                    </Group>
                }
                size="md"
                styles={{
                    content: {
                        background: 'rgba(20, 20, 35, 0.95)',
                        border: '1px solid rgba(73, 136, 196, 0.2)',
                    },
                    header: {
                        background: 'transparent',
                        color: 'white',
                    },
                    title: {
                        color: 'white',
                    },
                }}
            >
                <Box>
                    {formError && (
                        <Alert
                            icon={<IconAlertCircle size={16} />}
                            color="red"
                            mb="md"
                            styles={{
                                root: {
                                    background: 'rgba(255, 107, 107, 0.1)',
                                    border: '1px solid rgba(255, 107, 107, 0.3)',
                                },
                            }}
                        >
                            {formError}
                        </Alert>
                    )}

                    {formSuccess && (
                        <Alert
                            icon={<IconCheck size={16} />}
                            color="green"
                            mb="md"
                            styles={{
                                root: {
                                    background: 'rgba(81, 207, 102, 0.1)',
                                    border: '1px solid rgba(81, 207, 102, 0.3)',
                                },
                            }}
                        >
                            {formSuccess}
                        </Alert>
                    )}

                    <Group grow mb="md">
                        <TextInput
                            label="First Name"
                            placeholder="John"
                            required
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            styles={{
                                label: {
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    fontWeight: 600,
                                    marginBottom: rem(8),
                                },
                                input: {
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(73, 136, 196, 0.3)',
                                    color: 'white',
                                    '&::placeholder': {
                                        color: 'rgba(255, 255, 255, 0.4)',
                                    },
                                },
                            }}
                        />

                        <TextInput
                            label="Last Name"
                            placeholder="Doe"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            styles={{
                                label: {
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    fontWeight: 600,
                                    marginBottom: rem(8),
                                },
                                input: {
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(73, 136, 196, 0.3)',
                                    color: 'white',
                                    '&::placeholder': {
                                        color: 'rgba(255, 255, 255, 0.4)',
                                    },
                                },
                            }}
                        />
                    </Group>

                    <TextInput
                        label="Username"
                        placeholder="johndoe"
                        required
                        mb="md"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        styles={{
                            label: {
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontWeight: 600,
                                marginBottom: rem(8),
                            },
                            input: {
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(73, 136, 196, 0.3)',
                                color: 'white',
                                '&::placeholder': {
                                    color: 'rgba(255, 255, 255, 0.4)',
                                },
                            },
                        }}
                    />

                    <TextInput
                        label="Email"
                        placeholder="john@example.com"
                        type="email"
                        required
                        mb="md"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        styles={{
                            label: {
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontWeight: 600,
                                marginBottom: rem(8),
                            },
                            input: {
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(73, 136, 196, 0.3)',
                                color: 'white',
                                '&::placeholder': {
                                    color: 'rgba(255, 255, 255, 0.4)',
                                },
                            },
                        }}
                    />

                    <PasswordInput
                        label="Password"
                        placeholder="Minimum 6 characters"
                        required
                        mb="md"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        styles={{
                            label: {
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontWeight: 600,
                                marginBottom: rem(8),
                            },
                            input: {
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(73, 136, 196, 0.3)',
                                color: 'white',
                                '&::placeholder': {
                                    color: 'rgba(255, 255, 255, 0.4)',
                                },
                            },
                            innerInput: {
                                color: 'white',
                            },
                        }}
                    />

                    <Select
                        label="Role"
                        placeholder="Select role"
                        mb="xl"
                        data={[
                            { value: 'user', label: 'User' },
                            { value: 'admin', label: 'Administrator' },
                        ]}
                        value={formData.role}
                        onChange={(value) => setFormData({ ...formData, role: value as 'admin' | 'user' })}
                        styles={{
                            label: {
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontWeight: 600,
                                marginBottom: rem(8),
                            },
                            input: {
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(73, 136, 196, 0.3)',
                                color: 'white',
                            },
                        }}
                    />

                    <Group justify="flex-end">
                        <Button variant="subtle" onClick={() => setAddModalOpened(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreateUser}
                            loading={formLoading}
                            style={{
                                background: 'linear-gradient(135deg, #4988C4 0%, #667eea 100%)',
                            }}
                        >
                            Create User
                        </Button>
                    </Group>
                </Box>
            </Modal>

            {/* Edit User Modal */}
            <Modal
                opened={editModalOpened}
                onClose={() => setEditModalOpened(false)}
                title={
                    <Group gap="xs">
                        <IconEdit size={20} color="#4988C4" />
                        <Text fw={700} size="lg">
                            Edit User
                        </Text>
                    </Group>
                }
                size="md"
                styles={{
                    content: {
                        background: 'rgba(20, 20, 35, 0.95)',
                        border: '1px solid rgba(73, 136, 196, 0.2)',
                    },
                    header: {
                        background: 'transparent',
                        color: 'white',
                    },
                    title: {
                        color: 'white',
                    },
                }}
            >
                <Box>
                    {formError && (
                        <Alert
                            icon={<IconAlertCircle size={16} />}
                            color="red"
                            mb="md"
                            styles={{
                                root: {
                                    background: 'rgba(255, 107, 107, 0.1)',
                                    border: '1px solid rgba(255, 107, 107, 0.3)',
                                },
                            }}
                        >
                            {formError}
                        </Alert>
                    )}

                    {formSuccess && (
                        <Alert
                            icon={<IconCheck size={16} />}
                            color="green"
                            mb="md"
                            styles={{
                                root: {
                                    background: 'rgba(81, 207, 102, 0.1)',
                                    border: '1px solid rgba(81, 207, 102, 0.3)',
                                },
                            }}
                        >
                            {formSuccess}
                        </Alert>
                    )}

                    <Group grow mb="md">
                        <TextInput
                            label="First Name"
                            placeholder="John"
                            required
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            styles={{
                                label: {
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    fontWeight: 600,
                                    marginBottom: rem(8),
                                },
                                input: {
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(73, 136, 196, 0.3)',
                                    color: 'white',
                                },
                            }}
                        />

                        <TextInput
                            label="Last Name"
                            placeholder="Doe"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            styles={{
                                label: {
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    fontWeight: 600,
                                    marginBottom: rem(8),
                                },
                                input: {
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(73, 136, 196, 0.3)',
                                    color: 'white',
                                },
                            }}
                        />
                    </Group>

                    <TextInput
                        label="Email"
                        placeholder="john@example.com"
                        type="email"
                        required
                        mb="md"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        styles={{
                            label: {
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontWeight: 600,
                                marginBottom: rem(8),
                            },
                            input: {
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(73, 136, 196, 0.3)',
                                color: 'white',
                            },
                        }}
                    />

                    <PasswordInput
                        label="New Password (optional)"
                        placeholder="Leave empty to keep current password"
                        mb="xl"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        styles={{
                            label: {
                                color: 'rgba(255, 255, 255, 0.9)',
                                fontWeight: 600,
                                marginBottom: rem(8),
                            },
                            input: {
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(73, 136, 196, 0.3)',
                                color: 'white',
                            },
                            innerInput: {
                                color: 'white',
                            },
                        }}
                    />

                    <Group justify="flex-end">
                        <Button variant="subtle" onClick={() => setEditModalOpened(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdateUser}
                            loading={formLoading}
                            style={{
                                background: 'linear-gradient(135deg, #4988C4 0%, #667eea 100%)',
                            }}
                        >
                            Update User
                        </Button>
                    </Group>
                </Box>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                opened={deleteModalOpened}
                onClose={() => setDeleteModalOpened(false)}
                title={
                    <Text fw={700} size="lg" c="red">
                        Confirm Delete
                    </Text>
                }
                styles={{
                    content: {
                        background: 'rgba(20, 20, 35, 0.95)',
                        border: '1px solid rgba(255, 107, 107, 0.3)',
                    },
                    header: {
                        background: 'transparent',
                        color: 'white',
                    },
                    title: {
                        color: '#ff6b6b',
                    },
                }}
            >
                <Box>
                    <Text c="white" mb="md">
                        Are you sure you want to delete user{' '}
                        <strong>
                            {selectedUser?.firstName} {selectedUser?.lastName}
                        </strong>
                        ? This action cannot be undone.
                    </Text>
                    <Alert
                        icon={<IconAlertCircle size={16} />}
                        color="red"
                        mb="xl"
                        styles={{
                            root: {
                                background: 'rgba(255, 107, 107, 0.1)',
                                border: '1px solid rgba(255, 107, 107, 0.3)',
                            },
                        }}
                    >
                        All user data and associated orders will be permanently deleted.
                    </Alert>
                    <Group justify="flex-end">
                        <Button variant="subtle" onClick={() => setDeleteModalOpened(false)}>
                            Cancel
                        </Button>
                        <Button color="red" onClick={handleConfirmDelete} loading={formLoading}>
                            Delete User
                        </Button>
                    </Group>
                </Box>
            </Modal>
        </Box>
    );
}