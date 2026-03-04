import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TrendingUp, Package, Scissors, Shield, Settings } from 'lucide-react-native';
import { usePermissions } from '../../../hooks/usePermissions';

interface MenuItem {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    route: string;
    color: string;
    bgColor: string;
}

export default function MorePage() {
    const router = useRouter();
    const { hasPermission, isAdmin } = usePermissions();

    useEffect(() => {
        if (!isAdmin) {
            router.replace('/(tabs)');
        }
    }, [isAdmin, router]);

    const menuItems: MenuItem[] = [
        {
            id: 'analytics',
            title: 'Analytics',
            description: 'Relatórios e análises detalhadas',
            icon: <TrendingUp size={24} color="#3b82f6" />,
            route: '/(tabs)/analytics',
            color: '#3b82f6',
            bgColor: '#dbeafe',
        },
        {
            id: 'catalog',
            title: 'Catálogo',
            description: 'Gerenciar serviços e produtos',
            icon: <Package size={24} color="#8b5cf6" />,
            route: '/(tabs)/catalog',
            color: '#8b5cf6',
            bgColor: '#ede9fe',
        },
        {
            id: 'barbers',
            title: 'Barbeiros',
            description: 'Gerenciar equipe de barbeiros',
            icon: <Scissors size={24} color="#f59e0b" />,
            route: '/(tabs)/barbers',
            color: '#f59e0b',
            bgColor: '#fef3c7',
        },
        {
            id: 'admins',
            title: 'Administradores',
            description: 'Gerenciar administradores',
            icon: <Shield size={24} color="#ef4444" />,
            route: '/(tabs)/admins',
            color: '#ef4444',
            bgColor: '#fee2e2',
        },
        {
            id: 'settings',
            title: 'Configurações',
            description: 'Configurações do sistema',
            icon: <Settings size={24} color="#71717a" />,
            route: '/settings',
            color: '#71717a',
            bgColor: '#f4f4f5',
        },
    ];

    const handleNavigate = (route: string) => {
        router.push(route as any);
    };

    if (!isAdmin) {
        return null;
    }

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Administração</Text>
                    <Text style={styles.headerDescription}>
                        Gerencie todos os aspectos da sua barbearia
                    </Text>
                </View>

                {/* Menu Items */}
                <View style={styles.menuList}>
                    {menuItems.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.menuItem}
                            onPress={() => handleNavigate(item.route)}
                            activeOpacity={0.7}
                        >
                            <View
                                style={[
                                    styles.menuIcon,
                                    { backgroundColor: item.bgColor },
                                ]}
                            >
                                {item.icon}
                            </View>

                            <View style={styles.menuContent}>
                                <Text style={styles.menuTitle}>{item.title}</Text>
                                <Text style={styles.menuDescription}>
                                    {item.description}
                                </Text>
                            </View>

                            <Ionicons
                                name="chevron-forward"
                                size={20}
                                color="#a1a1aa"
                            />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Quick Stats */}
                <View style={styles.quickStats}>
                    <Text style={styles.quickStatsTitle}>Acesso Rápido</Text>

                    <View style={styles.statsGrid}>
                        <TouchableOpacity
                            style={styles.statCard}
                            onPress={() => router.push('/(tabs)/appointments')}
                        >
                            <Ionicons name="receipt-outline" size={24} color="#f59e0b" />
                            <Text style={styles.statLabel}>Atendimentos</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.statCard}
                            onPress={() => router.push('/(tabs)/clients')}
                        >
                            <Ionicons name="people-outline" size={24} color="#3b82f6" />
                            <Text style={styles.statLabel}>Clientes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 16,
        gap: 24,
        paddingBottom: 40,
    },
    header: {
        gap: 4,
        paddingVertical: 8,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#18181b',
    },
    headerDescription: {
        fontSize: 15,
        color: '#71717a',
    },
    menuList: {
        gap: 12,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        gap: 12,
        borderWidth: 1,
        borderColor: '#e4e4e7',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    menuIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuContent: {
        flex: 1,
        gap: 2,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#18181b',
    },
    menuDescription: {
        fontSize: 13,
        color: '#71717a',
    },
    quickStats: {
        gap: 12,
        marginTop: 8,
    },
    quickStatsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#18181b',
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: '#e4e4e7',
    },
    statLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#71717a',
    },
});