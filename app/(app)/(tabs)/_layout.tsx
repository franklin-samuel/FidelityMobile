import { Tabs } from 'expo-router';
import { House, ShoppingCart, Users, Menu } from 'lucide-react-native';
import { UserProfile } from '../../../components/UserProfile';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePermissions } from '../../../hooks/usePermissions';

export default function TabLayout() {
    const insets = useSafeAreaInsets();
    const { isAdmin } = usePermissions();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#f59e0b',
                tabBarInactiveTintColor: '#71717a',
                tabBarStyle: {
                    backgroundColor: '#fff',
                    borderTopWidth: 1,
                    borderTopColor: '#e4e4e7',
                    height: 60 + insets.bottom,
                    paddingBottom: insets.bottom + 8,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
                headerStyle: {
                    backgroundColor: '#fff',
                    borderBottomWidth: 1,
                    borderBottomColor: '#e4e4e7',
                },
                headerTitleStyle: {
                    fontSize: 18,
                    fontWeight: '700',
                    color: '#18181b',
                },
                headerShadowVisible: false,
                headerTitle: () => (
                    <View style={styles.headerTitle}>
                        <View style={styles.logo}>
                            <Text style={styles.logoIcon}>✂️</Text>
                        </View>
                        <Text style={styles.logoText}>
                            Na<Text style={styles.logoAccent}>Garagem</Text>
                        </Text>
                    </View>
                ),
                headerRight: () => (
                    <View style={styles.headerRight}>
                        <UserProfile />
                    </View>
                ),
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color, size }) => (
                        <House size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="sales"
                options={{
                    title: 'Vendas',
                    tabBarIcon: ({ color, size }) => (
                        <ShoppingCart size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="clients"
                options={{
                    title: 'Clientes',
                    tabBarIcon: ({ color, size }) => (
                        <Users size={size} color={color} />
                    ),
                }}
            />

            {isAdmin && (
                <Tabs.Screen
                    name="more"
                    options={{
                        title: 'Mais',
                        tabBarIcon: ({ color, size }) => (
                            <Menu size={size} color={color} />
                        ),
                    }}
                />
            )}

            <Tabs.Screen
                name="appointments"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="analytics"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="catalog"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="barbers"
                options={{
                    href: null,
                }}
            />
            <Tabs.Screen
                name="admins"
                options={{
                    href: null,
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    headerRight: {
        marginRight: 16,
    },
    headerTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    logo: {
        width: 32,
        height: 32,
        backgroundColor: '#f59e0b',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoIcon: {
        fontSize: 18,
    },
    logoText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#18181b',
    },
    logoAccent: {
        color: '#f59e0b',
    },
});