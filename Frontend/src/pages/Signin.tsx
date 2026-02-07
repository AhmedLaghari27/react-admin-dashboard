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
    Alert,
} from '@mantine/core';
import { IconSparkles, IconShield, IconLock, IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import keycloakService from '../services/keycloakService';

export function CreateAccount() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
    });
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (passwordStrength < 50) {
            setError('Password is too weak. Please use a stronger password.');
            return;
        }

        setLoading(true);

        try {
            await keycloakService.register({
                username: formData.username,
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                password: formData.password,
            });

            setSuccess(true);

            // Auto login after registration
            setTimeout(async () => {
                await keycloakService.login(formData.username, formData.password);
                navigate('/dashboard');
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
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
            {/* Background Elements */}
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

            <Container size={550} style={{ position: 'relative', zIndex: 1 }}>
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
                            boxShadow: '0 0 40px rgba(73, 136, 196, 0.6)',
                            border: '3px solid rgba(73, 136, 196, 0.3)',
                        }}
                    >
                        <IconSparkles size={45} color="white" stroke={2} />
                    </Box>

                    <Title
                        ta="center"
                        fw={900}
                        style={{
                            fontSize: rem(48),
                            background: 'linear-gradient(135deg, #4988C4 0%, #667eea 50%, #8b94ff 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            letterSpacing: '-1.5px',
                            marginBottom: rem(10),
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

                <Paper
                    shadow="xl"
                    p={40}
                    radius="xl"
                    style={{
                        background: 'rgba(20, 20, 35, 0.8)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(73, 136, 196, 0.2)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                    }}
                >
                    {error && (
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
                            {error}
                        </Alert>
                    )}

                    {success && (
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
                            Account created successfully! Redirecting to dashboard...
                        </Alert>
                    )}

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
                            <Text size="xs" c="#4988C4" fw={700}>
                                SECURE
                            </Text>
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
                            <Text size="xs" c="#667eea" fw={700}>
                                ENCRYPTED
                            </Text>
                        </Box>
                    </Group>

                    <form onSubmit={handleSubmit}>
                        <Group grow gap="md" mb="md">
                            <TextInput
                                label="First Name"
                                placeholder="John"
                                required
                                radius="md"
                                size="md"
                                value={formData.firstName}
                                onChange={(e) =>
                                    setFormData({ ...formData, firstName: e.target.value })
                                }
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
                                        '&::placeholder': {
                                            color: 'rgba(255, 255, 255, 0.4)',
                                        },
                                        '&:focus': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                            borderColor: '#4988C4',
                                            boxShadow: '0 0 0 3px rgba(73, 136, 196, 0.15)',
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
                                value={formData.lastName}
                                onChange={(e) =>
                                    setFormData({ ...formData, lastName: e.target.value })
                                }
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
                                        '&::placeholder': {
                                            color: 'rgba(255, 255, 255, 0.4)',
                                        },
                                        '&:focus': {
                                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                            borderColor: '#4988C4',
                                            boxShadow: '0 0 0 3px rgba(73, 136, 196, 0.15)',
                                        },
                                    },
                                }}
                            />
                        </Group>

                        <TextInput
                            label="Username"
                            placeholder="johndoe"
                            required
                            radius="md"
                            size="md"
                            value={formData.username}
                            onChange={(e) =>
                                setFormData({ ...formData, username: e.target.value })
                            }
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
                                    '&::placeholder': {
                                        color: 'rgba(255, 255, 255, 0.4)',
                                    },
                                    '&:focus': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                        borderColor: '#4988C4',
                                        boxShadow: '0 0 0 3px rgba(73, 136, 196, 0.15)',
                                    },
                                },
                            }}
                        />

                        <TextInput
                            label="Email Address"
                            placeholder="you@example.com"
                            required
                            mt="md"
                            radius="md"
                            size="md"
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                            }
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
                                    '&::placeholder': {
                                        color: 'rgba(255, 255, 255, 0.4)',
                                    },
                                    '&:focus': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                        borderColor: '#4988C4',
                                        boxShadow: '0 0 0 3px rgba(73, 136, 196, 0.15)',
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
                            value={formData.password}
                            onChange={(e) => {
                                setFormData({ ...formData, password: e.target.value });
                                calculatePasswordStrength(e.target.value);
                            }}
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
                                    '&::placeholder': {
                                        color: 'rgba(255, 255, 255, 0.4)',
                                    },
                                    '&:focus': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                        borderColor: '#4988C4',
                                        boxShadow: '0 0 0 3px rgba(73, 136, 196, 0.15)',
                                    },
                                },
                                innerInput: {
                                    color: 'white',
                                },
                            }}
                        />

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
                            value={formData.confirmPassword}
                            onChange={(e) =>
                                setFormData({ ...formData, confirmPassword: e.target.value })
                            }
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
                                    '&::placeholder': {
                                        color: 'rgba(255, 255, 255, 0.4)',
                                    },
                                    '&:focus': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                        borderColor: '#4988C4',
                                        boxShadow: '0 0 0 3px rgba(73, 136, 196, 0.15)',
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
                                    I agree to the Terms of Service and Privacy Policy
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
                            type="submit"
                            loading={loading}
                            disabled={success}
                            style={{
                                background: 'linear-gradient(135deg, #4988C4 0%, #667eea 100%)',
                                fontWeight: 700,
                                fontSize: rem(15),
                                height: rem(52),
                                letterSpacing: '1px',
                                textTransform: 'uppercase',
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
                                }}
                            >
                                Sign in
                            </Anchor>
                        </Text>
                    </form>
                </Paper>

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