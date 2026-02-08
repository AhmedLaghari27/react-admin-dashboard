import {
    Box,
    Text,
    Paper,
    Group,
    rem,
    SimpleGrid,
    Table,
    Badge,
    Avatar,
    ActionIcon,
    Tooltip,
    Modal,
    Loader,
    Button,
    Collapse,
} from '@mantine/core';
import {
    IconUsers,
    IconShoppingCart,
    IconTrendingUp,
    IconTrash,
    IconEye,
    IconClock,
    IconStar,
    IconHeart,
    IconChevronDown,
    IconChevronUp,
    IconCurrencyDollar,
    IconPackage,
} from '@tabler/icons-react';
import { useAuth } from '../auth/AuthContexts';
import { useAppData } from '../auth/AppDataContext';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function Dashboard() {
    const { user, roles } = useAuth();
    const { users, products, orders, deleteUser, loading } = useAppData();
    const [deleteModalOpened, setDeleteModalOpened] = useState(false);
    const [userToDelete, setUserToDelete] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [expandedUsers, setExpandedUsers] = useState<string[]>([]);

    const isAdmin = roles?.includes('admin');

    const handleDeleteClick = (userId: string) => {
        setUserToDelete(userId);
        setDeleteModalOpened(true);
    };

    const handleConfirmDelete = async () => {
        if (!userToDelete) return;
        setDeleting(true);
        try {
            await deleteUser(userToDelete);
            setDeleteModalOpened(false);
            setUserToDelete(null);
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user');
        } finally {
            setDeleting(false);
        }
    };

    const toggleUserExpand = (userId: string) => {
        setExpandedUsers((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return '#51cf66';
            case 'pending':
                return '#ffa94d';
            case 'cancelled':
                return '#ff6b6b';
            default:
                return '#4988C4';
        }
    };

    // Get orders for a specific user
    const getUserOrders = (userEmail: string) => {
        return orders.filter((order) => order.customerEmail === userEmail);
    };

    // User's personal orders and stats
    const myOrders = orders.filter((order) => order.customerEmail === user?.email);
    const myTotalSpent = myOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const myCompletedOrders = myOrders.filter((o) => o.status === 'completed').length;

    return (
        <Box>
            {/* Welcome Header */}
            <Paper
                p="xl"
                radius="lg"
                mb="xl"
                style={{
                    background: 'linear-gradient(135deg, rgba(73, 136, 196, 0.2) 0%, rgba(102, 126, 234, 0.2) 100%)',
                    border: '1px solid rgba(73, 136, 196, 0.3)',
                    boxShadow: '0 4px 20px rgba(73, 136, 196, 0.2)',
                }}
            >
                <Group justify="space-between" align="flex-start">
                    <Box>
                        <Text
                            size="xl"
                            fw={900}
                            style={{
                                background: 'linear-gradient(135deg, #4988C4 0%, #667eea 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontSize: rem(36),
                            }}
                        >
                            Welcome back, {user?.firstName}! 👋
                        </Text>
                        <Text c="dimmed" size="lg" mt="sm">
                            {isAdmin
                                ? 'Manage users and view their order history'
                                : "Here's what's new for you today!"}
                        </Text>
                    </Box>
                    <Avatar
                        size={80}
                        radius="xl"
                        style={{
                            background: 'linear-gradient(135deg, #4988C4 0%, #667eea 100%)',
                            fontSize: rem(32),
                        }}
                    >
                        {user?.firstName?.charAt(0)}
                        {user?.lastName?.charAt(0)}
                    </Avatar>
                </Group>
            </Paper>

            {isAdmin ? (
                <>
                    {/* Admin: Statistics */}
                    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg" mb="xl">
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
                            <Group gap="sm" mb="md">
                                <Box
                                    style={{
                                        width: rem(60),
                                        height: rem(60),
                                        borderRadius: rem(12),
                                        background: 'linear-gradient(135deg, rgba(73, 136, 196, 0.2) 0%, rgba(73, 136, 196, 0.1) 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '1px solid rgba(73, 136, 196, 0.3)',
                                    }}
                                >
                                    <IconUsers size={30} color="#4988C4" />
                                </Box>
                                <Box>
                                    <Text size="xs" c="dimmed" tt="uppercase">
                                        Total Users
                                    </Text>
                                    <Text size="xl" fw={900} c="white">
                                        {users.length}
                                    </Text>
                                </Box>
                            </Group>
                        </Paper>

                        <Paper
                            p="xl"
                            radius="lg"
                            style={{
                                background: 'rgba(20, 20, 35, 0.8)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 166, 77, 0.2)',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                            }}
                        >
                            <Group gap="sm" mb="md">
                                <Box
                                    style={{
                                        width: rem(60),
                                        height: rem(60),
                                        borderRadius: rem(12),
                                        background: 'linear-gradient(135deg, rgba(255, 166, 77, 0.2) 0%, rgba(255, 166, 77, 0.1) 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '1px solid rgba(255, 166, 77, 0.3)',
                                    }}
                                >
                                    <IconShoppingCart size={30} color="#ffa94d" />
                                </Box>
                                <Box>
                                    <Text size="xs" c="dimmed" tt="uppercase">
                                        Total Orders
                                    </Text>
                                    <Text size="xl" fw={900} c="white">
                                        {orders.length}
                                    </Text>
                                </Box>
                            </Group>
                        </Paper>

                        <Paper
                            p="xl"
                            radius="lg"
                            style={{
                                background: 'rgba(20, 20, 35, 0.8)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(81, 207, 102, 0.2)',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                            }}
                        >
                            <Group gap="sm" mb="md">
                                <Box
                                    style={{
                                        width: rem(60),
                                        height: rem(60),
                                        borderRadius: rem(12),
                                        background: 'linear-gradient(135deg, rgba(81, 207, 102, 0.2) 0%, rgba(81, 207, 102, 0.1) 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '1px solid rgba(81, 207, 102, 0.3)',
                                    }}
                                >
                                    <IconCurrencyDollar size={30} color="#51cf66" />
                                </Box>
                                <Box>
                                    <Text size="xs" c="dimmed" tt="uppercase">
                                        Total Revenue
                                    </Text>
                                    <Text size="xl" fw={900} c="white">
                                        ${orders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}
                                    </Text>
                                </Box>
                            </Group>
                        </Paper>
                    </SimpleGrid>

                    {/* Admin: Users & Their Orders Table */}
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
                        <Group justify="space-between" mb="xl">
                            <Box>
                                <Text size="lg" fw={700} c="white" style={{ letterSpacing: '0.5px' }}>
                                    USERS & THEIR ORDERS
                                </Text>
                                <Text size="sm" c="dimmed" mt={5}>
                                    Click on a user to view their order history
                                </Text>
                            </Box>
                            {loading && <Loader size="sm" color="#4988C4" />}
                        </Group>

                        <Table horizontalSpacing="md" verticalSpacing="md" style={{ color: 'white' }}>
                            <Table.Thead>
                                <Table.Tr style={{ borderBottom: '1px solid rgba(73, 136, 196, 0.2)' }}>
                                    <Table.Th style={{ color: 'rgba(255, 255, 255, 0.7)', width: 40 }}></Table.Th>
                                    <Table.Th style={{ color: 'rgba(255, 255, 255, 0.7)' }}>USER</Table.Th>
                                    <Table.Th style={{ color: 'rgba(255, 255, 255, 0.7)' }}>EMAIL</Table.Th>
                                    <Table.Th style={{ color: 'rgba(255, 255, 255, 0.7)' }}>ORDERS</Table.Th>
                                    <Table.Th style={{ color: 'rgba(255, 255, 255, 0.7)' }}>TOTAL SPENT</Table.Th>
                                    <Table.Th style={{ color: 'rgba(255, 255, 255, 0.7)' }}>JOINED</Table.Th>
                                    <Table.Th style={{ color: 'rgba(255, 255, 255, 0.7)' }}>ACTIONS</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {users.map((user) => {
                                    const userOrders = getUserOrders(user.email);
                                    const totalSpent = userOrders.reduce((sum, o) => sum + o.totalAmount, 0);

                                    return (
                                        <>
                                            <Table.Tr
                                                key={user.id}
                                                style={{ borderBottom: '1px solid rgba(73, 136, 196, 0.1)' }}
                                            >
                                                <Table.Td>
                                                    <ActionIcon
                                                        variant="subtle"
                                                        onClick={() => toggleUserExpand(user.id)}
                                                    >
                                                        {expandedUsers.includes(user.id) ? (
                                                            <IconChevronUp size={16} color="white" />
                                                        ) : (
                                                            <IconChevronDown size={16} color="white" />
                                                        )}
                                                    </ActionIcon>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Group gap="sm">
                                                        <Avatar
                                                            size={32}
                                                            radius="xl"
                                                            style={{
                                                                background: 'linear-gradient(135deg, #4988C4 0%, #667eea 100%)',
                                                            }}
                                                        >
                                                            {user.firstName?.charAt(0) || user.username?.charAt(0)}
                                                        </Avatar>
                                                        <Box>
                                                            <Text size="sm" fw={600} c="white">
                                                                {user.firstName} {user.lastName}
                                                            </Text>
                                                            <Text size="xs" c="dimmed">
                                                                @{user.username}
                                                            </Text>
                                                        </Box>
                                                    </Group>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Text size="sm" c="white">
                                                        {user.email}
                                                    </Text>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Badge
                                                        variant="light"
                                                        style={{
                                                            background: 'rgba(73, 136, 196, 0.2)',
                                                            color: '#4988C4',
                                                        }}
                                                    >
                                                        {userOrders.length} orders
                                                    </Badge>
                                                </Table.Td>
                                                <Table.Td>
                                                    <Text size="sm" fw={700} c="#51cf66">
                                                        ${totalSpent.toLocaleString()}
                                                    </Text>
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
                                                    <Tooltip label="Delete User">
                                                        <ActionIcon
                                                            variant="light"
                                                            color="red"
                                                            onClick={() => handleDeleteClick(user.id)}
                                                        >
                                                            <IconTrash size={16} />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                </Table.Td>
                                            </Table.Tr>
                                            <Table.Tr>
                                                <Table.Td colSpan={7} p={0}>
                                                    <Collapse in={expandedUsers.includes(user.id)}>
                                                        <Box
                                                            p="md"
                                                            style={{
                                                                background: 'rgba(73, 136, 196, 0.05)',
                                                                borderTop: '1px solid rgba(73, 136, 196, 0.1)',
                                                            }}
                                                        >
                                                            {userOrders.length > 0 ? (
                                                                <>
                                                                    <Text size="sm" fw={600} c="white" mb="sm">
                                                                        Order History for {user.firstName}:
                                                                    </Text>
                                                                    {userOrders.map((order) => (
                                                                        <Paper
                                                                            key={order.id}
                                                                            p="sm"
                                                                            mb="xs"
                                                                            style={{
                                                                                background: 'rgba(20, 20, 35, 0.6)',
                                                                                border: '1px solid rgba(73, 136, 196, 0.2)',
                                                                            }}
                                                                        >
                                                                            <Group justify="space-between">
                                                                                <Box>
                                                                                    <Text size="sm" fw={600} c="#4988C4">
                                                                                        {order.id}
                                                                                    </Text>
                                                                                    <Text size="xs" c="white" mt={2}>
                                                                                        {order.items.map((item) => item.productName).join(', ')}
                                                                                    </Text>
                                                                                    <Text size="xs" c="dimmed">
                                                                                        {order.date}
                                                                                    </Text>
                                                                                </Box>
                                                                                <Box ta="right">
                                                                                    <Text size="sm" fw={700} c="#51cf66" mb={5}>
                                                                                        ${order.totalAmount.toLocaleString()}
                                                                                    </Text>
                                                                                    <Badge
                                                                                        variant="light"
                                                                                        size="sm"
                                                                                        style={{
                                                                                            background: `${getStatusColor(order.status)}20`,
                                                                                            color: getStatusColor(order.status),
                                                                                            textTransform: 'capitalize',
                                                                                        }}
                                                                                    >
                                                                                        {order.status}
                                                                                    </Badge>
                                                                                </Box>
                                                                            </Group>
                                                                        </Paper>
                                                                    ))}
                                                                </>
                                                            ) : (
                                                                <Text size="sm" c="dimmed" ta="center" py="md">
                                                                    No orders yet
                                                                </Text>
                                                            )}
                                                        </Box>
                                                    </Collapse>
                                                </Table.Td>
                                            </Table.Tr>
                                        </>
                                    );
                                })}
                            </Table.Tbody>
                        </Table>

                        {users.length === 0 && (
                            <Box ta="center" py="xl">
                                <Text c="dimmed">No users found</Text>
                            </Box>
                        )}
                    </Paper>
                </>
            ) : (
                <>
                    {/* User: Personal Stats */}
                    <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg" mb="xl">
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
                            <Group gap="sm" mb="md">
                                <Box
                                    style={{
                                        width: rem(50),
                                        height: rem(50),
                                        borderRadius: rem(12),
                                        background:
                                            'linear-gradient(135deg, rgba(73, 136, 196, 0.2) 0%, rgba(73, 136, 196, 0.1) 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '1px solid rgba(73, 136, 196, 0.3)',
                                    }}
                                >
                                    <IconShoppingCart size={24} color="#4988C4" />
                                </Box>
                                <Box>
                                    <Text size="xs" c="dimmed" tt="uppercase">
                                        My Orders
                                    </Text>
                                    <Text size="xl" fw={900} c="white">
                                        {myOrders.length}
                                    </Text>
                                </Box>
                            </Group>
                        </Paper>

                        <Paper
                            p="xl"
                            radius="lg"
                            style={{
                                background: 'rgba(20, 20, 35, 0.8)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(81, 207, 102, 0.2)',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                            }}
                        >
                            <Group gap="sm" mb="md">
                                <Box
                                    style={{
                                        width: rem(50),
                                        height: rem(50),
                                        borderRadius: rem(12),
                                        background:
                                            'linear-gradient(135deg, rgba(81, 207, 102, 0.2) 0%, rgba(81, 207, 102, 0.1) 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '1px solid rgba(81, 207, 102, 0.3)',
                                    }}
                                >
                                    <IconPackage size={24} color="#51cf66" />
                                </Box>
                                <Box>
                                    <Text size="xs" c="dimmed" tt="uppercase">
                                        Completed
                                    </Text>
                                    <Text size="xl" fw={900} c="white">
                                        {myCompletedOrders}
                                    </Text>
                                </Box>
                            </Group>
                        </Paper>

                        <Paper
                            p="xl"
                            radius="lg"
                            style={{
                                background: 'rgba(20, 20, 35, 0.8)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(102, 126, 234, 0.2)',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                            }}
                        >
                            <Group gap="sm" mb="md">
                                <Box
                                    style={{
                                        width: rem(50),
                                        height: rem(50),
                                        borderRadius: rem(12),
                                        background:
                                            'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(102, 126, 234, 0.1) 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '1px solid rgba(102, 126, 234, 0.3)',
                                    }}
                                >
                                    <IconCurrencyDollar size={24} color="#667eea" />
                                </Box>
                                <Box>
                                    <Text size="xs" c="dimmed" tt="uppercase">
                                        Total Spent
                                    </Text>
                                    <Text size="xl" fw={900} c="white">
                                        ${myTotalSpent.toLocaleString()}
                                    </Text>
                                </Box>
                            </Group>
                        </Paper>
                    </SimpleGrid>

                    {/* User: My Orders and Products */}
                    <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
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
                            <Group justify="space-between" mb="xl">
                                <Text size="lg" fw={700} c="white" style={{ letterSpacing: '0.5px' }}>
                                    MY RECENT ORDERS
                                </Text>
                                <Button
                                    variant="subtle"
                                    size="xs"
                                    component={Link}
                                    to="/orders"
                                    style={{ color: '#4988C4' }}
                                >
                                    View All →
                                </Button>
                            </Group>
                            <Table horizontalSpacing="md" verticalSpacing="md" style={{ color: 'white' }}>
                                <Table.Tbody>
                                    {myOrders.slice(0, 3).map((order) => (
                                        <Table.Tr
                                            key={order.id}
                                            style={{ borderBottom: '1px solid rgba(73, 136, 196, 0.1)' }}
                                        >
                                            <Table.Td>
                                                <Box>
                                                    <Text size="sm" fw={600} c="#4988C4">
                                                        {order.id}
                                                    </Text>
                                                    <Text size="xs" c="white" mt={2}>
                                                        {order.items[0]?.productName}
                                                    </Text>
                                                    <Text size="xs" c="dimmed">
                                                        {order.date}
                                                    </Text>
                                                </Box>
                                            </Table.Td>
                                            <Table.Td>
                                                <Box ta="right">
                                                    <Text size="sm" fw={700} c="#51cf66" mb={5}>
                                                        ${order.totalAmount}
                                                    </Text>
                                                    <Badge
                                                        variant="light"
                                                        size="sm"
                                                        style={{
                                                            background: `${getStatusColor(order.status)}20`,
                                                            color: getStatusColor(order.status),
                                                            textTransform: 'capitalize',
                                                        }}
                                                    >
                                                        {order.status}
                                                    </Badge>
                                                </Box>
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                            {myOrders.length === 0 && (
                                <Box ta="center" py="xl">
                                    <Text c="dimmed">No orders yet</Text>
                                    <Button
                                        mt="md"
                                        component={Link}
                                        to="/products"
                                        style={{
                                            background: 'linear-gradient(135deg, #4988C4 0%, #667eea 100%)',
                                        }}
                                    >
                                        Browse Products
                                    </Button>
                                </Box>
                            )}
                        </Paper>

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
                            <Group justify="space-between" mb="xl">
                                <Text size="lg" fw={700} c="white" style={{ letterSpacing: '0.5px' }}>
                                    AVAILABLE PRODUCTS
                                </Text>
                                <IconStar size={20} color="#ffa94d" fill="#ffa94d" />
                            </Group>
                            <Box>
                                {products.slice(0, 3).map((product) => (
                                    <Paper
                                        key={product.id}
                                        p="md"
                                        mb="md"
                                        style={{
                                            background: 'rgba(73, 136, 196, 0.05)',
                                            border: '1px solid rgba(73, 136, 196, 0.2)',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = 'rgba(73, 136, 196, 0.5)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = 'rgba(73, 136, 196, 0.2)';
                                        }}
                                    >
                                        <Group justify="space-between">
                                            <Box>
                                                <Text size="sm" fw={600} c="white">
                                                    {product.name}
                                                </Text>
                                                <Text size="xs" c="dimmed" mt={2}>
                                                    {product.stock} in stock
                                                </Text>
                                            </Box>
                                            <Box ta="right">
                                                <Text size="sm" fw={700} c="#51cf66">
                                                    ${product.price}
                                                </Text>
                                            </Box>
                                        </Group>
                                    </Paper>
                                ))}
                                <Button
                                    fullWidth
                                    mt="md"
                                    variant="light"
                                    component={Link}
                                    to="/products"
                                    style={{
                                        background: 'rgba(73, 136, 196, 0.2)',
                                        color: '#4988C4',
                                    }}
                                >
                                    View All Products
                                </Button>
                            </Box>
                        </Paper>
                    </SimpleGrid>
                </>
            )}

            {/* Delete User Modal */}
            <Modal
                opened={deleteModalOpened}
                onClose={() => setDeleteModalOpened(false)}
                title={<Text fw={700} size="lg">Confirm Delete</Text>}
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
                <Text c="white" mb="xl">
                    Are you sure you want to delete this user? This action cannot be undone.
                </Text>
                <Group justify="flex-end">
                    <Button variant="subtle" onClick={() => setDeleteModalOpened(false)}>
                        Cancel
                    </Button>
                    <Button color="red" onClick={handleConfirmDelete} loading={deleting}>
                        Delete User
                    </Button>
                </Group>
            </Modal>
        </Box>
    );
}