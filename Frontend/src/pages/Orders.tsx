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
    Collapse,
} from '@mantine/core';
import {
    IconSearch,
    IconEye,
    IconEdit,
    IconShoppingCart,
    IconChevronDown,
    IconChevronUp,
} from '@tabler/icons-react';
import { useState } from 'react';

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

export function Orders() {
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
            items: [
                { productName: 'iPhone 15 Pro', quantity: 1, price: 1199 },
            ],
            totalAmount: 1199,
            status: 'pending',
            date: '2024-02-07',
        },
        {
            id: 'ORD-2024-003',
            customerName: 'Mike Johnson',
            customerEmail: 'mike@example.com',
            items: [
                { productName: 'iPad Air', quantity: 2, price: 599 },
                { productName: 'Magic Keyboard', quantity: 2, price: 99 },
            ],
            totalAmount: 1396,
            status: 'completed',
            date: '2024-02-06',
        },
        {
            id: 'ORD-2024-004',
            customerName: 'Sarah Wilson',
            customerEmail: 'sarah@example.com',
            items: [
                { productName: 'AirPods Pro', quantity: 5, price: 249 },
            ],
            totalAmount: 1245,
            status: 'cancelled',
            date: '2024-02-05',
        },
        {
            id: 'ORD-2024-005',
            customerName: 'Tom Brown',
            customerEmail: 'tom@example.com',
            items: [
                { productName: 'MacBook Pro 16"', quantity: 1, price: 2499 },
                { productName: 'iPhone 15 Pro', quantity: 1, price: 1199 },
                { productName: 'AirPods Pro', quantity: 1, price: 249 },
            ],
            totalAmount: 3947,
            status: 'pending',
            date: '2024-02-04',
        },
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    const [viewModalOpened, setViewModalOpened] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [editModalOpened, setEditModalOpened] = useState(false);
    const [expandedOrders, setExpandedOrders] = useState<string[]>([]);

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

    const handleViewOrder = (order: Order) => {
        setSelectedOrder(order);
        setViewModalOpened(true);
    };

    const handleEditStatus = (order: Order) => {
        setSelectedOrder(order);
        setEditModalOpened(true);
    };

    const handleUpdateStatus = (newStatus: 'pending' | 'completed' | 'cancelled') => {
        if (selectedOrder) {
            setOrders(
                orders.map((o) =>
                    o.id === selectedOrder.id ? { ...o, status: newStatus } : o
                )
            );
            setEditModalOpened(false);
        }
    };

    const toggleOrderExpand = (orderId: string) => {
        setExpandedOrders((prev) =>
            prev.includes(orderId)
                ? prev.filter((id) => id !== orderId)
                : [...prev, orderId]
        );
    };

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter ? order.status === statusFilter : true;

        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: orders.length,
        pending: orders.filter((o) => o.status === 'pending').length,
        completed: orders.filter((o) => o.status === 'completed').length,
        cancelled: orders.filter((o) => o.status === 'cancelled').length,
    };

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
                        Orders Management 🛒
                    </Text>
                    <Text c="dimmed" size="sm" mt={5}>
                        Track and manage customer orders
                    </Text>
                </Box>
            </Group>

            {/* Stats */}
            <Group mb="lg" grow>
                <Paper
                    p="md"
                    radius="lg"
                    style={{
                        background: 'rgba(20, 20, 35, 0.8)',
                        border: '1px solid rgba(73, 136, 196, 0.2)',
                    }}
                >
                    <Text size="xs" c="dimmed" tt="uppercase">
                        Total Orders
                    </Text>
                    <Text size="xl" fw={900} c="white">
                        {stats.total}
                    </Text>
                </Paper>
                <Paper
                    p="md"
                    radius="lg"
                    style={{
                        background: 'rgba(255, 166, 77, 0.1)',
                        border: '1px solid rgba(255, 166, 77, 0.3)',
                    }}
                >
                    <Text size="xs" c="dimmed" tt="uppercase">
                        Pending
                    </Text>
                    <Text size="xl" fw={900} c="#ffa94d">
                        {stats.pending}
                    </Text>
                </Paper>
                <Paper
                    p="md"
                    radius="lg"
                    style={{
                        background: 'rgba(81, 207, 102, 0.1)',
                        border: '1px solid rgba(81, 207, 102, 0.3)',
                    }}
                >
                    <Text size="xs" c="dimmed" tt="uppercase">
                        Completed
                    </Text>
                    <Text size="xl" fw={900} c="#51cf66">
                        {stats.completed}
                    </Text>
                </Paper>
                <Paper
                    p="md"
                    radius="lg"
                    style={{
                        background: 'rgba(255, 107, 107, 0.1)',
                        border: '1px solid rgba(255, 107, 107, 0.3)',
                    }}
                >
                    <Text size="xs" c="dimmed" tt="uppercase">
                        Cancelled
                    </Text>
                    <Text size="xl" fw={900} c="#ff6b6b">
                        {stats.cancelled}
                    </Text>
                </Paper>
            </Group>

            {/* Search and Filter */}
            <Group mb="lg">
                <TextInput
                    placeholder="Search orders..."
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
                <Select
                    placeholder="Filter by status"
                    data={[
                        { value: 'all', label: 'All Orders' },
                        { value: 'pending', label: 'Pending' },
                        { value: 'completed', label: 'Completed' },
                        { value: 'cancelled', label: 'Cancelled' },
                    ]}
                    value={statusFilter || 'all'}
                    onChange={(value) => setStatusFilter(value === 'all' ? null : value)}
                    styles={{
                        input: {
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(73, 136, 196, 0.3)',
                            color: 'white',
                            minWidth: rem(200),
                        },
                    }}
                />
            </Group>

            {/* Orders Table */}
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
                <Table
                    horizontalSpacing="md"
                    verticalSpacing="md"
                    style={{ color: 'white' }}
                >
                    <Table.Thead>
                        <Table.Tr
                            style={{
                                borderBottom: '1px solid rgba(73, 136, 196, 0.2)',
                            }}
                        >
                            <Table.Th style={{ color: 'rgba(255, 255, 255, 0.7)', width: 40 }}>

                            </Table.Th>
                            <Table.Th style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                ORDER ID
                            </Table.Th>
                            <Table.Th style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                CUSTOMER
                            </Table.Th>
                            <Table.Th style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                ITEMS
                            </Table.Th>
                            <Table.Th style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                TOTAL
                            </Table.Th>
                            <Table.Th style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                STATUS
                            </Table.Th>
                            <Table.Th style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                DATE
                            </Table.Th>
                            <Table.Th style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                ACTIONS
                            </Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {filteredOrders.map((order) => (
                            <>
                                <Table.Tr
                                    key={order.id}
                                    style={{
                                        borderBottom: '1px solid rgba(73, 136, 196, 0.1)',
                                    }}
                                >
                                    <Table.Td>
                                        <ActionIcon
                                            variant="subtle"
                                            onClick={() => toggleOrderExpand(order.id)}
                                        >
                                            {expandedOrders.includes(order.id) ? (
                                                <IconChevronUp size={16} color="white" />
                                            ) : (
                                                <IconChevronDown size={16} color="white" />
                                            )}
                                        </ActionIcon>
                                    </Table.Td>
                                    <Table.Td>
                                        <Group gap="sm">
                                            <Box
                                                style={{
                                                    width: rem(40),
                                                    height: rem(40),
                                                    borderRadius: rem(8),
                                                    background: 'linear-gradient(135deg, #4988C4 0%, #667eea 100%)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <IconShoppingCart size={20} color="white" />
                                            </Box>
                                            <Text size="sm" fw={600} c="#4988C4">
                                                {order.id}
                                            </Text>
                                        </Group>
                                    </Table.Td>
                                    <Table.Td>
                                        <Box>
                                            <Text size="sm" fw={600} c="white">
                                                {order.customerName}
                                            </Text>
                                            <Text size="xs" c="dimmed">
                                                {order.customerEmail}
                                            </Text>
                                        </Box>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text size="sm" c="white">
                                            {order.items.length} item(s)
                                        </Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text size="sm" fw={700} c="#51cf66">
                                            ${order.totalAmount.toLocaleString()}
                                        </Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Badge
                                            variant="light"
                                            style={{
                                                background: `${getStatusColor(order.status)}20`,
                                                color: getStatusColor(order.status),
                                                border: `1px solid ${getStatusColor(order.status)}40`,
                                                textTransform: 'capitalize',
                                            }}
                                        >
                                            {order.status}
                                        </Badge>
                                    </Table.Td>
                                    <Table.Td>
                                        <Text size="sm" c="dimmed">
                                            {order.date}
                                        </Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Group gap="xs">
                                            <Tooltip label="View Details">
                                                <ActionIcon
                                                    variant="light"
                                                    color="blue"
                                                    onClick={() => handleViewOrder(order)}
                                                >
                                                    <IconEye size={16} />
                                                </ActionIcon>
                                            </Tooltip>
                                            <Tooltip label="Update Status">
                                                <ActionIcon
                                                    variant="light"
                                                    color="green"
                                                    onClick={() => handleEditStatus(order)}
                                                >
                                                    <IconEdit size={16} />
                                                </ActionIcon>
                                            </Tooltip>
                                        </Group>
                                    </Table.Td>
                                </Table.Tr>
                                <Table.Tr>
                                    <Table.Td colSpan={8} p={0}>
                                        <Collapse in={expandedOrders.includes(order.id)}>
                                            <Box
                                                p="md"
                                                style={{
                                                    background: 'rgba(73, 136, 196, 0.05)',
                                                    borderTop: '1px solid rgba(73, 136, 196, 0.1)',
                                                }}
                                            >
                                                <Text size="sm" fw={600} c="white" mb="sm">
                                                    Order Items:
                                                </Text>
                                                {order.items.map((item, idx) => (
                                                    <Group key={idx} justify="space-between" mb="xs">
                                                        <Text size="sm" c="white">
                                                            {item.productName} × {item.quantity}
                                                        </Text>
                                                        <Text size="sm" fw={600} c="#51cf66">
                                                            ${(item.price * item.quantity).toLocaleString()}
                                                        </Text>
                                                    </Group>
                                                ))}
                                            </Box>
                                        </Collapse>
                                    </Table.Td>
                                </Table.Tr>
                            </>
                        ))}
                    </Table.Tbody>
                </Table>

                {filteredOrders.length === 0 && (
                    <Box ta="center" py="xl">
                        <Text c="dimmed">No orders found</Text>
                    </Box>
                )}
            </Paper>

            {/* View Order Modal */}
            <Modal
                opened={viewModalOpened}
                onClose={() => setViewModalOpened(false)}
                title={
                    <Text fw={700} size="lg">
                        Order Details
                    </Text>
                }
                size="lg"
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
                {selectedOrder && (
                    <Box>
                        <Group mb="md" justify="space-between">
                            <Box>
                                <Text size="xs" c="dimmed" tt="uppercase">
                                    Order ID
                                </Text>
                                <Text size="lg" fw={700} c="#4988C4">
                                    {selectedOrder.id}
                                </Text>
                            </Box>
                            <Badge
                                size="lg"
                                variant="light"
                                style={{
                                    background: `${getStatusColor(selectedOrder.status)}20`,
                                    color: getStatusColor(selectedOrder.status),
                                    border: `1px solid ${getStatusColor(selectedOrder.status)}40`,
                                    textTransform: 'capitalize',
                                }}
                            >
                                {selectedOrder.status}
                            </Badge>
                        </Group>

                        <Paper
                            p="md"
                            mb="md"
                            style={{
                                background: 'rgba(73, 136, 196, 0.05)',
                                border: '1px solid rgba(73, 136, 196, 0.2)',
                            }}
                        >
                            <Text size="xs" c="dimmed" tt="uppercase" mb="xs">
                                Customer Information
                            </Text>
                            <Text size="sm" fw={600} c="white">
                                {selectedOrder.customerName}
                            </Text>
                            <Text size="sm" c="dimmed">
                                {selectedOrder.customerEmail}
                            </Text>
                        </Paper>

                        <Paper
                            p="md"
                            mb="md"
                            style={{
                                background: 'rgba(73, 136, 196, 0.05)',
                                border: '1px solid rgba(73, 136, 196, 0.2)',
                            }}
                        >
                            <Text size="xs" c="dimmed" tt="uppercase" mb="md">
                                Order Items
                            </Text>
                            {selectedOrder.items.map((item, idx) => (
                                <Group key={idx} justify="space-between" mb="sm">
                                    <Box style={{ flex: 1 }}>
                                        <Text size="sm" fw={600} c="white">
                                            {item.productName}
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                            ${item.price} × {item.quantity}
                                        </Text>
                                    </Box>
                                    <Text size="sm" fw={700} c="#51cf66">
                                        ${(item.price * item.quantity).toLocaleString()}
                                    </Text>
                                </Group>
                            ))}
                            <Box
                                mt="md"
                                pt="md"
                                style={{ borderTop: '1px solid rgba(73, 136, 196, 0.2)' }}
                            >
                                <Group justify="space-between">
                                    <Text size="lg" fw={700} c="white">
                                        Total Amount
                                    </Text>
                                    <Text size="xl" fw={900} c="#51cf66">
                                        ${selectedOrder.totalAmount.toLocaleString()}
                                    </Text>
                                </Group>
                            </Box>
                        </Paper>

                        <Text size="xs" c="dimmed">
                            Order Date: {selectedOrder.date}
                        </Text>
                    </Box>
                )}
            </Modal>

            {/* Edit Status Modal */}
            <Modal
                opened={editModalOpened}
                onClose={() => setEditModalOpened(false)}
                title={
                    <Text fw={700} size="lg">
                        Update Order Status
                    </Text>
                }
                size="sm"
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
                {selectedOrder && (
                    <Box>
                        <Text size="sm" c="dimmed" mb="md">
                            Order: {selectedOrder.id}
                        </Text>
                        <Text size="sm" c="white" mb="sm">
                            Current Status:{' '}
                            <Badge
                                variant="light"
                                style={{
                                    background: `${getStatusColor(selectedOrder.status)}20`,
                                    color: getStatusColor(selectedOrder.status),
                                }}
                            >
                                {selectedOrder.status}
                            </Badge>
                        </Text>
                        <Group mt="xl">
                            <Button
                                fullWidth
                                color="orange"
                                onClick={() => handleUpdateStatus('pending')}
                                disabled={selectedOrder.status === 'pending'}
                            >
                                Set as Pending
                            </Button>
                            <Button
                                fullWidth
                                color="green"
                                onClick={() => handleUpdateStatus('completed')}
                                disabled={selectedOrder.status === 'completed'}
                            >
                                Set as Completed
                            </Button>
                            <Button
                                fullWidth
                                color="red"
                                onClick={() => handleUpdateStatus('cancelled')}
                                disabled={selectedOrder.status === 'cancelled'}
                            >
                                Set as Cancelled
                            </Button>
                        </Group>
                    </Box>
                )}
            </Modal>
        </Box>
    );
}