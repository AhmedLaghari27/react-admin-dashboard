import {
    Grid,
    Paper,
    Text,
    Group,
    Box,
    rem,
    Table,
    Badge,
    ActionIcon,
    Avatar,
    Progress,
    SimpleGrid,
    RingProgress,
} from '@mantine/core';
import {
    IconUsers,
    IconPackage,
    IconShoppingCart,
    IconCurrencyDollar,
    IconTrendingUp,
    IconTrendingDown,
    IconArrowUpRight,
    IconEye,
    IconStar,
    IconAlertCircle,
} from '@tabler/icons-react';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

// Sample data
const salesData = [
    { month: 'Jan', revenue: 4000, orders: 240 },
    { month: 'Feb', revenue: 3000, orders: 198 },
    { month: 'Mar', revenue: 5000, orders: 350 },
    { month: 'Apr', revenue: 4500, orders: 280 },
    { month: 'May', revenue: 6000, orders: 420 },
    { month: 'Jun', revenue: 5500, orders: 380 },
];

const orderStatusData = [
    { name: 'Completed', value: 450, color: '#51cf66' },
    { name: 'Pending', value: 180, color: '#ffa94d' },
    { name: 'Cancelled', value: 50, color: '#ff6b6b' },
];

const categoryData = [
    { category: 'Electronics', sales: 4500 },
    { category: 'Clothing', sales: 3200 },
    { category: 'Books', sales: 2100 },
    { category: 'Home', sales: 1800 },
    { category: 'Sports', sales: 1500 },
];

const recentOrders = [
    {
        id: '#ORD-2024-001',
        customer: 'John Doe',
        product: 'MacBook Pro 16"',
        amount: '$2,499',
        status: 'completed',
        date: '2 hours ago',
    },
    {
        id: '#ORD-2024-002',
        customer: 'Jane Smith',
        product: 'iPhone 15 Pro',
        amount: '$1,199',
        status: 'pending',
        date: '5 hours ago',
    },
    {
        id: '#ORD-2024-003',
        customer: 'Mike Johnson',
        product: 'AirPods Pro',
        amount: '$249',
        status: 'completed',
        date: '1 day ago',
    },
    {
        id: '#ORD-2024-004',
        customer: 'Sarah Wilson',
        product: 'iPad Air',
        amount: '$599',
        status: 'pending',
        date: '1 day ago',
    },
    {
        id: '#ORD-2024-005',
        customer: 'Tom Brown',
        product: 'Apple Watch',
        amount: '$399',
        status: 'cancelled',
        date: '2 days ago',
    },
];

const topProducts = [
    { name: 'MacBook Pro 16"', sales: 145, revenue: '$362,355' },
    { name: 'iPhone 15 Pro', sales: 289, revenue: '$346,411' },
    { name: 'AirPods Pro', sales: 567, revenue: '$141,183' },
    { name: 'iPad Air', sales: 198, revenue: '$118,602' },
    { name: 'Apple Watch', sales: 243, revenue: '$96,957' },
];

function StatCard({
    title,
    value,
    icon: Icon,
    trend,
    trendValue,
    color,
}: {
    title: string;
    value: string;
    icon: any;
    trend: 'up' | 'down';
    trendValue: string;
    color: string;
}) {
    return (
        <Paper
            p="xl"
            radius="lg"
            style={{
                background: 'rgba(20, 20, 35, 0.8)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(73, 136, 196, 0.2)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(73, 136, 196, 0.3)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
            }}
        >
            <Group justify="space-between">
                <Box>
                    <Text size="xs" c="dimmed" tt="uppercase" fw={700} style={{ letterSpacing: '0.5px' }}>
                        {title}
                    </Text>
                    <Text
                        size="xl"
                        fw={900}
                        mt="xs"
                        style={{
                            color: 'white',
                            fontSize: rem(32),
                        }}
                    >
                        {value}
                    </Text>
                    <Group gap={5} mt="xs">
                        {trend === 'up' ? (
                            <IconTrendingUp size={16} color="#51cf66" />
                        ) : (
                            <IconTrendingDown size={16} color="#ff6b6b" />
                        )}
                        <Text size="sm" c={trend === 'up' ? '#51cf66' : '#ff6b6b'} fw={600}>
                            {trendValue}
                        </Text>
                        <Text size="sm" c="dimmed">
                            vs last month
                        </Text>
                    </Group>
                </Box>
                <Box
                    style={{
                        width: rem(60),
                        height: rem(60),
                        borderRadius: rem(12),
                        background: `linear-gradient(135deg, ${color}20, ${color}10)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `1px solid ${color}40`,
                    }}
                >
                    <Icon size={30} color={color} stroke={2} />
                </Box>
            </Group>
        </Paper>
    );
}

export function Dashboard() {
    const getStatusBadge = (status: string) => {
        const colors = {
            completed: '#51cf66',
            pending: '#ffa94d',
            cancelled: '#ff6b6b',
        };

        return (
            <Badge
                variant="light"
                style={{
                    background: `${colors[status as keyof typeof colors]}20`,
                    color: colors[status as keyof typeof colors],
                    border: `1px solid ${colors[status as keyof typeof colors]}40`,
                    textTransform: 'capitalize',
                }}
            >
                {status}
            </Badge>
        );
    };

    return (
        <Box>
            {/* Welcome Header */}
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
                        Welcome back, Admin! 👋
                    </Text>
                    <Text c="dimmed" size="sm" mt={5}>
                        Here's what's happening with your store today
                    </Text>
                </Box>
                <Text c="dimmed" size="sm">
                    {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
                </Text>
            </Group>

            {/* KPI Cards */}
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg" mb="xl">
                <StatCard
                    title="Total Users"
                    value="2,543"
                    icon={IconUsers}
                    trend="up"
                    trendValue="+12.5%"
                    color="#4988C4"
                />
                <StatCard
                    title="Total Products"
                    value="1,248"
                    icon={IconPackage}
                    trend="up"
                    trendValue="+8.2%"
                    color="#667eea"
                />
                <StatCard
                    title="Total Orders"
                    value="680"
                    icon={IconShoppingCart}
                    trend="down"
                    trendValue="-3.1%"
                    color="#ffa94d"
                />
                <StatCard
                    title="Revenue"
                    value="$1.2M"
                    icon={IconCurrencyDollar}
                    trend="up"
                    trendValue="+18.7%"
                    color="#51cf66"
                />
            </SimpleGrid>

            {/* Charts Row */}
            <Grid gutter="lg" mb="xl">
                {/* Sales Trend Chart */}
                <Grid.Col span={{ base: 12, lg: 8 }}>
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
                                <Text
                                    size="lg"
                                    fw={700}
                                    c="white"
                                    style={{ letterSpacing: '0.5px' }}
                                >
                                    REVENUE OVERVIEW
                                </Text>
                                <Text size="sm" c="dimmed" mt={5}>
                                    Monthly revenue and order trends
                                </Text>
                            </Box>
                            <Group gap="xs">
                                <Box
                                    style={{
                                        padding: `${rem(4)} ${rem(12)}`,
                                        background: 'rgba(73, 136, 196, 0.2)',
                                        borderRadius: rem(6),
                                        border: '1px solid rgba(73, 136, 196, 0.3)',
                                    }}
                                >
                                    <Text size="xs" c="#4988C4" fw={600}>
                                        6 MONTHS
                                    </Text>
                                </Box>
                            </Group>
                        </Group>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={salesData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4988C4" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#4988C4" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                                <XAxis dataKey="month" stroke="rgba(255, 255, 255, 0.5)" />
                                <YAxis stroke="rgba(255, 255, 255, 0.5)" />
                                <Tooltip
                                    contentStyle={{
                                        background: 'rgba(20, 20, 35, 0.95)',
                                        border: '1px solid rgba(73, 136, 196, 0.3)',
                                        borderRadius: '8px',
                                        color: 'white',
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#4988C4"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid.Col>

                {/* Order Status Distribution */}
                <Grid.Col span={{ base: 12, lg: 4 }}>
                    <Paper
                        p="xl"
                        radius="lg"
                        style={{
                            background: 'rgba(20, 20, 35, 0.8)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(73, 136, 196, 0.2)',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                            height: '100%',
                        }}
                    >
                        <Text
                            size="lg"
                            fw={700}
                            c="white"
                            mb="xl"
                            style={{ letterSpacing: '0.5px' }}
                        >
                            ORDER STATUS
                        </Text>
                        <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={orderStatusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {orderStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            background: 'rgba(20, 20, 35, 0.95)',
                                            border: '1px solid rgba(73, 136, 196, 0.3)',
                                            borderRadius: '8px',
                                            color: 'white',
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </Box>
                        <Box mt="md">
                            {orderStatusData.map((item) => (
                                <Group key={item.name} justify="space-between" mb="sm">
                                    <Group gap="xs">
                                        <Box
                                            style={{
                                                width: rem(12),
                                                height: rem(12),
                                                borderRadius: '50%',
                                                background: item.color,
                                            }}
                                        />
                                        <Text size="sm" c="white">
                                            {item.name}
                                        </Text>
                                    </Group>
                                    <Text size="sm" fw={600} c={item.color}>
                                        {item.value}
                                    </Text>
                                </Group>
                            ))}
                        </Box>
                    </Paper>
                </Grid.Col>
            </Grid>

            {/* Category Performance Chart */}
            <Paper
                p="xl"
                radius="lg"
                mb="xl"
                style={{
                    background: 'rgba(20, 20, 35, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(73, 136, 196, 0.2)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                }}
            >
                <Text
                    size="lg"
                    fw={700}
                    c="white"
                    mb="xl"
                    style={{ letterSpacing: '0.5px' }}
                >
                    CATEGORY PERFORMANCE
                </Text>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={categoryData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis dataKey="category" stroke="rgba(255, 255, 255, 0.5)" />
                        <YAxis stroke="rgba(255, 255, 255, 0.5)" />
                        <Tooltip
                            contentStyle={{
                                background: 'rgba(20, 20, 35, 0.95)',
                                border: '1px solid rgba(73, 136, 196, 0.3)',
                                borderRadius: '8px',
                                color: 'white',
                            }}
                        />
                        <Bar dataKey="sales" fill="#667eea" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </Paper>

            {/* Bottom Grid */}
            <Grid gutter="lg">
                {/* Recent Orders Table */}
                <Grid.Col span={{ base: 12, lg: 8 }}>
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
                            <Text
                                size="lg"
                                fw={700}
                                c="white"
                                style={{ letterSpacing: '0.5px' }}
                            >
                                RECENT ORDERS
                            </Text>
                            <ActionIcon
                                variant="subtle"
                                size="lg"
                                style={{
                                    color: '#4988C4',
                                }}
                            >
                                <IconArrowUpRight size={20} />
                            </ActionIcon>
                        </Group>
                        <Table
                            horizontalSpacing="md"
                            verticalSpacing="md"
                            style={{
                                color: 'white',
                            }}
                        >
                            <Table.Thead>
                                <Table.Tr
                                    style={{
                                        borderBottom: '1px solid rgba(73, 136, 196, 0.2)',
                                    }}
                                >
                                    <Table.Th style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                        ORDER ID
                                    </Table.Th>
                                    <Table.Th style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                        CUSTOMER
                                    </Table.Th>
                                    <Table.Th style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                        PRODUCT
                                    </Table.Th>
                                    <Table.Th style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                        AMOUNT
                                    </Table.Th>
                                    <Table.Th style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                        STATUS
                                    </Table.Th>
                                    <Table.Th style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                        DATE
                                    </Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {recentOrders.map((order) => (
                                    <Table.Tr
                                        key={order.id}
                                        style={{
                                            borderBottom: '1px solid rgba(73, 136, 196, 0.1)',
                                        }}
                                    >
                                        <Table.Td>
                                            <Text size="sm" fw={600} c="#4988C4">
                                                {order.id}
                                            </Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Group gap="sm">
                                                <Avatar
                                                    size={30}
                                                    radius="xl"
                                                    style={{
                                                        background: 'linear-gradient(135deg, #4988C4 0%, #667eea 100%)',
                                                    }}
                                                >
                                                    {order.customer.charAt(0)}
                                                </Avatar>
                                                <Text size="sm" c="white">
                                                    {order.customer}
                                                </Text>
                                            </Group>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm" c="white">
                                                {order.product}
                                            </Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm" fw={600} c="white">
                                                {order.amount}
                                            </Text>
                                        </Table.Td>
                                        <Table.Td>{getStatusBadge(order.status)}</Table.Td>
                                        <Table.Td>
                                            <Text size="sm" c="dimmed">
                                                {order.date}
                                            </Text>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </Paper>
                </Grid.Col>

                {/* Top Products & Quick Stats */}
                <Grid.Col span={{ base: 12, lg: 4 }}>
                    {/* Top Products */}
                    <Paper
                        p="xl"
                        radius="lg"
                        mb="lg"
                        style={{
                            background: 'rgba(20, 20, 35, 0.8)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(73, 136, 196, 0.2)',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                        }}
                    >
                        <Group justify="space-between" mb="xl">
                            <Text
                                size="lg"
                                fw={700}
                                c="white"
                                style={{ letterSpacing: '0.5px' }}
                            >
                                TOP PRODUCTS
                            </Text>
                            <IconStar size={20} color="#ffa94d" />
                        </Group>
                        <Box>
                            {topProducts.map((product, index) => (
                                <Box
                                    key={product.name}
                                    mb="md"
                                    p="sm"
                                    style={{
                                        background: 'rgba(73, 136, 196, 0.05)',
                                        borderRadius: rem(8),
                                        border: '1px solid rgba(73, 136, 196, 0.1)',
                                    }}
                                >
                                    <Group justify="space-between" mb="xs">
                                        <Text size="sm" fw={600} c="white">
                                            {index + 1}. {product.name}
                                        </Text>
                                    </Group>
                                    <Group justify="space-between">
                                        <Text size="xs" c="dimmed">
                                            {product.sales} sales
                                        </Text>
                                        <Text size="xs" fw={600} c="#51cf66">
                                            {product.revenue}
                                        </Text>
                                    </Group>
                                </Box>
                            ))}
                        </Box>
                    </Paper>

                    {/* Quick Stats Panel */}
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
                        <Text
                            size="lg"
                            fw={700}
                            c="white"
                            mb="xl"
                            style={{ letterSpacing: '0.5px' }}
                        >
                            QUICK STATS
                        </Text>
                        <Box>
                            <Box
                                mb="lg"
                                p="md"
                                style={{
                                    background: 'rgba(255, 166, 77, 0.1)',
                                    borderRadius: rem(8),
                                    border: '1px solid rgba(255, 166, 77, 0.3)',
                                }}
                            >
                                <Group justify="space-between" mb="xs">
                                    <Text size="sm" c="white">
                                        Pending Orders
                                    </Text>
                                    <Text size="xl" fw={900} c="#ffa94d">
                                        180
                                    </Text>
                                </Group>
                                <Progress value={65} color="#ffa94d" size="sm" />
                            </Box>

                            <Box
                                mb="lg"
                                p="md"
                                style={{
                                    background: 'rgba(255, 107, 107, 0.1)',
                                    borderRadius: rem(8),
                                    border: '1px solid rgba(255, 107, 107, 0.3)',
                                }}
                            >
                                <Group justify="space-between" mb="xs">
                                    <Text size="sm" c="white">
                                        Low Stock Items
                                    </Text>
                                    <Text size="xl" fw={900} c="#ff6b6b">
                                        12
                                    </Text>
                                </Group>
                                <Progress value={30} color="#ff6b6b" size="sm" />
                            </Box>

                            <Box
                                p="md"
                                style={{
                                    background: 'rgba(81, 207, 102, 0.1)',
                                    borderRadius: rem(8),
                                    border: '1px solid rgba(81, 207, 102, 0.3)',
                                }}
                            >
                                <Group justify="space-between" mb="xs">
                                    <Text size="sm" c="white">
                                        New Users (This Week)
                                    </Text>
                                    <Text size="xl" fw={900} c="#51cf66">
                                        94
                                    </Text>
                                </Group>
                                <Progress value={85} color="#51cf66" size="sm" />
                            </Box>
                        </Box>
                    </Paper>
                </Grid.Col>
            </Grid>
        </Box>
    );
}