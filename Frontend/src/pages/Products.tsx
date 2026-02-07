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
    NumberInput,
    Select,
    ActionIcon,
    rem,
    Tooltip,
} from '@mantine/core';
import {
    IconPlus,
    IconEdit,
    IconTrash,
    IconSearch,
    IconPackage,
} from '@tabler/icons-react';
import { useState } from 'react';

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    status: 'active' | 'inactive' | 'out-of-stock';
    category: string;
    createdAt: string;
}

export function Products() {
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
            stock: 0,
            status: 'out-of-stock',
            category: 'Electronics',
            createdAt: '2024-01-20',
        },
        {
            id: '3',
            name: 'AirPods Pro',
            price: 249,
            stock: 150,
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
            status: 'inactive',
            category: 'Accessories',
            createdAt: '2024-02-08',
        },
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [modalOpened, setModalOpened] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        stock: 0,
        status: 'active' as 'active' | 'inactive' | 'out-of-stock',
        category: '',
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return '#51cf66';
            case 'inactive':
                return '#ffa94d';
            case 'out-of-stock':
                return '#ff6b6b';
            default:
                return '#4988C4';
        }
    };

    const handleAddProduct = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            price: 0,
            stock: 0,
            status: 'active',
            category: '',
        });
        setModalOpened(true);
    };

    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            price: product.price,
            stock: product.stock,
            status: product.status,
            category: product.category,
        });
        setModalOpened(true);
    };

    const handleDeleteProduct = (id: string) => {
        setProducts(products.filter((p) => p.id !== id));
    };

    const handleSaveProduct = () => {
        if (editingProduct) {
            // Update existing product
            setProducts(
                products.map((p) =>
                    p.id === editingProduct.id
                        ? { ...editingProduct, ...formData }
                        : p
                )
            );
        } else {
            // Add new product
            const newProduct: Product = {
                id: Date.now().toString(),
                ...formData,
                createdAt: new Date().toISOString().split('T')[0],
            };
            setProducts([...products, newProduct]);
        }
        setModalOpened(false);
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
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
                        Products Management 📦
                    </Text>
                    <Text c="dimmed" size="sm" mt={5}>
                        Manage your product inventory and pricing
                    </Text>
                </Box>
                <Button
                    leftSection={<IconPlus size={20} />}
                    onClick={handleAddProduct}
                    style={{
                        background: 'linear-gradient(135deg, #4988C4 0%, #667eea 100%)',
                        fontWeight: 700,
                    }}
                >
                    Add Product
                </Button>
            </Group>

            {/* Search and Stats */}
            <Group mb="lg">
                <TextInput
                    placeholder="Search products..."
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

            {/* Products Table */}
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
                            <Table.Th style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                PRODUCT NAME
                            </Table.Th>
                            <Table.Th style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                CATEGORY
                            </Table.Th>
                            <Table.Th style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                PRICE
                            </Table.Th>
                            <Table.Th style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                STOCK
                            </Table.Th>
                            <Table.Th style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                STATUS
                            </Table.Th>
                            <Table.Th style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                ACTIONS
                            </Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {filteredProducts.map((product) => (
                            <Table.Tr
                                key={product.id}
                                style={{
                                    borderBottom: '1px solid rgba(73, 136, 196, 0.1)',
                                }}
                            >
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
                                            <IconPackage size={20} color="white" />
                                        </Box>
                                        <Box>
                                            <Text size="sm" fw={600} c="white">
                                                {product.name}
                                            </Text>
                                            <Text size="xs" c="dimmed">
                                                ID: {product.id}
                                            </Text>
                                        </Box>
                                    </Group>
                                </Table.Td>
                                <Table.Td>
                                    <Text size="sm" c="white">
                                        {product.category}
                                    </Text>
                                </Table.Td>
                                <Table.Td>
                                    <Text size="sm" fw={600} c="white">
                                        ${product.price.toLocaleString()}
                                    </Text>
                                </Table.Td>
                                <Table.Td>
                                    <Text
                                        size="sm"
                                        fw={600}
                                        c={product.stock < 10 ? '#ff6b6b' : '#51cf66'}
                                    >
                                        {product.stock} units
                                    </Text>
                                </Table.Td>
                                <Table.Td>
                                    <Badge
                                        variant="light"
                                        style={{
                                            background: `${getStatusColor(product.status)}20`,
                                            color: getStatusColor(product.status),
                                            border: `1px solid ${getStatusColor(product.status)}40`,
                                            textTransform: 'capitalize',
                                        }}
                                    >
                                        {product.status.replace('-', ' ')}
                                    </Badge>
                                </Table.Td>
                                <Table.Td>
                                    <Group gap="xs">
                                        <Tooltip label="Edit Product">
                                            <ActionIcon
                                                variant="light"
                                                color="blue"
                                                onClick={() => handleEditProduct(product)}
                                            >
                                                <IconEdit size={16} />
                                            </ActionIcon>
                                        </Tooltip>
                                        <Tooltip label="Delete Product">
                                            <ActionIcon
                                                variant="light"
                                                color="red"
                                                onClick={() => handleDeleteProduct(product.id)}
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

                {filteredProducts.length === 0 && (
                    <Box ta="center" py="xl">
                        <Text c="dimmed">No products found</Text>
                    </Box>
                )}
            </Paper>

            {/* Add/Edit Product Modal */}
            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                title={
                    <Text fw={700} size="lg">
                        {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </Text>
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
                    <TextInput
                        label="Product Name"
                        placeholder="Enter product name"
                        required
                        mb="md"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
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
                        label="Category"
                        placeholder="Enter category"
                        required
                        mb="md"
                        value={formData.category}
                        onChange={(e) =>
                            setFormData({ ...formData, category: e.target.value })
                        }
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

                    <NumberInput
                        label="Price"
                        placeholder="0.00"
                        required
                        mb="md"
                        prefix="$"
                        decimalScale={2}
                        value={formData.price}
                        onChange={(value) =>
                            setFormData({ ...formData, price: Number(value) })
                        }
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

                    <NumberInput
                        label="Stock"
                        placeholder="0"
                        required
                        mb="md"
                        min={0}
                        value={formData.stock}
                        onChange={(value) =>
                            setFormData({ ...formData, stock: Number(value) })
                        }
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

                    <Select
                        label="Status"
                        placeholder="Select status"
                        required
                        mb="xl"
                        data={[
                            { value: 'active', label: 'Active' },
                            { value: 'inactive', label: 'Inactive' },
                            { value: 'out-of-stock', label: 'Out of Stock' },
                        ]}
                        value={formData.status}
                        onChange={(value) =>
                            setFormData({
                                ...formData,
                                status: value as 'active' | 'inactive' | 'out-of-stock',
                            })
                        }
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
                        <Button variant="subtle" onClick={() => setModalOpened(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveProduct}
                            style={{
                                background: 'linear-gradient(135deg, #4988C4 0%, #667eea 100%)',
                            }}
                        >
                            {editingProduct ? 'Update Product' : 'Add Product'}
                        </Button>
                    </Group>
                </Box>
            </Modal>
        </Box>
    );
}