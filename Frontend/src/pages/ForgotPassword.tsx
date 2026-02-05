import { IconArrowLeft, IconMail, IconShield, IconLock } from '@tabler/icons-react';
import {
    Anchor,
    Box,
    Button,
    Center,
    Container,
    Group,
    Paper,
    Text,
    TextInput,
    Title,
    rem,
} from '@mantine/core';
import { Link } from 'react-router-dom';

export function ForgotPassword() {
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
                    top: '15%',
                    right: '15%',
                    width: rem(350),
                    height: rem(350),
                    background: 'radial-gradient(circle, rgba(73, 136, 196, 0.15) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(50px)',
                }}
            />
            <Box
                style={{
                    position: 'absolute',
                    bottom: '15%',
                    left: '15%',
                    width: rem(450),
                    height: rem(450),
                    background: 'radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(70px)',
                }}
            />

            <Container size={520} style={{ position: 'relative', zIndex: 1 }}>
                {/* Logo/Icon Section */}
                <Box ta="center" mb={40}>
                    <Box
                        style={{
                            width: rem(100),
                            height: rem(100),
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #4988C4 0%, #667eea 100%)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: rem(24),
                            boxShadow: '0 0 40px rgba(73, 136, 196, 0.6), 0 0 80px rgba(102, 126, 234, 0.3)',
                            border: '3px solid rgba(73, 136, 196, 0.3)',
                            position: 'relative',
                        }}
                    >
                        <IconMail size={50} color="white" stroke={2} />
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
                            marginBottom: rem(12),
                            textShadow: '0 0 30px rgba(73, 136, 196, 0.5)',
                        }}
                    >
                        FORGOT PASSWORD
                    </Title>

                    <Text
                        size="md"
                        style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontWeight: 500,
                            letterSpacing: '0.5px',
                        }}
                    >
                        No worries, we'll send you reset instructions
                    </Text>
                </Box>

                {/* Reset Card */}
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
                            <Text size="xs" c="#4988C4" fw={700}>SECURE RESET</Text>
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

                    <Button
                        fullWidth
                        mt="xl"
                        radius="md"
                        size="lg"
                        rightSection={<IconMail size={20} />}
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
                        Send Reset Link
                    </Button>

                    <Center mt="xl">
                        <Anchor
                            c="#4988C4"
                            component={Link}
                            to="/login"
                            style={{
                                fontWeight: 600,
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: rem(8),
                                transition: 'all 0.3s ease',
                                fontSize: rem(14),
                            }}
                        >
                            <IconArrowLeft size={18} stroke={2} />
                            <Text span style={{ letterSpacing: '0.5px' }}>BACK TO LOGIN</Text>
                        </Anchor>
                    </Center>
                </Paper>

                {/* Additional Help Text */}
                <Box
                    mt="xl"
                    p="md"
                    style={{
                        background: 'rgba(73, 136, 196, 0.1)',
                        border: '1px solid rgba(73, 136, 196, 0.2)',
                        borderRadius: rem(12),
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    <Text
                        ta="center"
                        size="sm"
                        style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            lineHeight: 1.6,
                        }}
                    >
                        💡 Check your spam folder if you don't receive the email within a few minutes
                    </Text>
                </Box>

                {/* Footer Text */}
                <Text
                    ta="center"
                    mt="xl"
                    size="sm"
                    style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                    }}
                >
                    Remember your password?{' '}
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
                        Sign in here
                    </Anchor>
                </Text>

                {/* Copyright */}
                <Text
                    ta="center"
                    mt="lg"
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