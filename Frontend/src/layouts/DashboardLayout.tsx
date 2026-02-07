import { AppShell, Burger, Group, Text, Avatar, Menu, UnstyledButton, rem, Box, ActionIcon } from '@mantine/core';

import {
    IconLogout,
    IconSettings,
    IconUser,
    IconDashboard,
    IconUsers,
    IconPackage,
    IconShoppingCart,
    IconChevronRight,
    IconBell,
    IconMoon,
    IconSun
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../auth/AuthContexts';

const navLinks = [
    { icon: IconDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: IconUsers, label: 'Users', path: '/users' },
    { icon: IconPackage, label: 'Products', path: '/products' },
    { icon: IconShoppingCart, label: 'Orders', path: '/orders' },
    { icon: IconSettings, label: 'Settings', path: '/settings' },
];

export function DashboardLayout() {
    const { logout, user, roles } = useAuth(); // ✅ Using useAuth hook
    const [opened, { toggle }] = useDisclosure(); // ✅ Added this (was missing)
    const [darkMode, setDarkMode] = useState(true); // ✅ Added this (was missing)
    const location = useLocation(); // ✅ Added this (was missing)

    const handleLogout = async () => {
        await logout(); // ✅ Using logout from useAuth
    };

    return (
        <AppShell
            header={{ height: 70 }}
            navbar={{
                width: 280,
                breakpoint: 'sm',
                collapsed: { mobile: !opened },
            }}
            padding="md"
            style={{
                background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
            }}
        >
            <AppShell.Header
                style={{
                    background: 'rgba(20, 20, 35, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: 'none',
                    borderBottom: '1px solid rgba(73, 136, 196, 0.2)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                }}
            >
                <Group h="100%" px="md" justify="space-between">
                    <Group>
                        <Burger
                            opened={opened}
                            onClick={toggle}
                            hiddenFrom="sm"
                            size="sm"
                            color="white"
                        />
                        <Group gap="xs">
                            <Box
                                style={{
                                    width: rem(40),
                                    height: rem(40),
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #4988C4 0%, #667eea 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 0 20px rgba(73, 136, 196, 0.5)',
                                }}
                            >
                                <IconDashboard size={22} color="white" stroke={2.5} />
                            </Box>
                            <Text
                                fw={900}
                                size="xl"
                                style={{
                                    background: 'linear-gradient(135deg, #4988C4 0%, #667eea 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    letterSpacing: '1px',
                                }}
                            >
                                MANTIX
                            </Text>
                        </Group>
                    </Group>

                    <Group>
                        <ActionIcon
                            variant="subtle"
                            size="lg"
                            onClick={() => setDarkMode(!darkMode)}
                            style={{
                                color: 'rgba(255, 255, 255, 0.7)',
                            }}
                        >
                            {darkMode ? <IconSun size={20} /> : <IconMoon size={20} />}
                        </ActionIcon>

                        <ActionIcon
                            variant="subtle"
                            size="lg"
                            style={{
                                color: 'rgba(255, 255, 255, 0.7)',
                            }}
                        >
                            <IconBell size={20} />
                        </ActionIcon>

                        <Menu shadow="md" width={200}>
                            <Menu.Target>
                                <UnstyledButton
                                    style={{
                                        padding: `${rem(8)} ${rem(12)}`,
                                        borderRadius: rem(8),
                                        transition: 'all 0.3s ease',
                                        border: '1px solid rgba(73, 136, 196, 0.2)',
                                        background: 'rgba(73, 136, 196, 0.1)',
                                    }}
                                >
                                    <Group gap="xs">
                                        <Avatar
                                            size={32}
                                            radius="xl"
                                            style={{
                                                background: 'linear-gradient(135deg, #4988C4 0%, #667eea 100%)',
                                            }}
                                        >
                                            {/* ✅ Fixed: Using user from useAuth */}
                                            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                                        </Avatar>
                                        <Box style={{ flex: 1 }}>
                                            <Text size="sm" fw={600} c="white">
                                                {/* ✅ Fixed: Using user from useAuth */}
                                                {user?.firstName} {user?.lastName}
                                            </Text>
                                            <Text size="xs" c="dimmed">
                                                {/* ✅ Fixed: Using roles from useAuth */}
                                                {roles?.includes('admin') ? 'Administrator' : 'User'}
                                            </Text>
                                        </Box>
                                        <IconChevronRight size={16} color="rgba(255, 255, 255, 0.5)" />
                                    </Group>
                                </UnstyledButton>
                            </Menu.Target>

                            <Menu.Dropdown
                                style={{
                                    background: 'rgba(20, 20, 35, 0.95)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(73, 136, 196, 0.2)',
                                }}
                            >
                                <Menu.Item
                                    leftSection={<IconUser size={16} />}
                                    style={{ color: 'white' }}
                                >
                                    Profile
                                </Menu.Item>
                                <Menu.Item
                                    leftSection={<IconSettings size={16} />}
                                    style={{ color: 'white' }}
                                    component={Link}
                                    to="/settings"
                                >
                                    Settings
                                </Menu.Item>
                                <Menu.Divider style={{ borderColor: 'rgba(73, 136, 196, 0.2)' }} />
                                <Menu.Item
                                    leftSection={<IconLogout size={16} />}
                                    color="red"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    </Group>
                </Group>
            </AppShell.Header>

            <AppShell.Navbar
                p="md"
                style={{
                    background: 'rgba(20, 20, 35, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: 'none',
                    borderRight: '1px solid rgba(73, 136, 196, 0.2)',
                }}
            >
                <Box style={{ marginTop: rem(20) }}>
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.path;

                        return (
                            <UnstyledButton
                                key={link.path}
                                component={Link}
                                to={link.path}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    width: '100%',
                                    padding: `${rem(12)} ${rem(16)}`,
                                    marginBottom: rem(8),
                                    borderRadius: rem(8),
                                    background: isActive
                                        ? 'linear-gradient(135deg, rgba(73, 136, 196, 0.2) 0%, rgba(102, 126, 234, 0.2) 100%)'
                                        : 'transparent',
                                    border: isActive
                                        ? '1px solid rgba(73, 136, 196, 0.5)'
                                        : '1px solid transparent',
                                    color: isActive ? '#4988C4' : 'rgba(255, 255, 255, 0.7)',
                                    transition: 'all 0.3s ease',
                                    fontWeight: isActive ? 700 : 500,
                                    boxShadow: isActive ? '0 0 20px rgba(73, 136, 196, 0.3)' : 'none',
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'rgba(73, 136, 196, 0.1)';
                                        e.currentTarget.style.borderColor = 'rgba(73, 136, 196, 0.2)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.borderColor = 'transparent';
                                    }
                                }}
                            >
                                <Icon size={20} stroke={2} style={{ marginRight: rem(12) }} />
                                <Text size="sm" style={{ letterSpacing: '0.5px' }}>
                                    {link.label}
                                </Text>
                            </UnstyledButton>
                        );
                    })}
                </Box>
            </AppShell.Navbar>

            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}