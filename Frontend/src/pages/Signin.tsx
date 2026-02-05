import {
    Anchor,
    Button,
    Checkbox,
    Container,
    Group,
    Paper,
    PasswordInput,
    Text,
    TextInput,
    Title,
    Box,
    rem,
    Progress,
} from '@mantine/core';
import { IconUserPlus, IconSparkles, IconShield, IconLock, IconCheck } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export function CreateAccount() {
    const [passwordStrength, setPasswordStrength] = useState(0);

    const calculatePasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength += 25;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
        if (/\d/.test(password)) strength += 25;
        if (/[^a-zA-Z0-9]/.test(password)) strength += 25;
        setPasswordStrength(strength);
    };

    const getPasswordColor = () => {
        if (passwordStrength <= 25) return '#ff6b6b';
        if (passwordStrength <= 50) return '#ffa94d';
        if (passwordStrength <= 75) return '#51cf66';
        return '#4988C4';
    };

    return (
        <Box
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Animated Background Elements */}
            <Box
                style={{
                    position: 'absolute',
                    top: '10%',
                    left: '10%',
                    width: rem(300),
                    height: rem(300),
                    background: 'radial-gradient(circle, rgba(73, 136, 196, 0.15) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(40px)',
                }}
            />
            <Box
                style={{
                    position: 'absolute',
                    bottom: '10%',
                    right: '10%',
                    width: rem(400),
                    height: rem(400),
                    background: 'radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                }}
            />

            <Container size={550} style={{ position: 'relative', zIndex: 1 }}>
                {/* Logo/Icon Section */}
                <Box ta="center" mb={35}>
                    <Box
                        style={{
                            width: rem(90),
                            height: rem(90),
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #4988C4 0%, #667eea 100%)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: rem(20),
                            boxShadow: '0 0 40px rgba(73, 136, 196, 0.6), 0 0 80px rgba(102, 126, 234, 0.3)',
                            border: '3px solid rgba(73, 136, 196, 0.3)',
                            position: 'relative',
                        }}
                    >
                        <IconSparkles size={45} color="white" stroke={2} />
                        {/* Glow effect */}
                        <Box
                            style={{
                                position: 'absolute',
                                inset: '-10px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #4988C4, #667eea)',
                                filter: 'blur(20px)',
                                opacity: 0.5,
                                zIndex: -1,
                            }}
                        />
                    </Box>

                    <Title
                        ta="center"
                        fw={900}
                        style={{
                            fontSize: rem(48),
                            background: 'linear-gradient(135deg, #4988C4 0%, #667eea 50%, #8b94ff 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            letterSpacing: '-1.5px',
                            marginBottom: rem(10),
                            textShadow: '0 0 30px rgba(73, 136, 196, 0.5)',
                        }}
                    >
                        JOIN MANTIX
                    </Title>

                    <Text
                        size="md"
                        style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontWeight: 500,
                            letterSpacing: '0.5px',
                        }}
                    >
                        Create your account and start your journey
                    </Text>
                </Box>

                {/* Signup Card */}
                <Paper
                    shadow="xl"
                    p={40}
                    radius="xl"
                    style={{
                        background: 'rgba(20, 20, 35, 0.8)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(73, 136, 196, 0.2)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 1px rgba(73, 136, 196, 0.3) inset',
                    }}
                >
                    {/* Feature Pills */}
                    <Group justify="center" gap="xs" mb="xl">
                        <Box
                            style={{
                                padding: `${rem(8)} ${rem(16)}`,
                                background: 'linear-gradient(135deg, rgba(73, 136, 196, 0.2) 0%, rgba(73, 136, 196, 0.1) 100%)',
                                borderRadius: rem(20),
                                display: 'flex',
                                alignItems: 'center',
                                gap: rem(8),
                                border: '1px solid rgba(73, 136, 196, 0.3)',
                            }}
                        >
                            <IconShield size={16} color="#4988C4" />
                            <Text size="xs" c="#4988C4" fw={700}>SECURE</Text>
                        </Box>
                        <Box
                            style={{
                                padding: `${rem(8)} ${rem(16)}`,
                                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(102, 126, 234, 0.1) 100%)',
                                borderRadius: rem(20),
                                display: 'flex',
                                alignItems: 'center',
                                gap: rem(8),
                                border: '1px solid rgba(102, 126, 234, 0.3)',
                            }}
                        >
                            <IconLock size={16} color="#667eea" />
                            <Text size="xs" c="#667eea" fw={700}>ENCRYPTED</Text>
                        </Box>
                    </Group>

                    <Group grow gap="md" mb="md">
                        <TextInput
                            label="First Name"
                            placeholder="John"
                            required
                            radius="md"
                            size="md"
                            styles={{
                                label: {
                                    fontWeight: 700,
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    marginBottom: rem(10),
                                    fontSize: rem(13),
                                    letterSpacing: '0.5px',
                                    textTransform: 'uppercase',
                                },
                                input: {
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(73, 136, 196, 0.3)',
                                    color: 'white',
                                    transition: 'all 0.3s ease',
                                    '&::placeholder': {
                                        color: 'rgba(255, 255, 255, 0.4)',
                                    },
                                    '&:focus': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                        borderColor: '#4988C4',
                                        boxShadow: '0 0 0 3px rgba(73, 136, 196, 0.15), 0 0 20px rgba(73, 136, 196, 0.2)',
                                    },
                                },
                            }}
                        />

                        <TextInput
                            label="Last Name"
                            placeholder="Doe"
                            required
                            radius="md"
                            size="md"
                            styles={{
                                label: {
                                    fontWeight: 700,
                                    color: 'rgba(255, 255, 255, 0.9)',
                                    marginBottom: rem(10),
                                    fontSize: rem(13),
                                    letterSpacing: '0.5px',
                                    textTransform: 'uppercase',
                                },
                                input: {
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(73, 136, 196, 0.3)',
                                    color: 'white',
                                    transition: 'all 0.3s ease',
                                    '&::placeholder': {
                                        color: 'rgba(255, 255, 255, 0.4)',
                                    },
                                    '&:focus': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                        borderColor: '#4988C4',
                                        boxShadow: '0 0 0 3px rgba(73, 136, 196, 0.15), 0 0 20px rgba(73, 136, 196, 0.2)',
                                    },
                                },
                            }}
                        />
                    </Group>

                    <TextInput
                        label="Email Address"
                        placeholder="you@example.com"
                        required
                        radius="md"
                        size="md"
                        styles={{
                            label: {
                                fontWeight: 700,
                                color: 'rgba(255, 255, 255, 0.9)',
                                marginBottom: rem(10),
                                fontSize: rem(13),
                                letterSpacing: '0.5px',
                                textTransform: 'uppercase',
                            },
                            input: {
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(73, 136, 196, 0.3)',
                                color: 'white',
                                transition: 'all 0.3s ease',
                                '&::placeholder': {
                                    color: 'rgba(255, 255, 255, 0.4)',
                                },
                                '&:focus': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                    borderColor: '#4988C4',
                                    boxShadow: '0 0 0 3px rgba(73, 136, 196, 0.15), 0 0 20px rgba(73, 136, 196, 0.2)',
                                },
                            },
                        }}
                    />

                    <PasswordInput
                        label="Password"
                        placeholder="Create a strong password"
                        required
                        mt="md"
                        radius="md"
                        size="md"
                        onChange={(e) => calculatePasswordStrength(e.target.value)}
                        styles={{
                            label: {
                                fontWeight: 700,
                                color: 'rgba(255, 255, 255, 0.9)',
                                marginBottom: rem(10),
                                fontSize: rem(13),
                                letterSpacing: '0.5px',
                                textTransform: 'uppercase',
                            },
                            input: {
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(73, 136, 196, 0.3)',
                                color: 'white',
                                transition: 'all 0.3s ease',
                                '&::placeholder': {
                                    color: 'rgba(255, 255, 255, 0.4)',
                                },
                                '&:focus': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                    borderColor: '#4988C4',
                                    boxShadow: '0 0 0 3px rgba(73, 136, 196, 0.15), 0 0 20px rgba(73, 136, 196, 0.2)',
                                },
                            },
                            innerInput: {
                                color: 'white',
                            },
                        }}
                    />

                    {/* Password Strength Indicator */}
                    <Box mt="xs">
                        <Progress
                            value={passwordStrength}
                            color={getPasswordColor()}
                            size="sm"
                            radius="xl"
                            style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            }}
                        />
                        <Text
                            size="xs"
                            mt={5}
                            style={{
                                color: getPasswordColor(),
                                fontWeight: 600,
                                letterSpacing: '0.5px',
                            }}
                        >
                            {passwordStrength === 0 && ''}
                            {passwordStrength > 0 && passwordStrength <= 25 && 'WEAK'}
                            {passwordStrength > 25 && passwordStrength <= 50 && 'FAIR'}
                            {passwordStrength > 50 && passwordStrength <= 75 && 'GOOD'}
                            {passwordStrength > 75 && 'STRONG'}
                        </Text>
                    </Box>

                    <PasswordInput
                        label="Confirm Password"
                        placeholder="Re-enter your password"
                        required
                        mt="md"
                        radius="md"
                        size="md"
                        styles={{
                            label: {
                                fontWeight: 700,
                                color: 'rgba(255, 255, 255, 0.9)',
                                marginBottom: rem(10),
                                fontSize: rem(13),
                                letterSpacing: '0.5px',
                                textTransform: 'uppercase',
                            },
                            input: {
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(73, 136, 196, 0.3)',
                                color: 'white',
                                transition: 'all 0.3s ease',
                                '&::placeholder': {
                                    color: 'rgba(255, 255, 255, 0.4)',
                                },
                                '&:focus': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                    borderColor: '#4988C4',
                                    boxShadow: '0 0 0 3px rgba(73, 136, 196, 0.15), 0 0 20px rgba(73, 136, 196, 0.2)',
                                },
                            },
                            innerInput: {
                                color: 'white',
                            },
                        }}
                    />

                    <Checkbox
                        mt="xl"
                        label={
                            <Text size="sm" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                I agree to the{' '}
                                <Anchor component="a" href="#" size="sm" style={{ color: '#4988C4' }}>
                                    Terms of Service
                                </Anchor>{' '}
                                and{' '}
                                <Anchor component="a" href="#" size="sm" style={{ color: '#4988C4' }}>
                                    Privacy Policy
                                </Anchor>
                            </Text>
                        }
                        styles={{
                            input: {
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(73, 136, 196, 0.3)',
                                '&:checked': {
                                    backgroundColor: '#4988C4',
                                    borderColor: '#4988C4',
                                },
                            },
                        }}
                    />

                    <Button
                        fullWidth
                        mt="xl"
                        radius="md"
                        size="lg"
                        rightSection={<IconUserPlus size={20} />}
                        style={{
                            background: 'linear-gradient(135deg, #4988C4 0%, #667eea 100%)',
                            fontWeight: 700,
                            fontSize: rem(15),
                            height: rem(52),
                            boxShadow: '0 0 30px rgba(73, 136, 196, 0.4)',
                            border: 'none',
                            transition: 'all 0.3s ease',
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                        }}
                        styles={{
                            root: {
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 0 40px rgba(73, 136, 196, 0.6), 0 5px 20px rgba(0, 0, 0, 0.3)',
                                },
                            },
                        }}
                    >
                        Create Account
                    </Button>

                    <Text
                        ta="center"
                        mt="xl"
                        size="sm"
                        style={{
                            color: 'rgba(255, 255, 255, 0.6)',
                        }}
                    >
                        Already have an account?{' '}
                        <Anchor
                            component={Link}
                            to="/login"
                            size="sm"
                            style={{
                                color: '#4988C4',
                                fontWeight: 700,
                                textDecoration: 'none',
                                transition: 'all 0.3s ease',
                            }}
                        >
                            Sign in
                        </Anchor>
                    </Text>
                </Paper>

                {/* Benefits Section */}
                <Box
                    mt="xl"
                    p="lg"
                    style={{
                        background: 'rgba(73, 136, 196, 0.1)',
                        border: '1px solid rgba(73, 136, 196, 0.2)',
                        borderRadius: rem(12),
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    <Group gap="md" justify="center">
                        <Box style={{ display: 'flex', alignItems: 'center', gap: rem(8) }}>
                            <IconCheck size={16} color="#4988C4" />
                            <Text size="xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                Free forever
                            </Text>
                        </Box>
                        <Box style={{ display: 'flex', alignItems: 'center', gap: rem(8) }}>
                            <IconCheck size={16} color="#4988C4" />
                            <Text size="xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                No credit card required
                            </Text>
                        </Box>
                        <Box style={{ display: 'flex', alignItems: 'center', gap: rem(8) }}>
                            <IconCheck size={16} color="#4988C4" />
                            <Text size="xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                24/7 support
                            </Text>
                        </Box>
                    </Group>
                </Box>

                {/* Footer Text */}
                <Text
                    ta="center"
                    mt="xl"
                    size="xs"
                    style={{
                        color: 'rgba(255, 255, 255, 0.4)',
                        letterSpacing: '1px',
                    }}
                >
                    © 2026 MANTIX • POWERED BY INNOVATION
                </Text>
            </Container>
        </Box>
    );
}