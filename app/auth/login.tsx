import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const { login, isLoading } = useAuth();

    const handleSubmit = async () => {
        if (!email || !password) return;

        try {
            await login({
                username: email,
                password
            });
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {/* Logo */}
                <View style={styles.logoContainer}>
                    <View style={styles.logoWrapper}>
                        <View style={styles.logo}>
                            <Ionicons name="cut" size={40} color="#fff" />
                        </View>
                        <View style={styles.logoBadge} />
                    </View>
                    <Text style={styles.logoText}>
                        Na<Text style={styles.logoAccent}>Garagem</Text>
                    </Text>
                    <Text style={styles.logoSubtitle}>Sistema de Fidelidade</Text>
                </View>

                {/* Login Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Área Administrativa</Text>
                        <Text style={styles.cardDescription}>
                            Acesse o painel de controle da sua barbearia
                        </Text>
                    </View>

                    {/* Login Form */}
                    <View style={styles.form}>
                        <Input.Root>
                            <Input.Label>Email</Input.Label>
                            <Input.Container>
                                <Input.Icon>
                                    <Ionicons name="mail" size={20} color="#71717a" />
                                </Input.Icon>
                                <Input.Field
                                    placeholder="admin@barbearia.com"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    editable={!isLoading}
                                />
                            </Input.Container>
                        </Input.Root>

                        <Input.Root>
                            <Input.Label>Senha</Input.Label>
                            <Input.Container>
                                <Input.Icon>
                                    <Ionicons name="lock-closed" size={20} color="#71717a" />
                                </Input.Icon>
                                <Input.Field
                                    placeholder="••••••••"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!isPasswordVisible}
                                    editable={!isLoading}
                                />
                                <TouchableOpacity
                                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                                    style={styles.passwordToggle}
                                >
                                    <Ionicons
                                        name={isPasswordVisible ? 'eye-off' : 'eye'}
                                        size={20}
                                        color="#71717a"
                                    />
                                </TouchableOpacity>
                            </Input.Container>
                        </Input.Root>

                        <Button.Root
                            size="lg"
                            onPress={handleSubmit}
                            isLoading={isLoading}
                            disabled={isLoading || !email || !password}
                        >
                            <Button.Icon>
                                <Ionicons name="log-in" size={20} color="#fff" />
                            </Button.Icon>
                            <Button.Text>
                                {isLoading ? 'Entrando...' : 'Entrar'}
                            </Button.Text>
                        </Button.Root>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <View style={styles.footerIcon}>
                            <Ionicons name="shield-checkmark" size={16} color="#71717a" />
                        </View>
                        <Text style={styles.footerText}>Acesso seguro e protegido</Text>
                    </View>
                </View>

                {/* Version */}
                <Text style={styles.version}>
                    NaGaragem v1.0 • Sistema de Fidelidade
                </Text>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 16,
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logoWrapper: {
        position: 'relative',
        marginBottom: 16,
    },
    logo: {
        width: 64,
        height: 64,
        backgroundColor: '#18181b',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    logoBadge: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        width: 24,
        height: 24,
        backgroundColor: '#f59e0b',
        borderRadius: 12,
        borderWidth: 3,
        borderColor: '#fafafa',
    },
    logoText: {
        fontSize: 40,
        fontWeight: '700',
        color: '#18181b',
    },
    logoAccent: {
        color: '#f59e0b',
    },
    logoSubtitle: {
        fontSize: 16,
        color: '#71717a',
        marginTop: 4,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e4e4e7',
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 24,
        elevation: 8,
    },
    cardHeader: {
        marginBottom: 24,
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#18181b',
        marginBottom: 4,
    },
    cardDescription: {
        fontSize: 14,
        color: '#71717a',
    },
    form: {
        gap: 16,
    },
    passwordToggle: {
        position: 'absolute',
        right: 12,
        top: '50%',
        marginTop: -10,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 24,
        paddingTop: 24,
        borderTopWidth: 1,
        borderTopColor: '#e4e4e7',
    },
    footerIcon: {
        width: 16,
        height: 16,
    },
    footerText: {
        fontSize: 14,
        color: '#71717a',
    },
    version: {
        fontSize: 12,
        color: '#a1a1aa',
        textAlign: 'center',
        marginTop: 24,
    },
});