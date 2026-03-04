import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePermissions } from '../hooks/usePermissions';

type PermissionKey =
    | 'analytics'
    | 'catalog'
    | 'barbers'
    | 'admins'
    | 'settings'
    | 'dashboard'
    | 'appointments'
    | 'sales'
    | 'clients';

interface ProtectedRouteProps {
    children: React.ReactNode;
    permission: PermissionKey;
    redirectTo?: string;
}

export function ProtectedRoute({
                                   children,
                                   permission,
                                   redirectTo = '/(tabs)',
                               }: ProtectedRouteProps) {
    const router = useRouter();
    const { hasPermission, isAdmin } = usePermissions();

    useEffect(() => {
        if (!hasPermission(permission)) {
            router.replace(redirectTo as any);
        }
    }, [hasPermission, permission, redirectTo, router]);

    if (!hasPermission(permission)) {
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <View style={styles.iconContainer}>
                        <Ionicons name="lock-closed" size={64} color="#ef4444" />
                    </View>

                    <Text style={styles.title}>Acesso Negado</Text>
                    <Text style={styles.description}>
                        Você não tem permissão para acessar esta página.
                        {!isAdmin && ' Esta funcionalidade está disponível apenas para administradores.'}
                    </Text>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => router.replace('/(tabs)')}
                    >
                        <Ionicons name="arrow-back" size={20} color="#fff" />
                        <Text style={styles.buttonText}>Voltar ao Início</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return <>{children}</>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    content: {
        alignItems: 'center',
        gap: 20,
        maxWidth: 400,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#fee2e2',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#18181b',
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#71717a',
        textAlign: 'center',
        lineHeight: 24,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#18181b',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginTop: 12,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});