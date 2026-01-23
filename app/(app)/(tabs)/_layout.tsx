import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { UserProfile } from '../../../components/UserProfile';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
    const insets = useSafeAreaInsets();

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
                            <Ionicons name="cut" size={20} color="#fff" />
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
                name="clients"
                options={{
                    title: 'Clientes',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="people" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="grid" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="admins"
                options={{
                    title: 'Admins',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="shield-checkmark" size={size} color={color} />
                    ),
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
    logoText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#18181b',
    },
    logoAccent: {
        color: '#f59e0b',
    },
});