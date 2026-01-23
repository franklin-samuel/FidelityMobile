import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { UserProfile } from '../../../components/UserProfile';
import { View, Text, StyleSheet } from 'react-native';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#f59e0b',
                tabBarInactiveTintColor: '#71717a',
                tabBarStyle: {
                    backgroundColor: '#fff',
                    borderTopWidth: 1,
                    borderTopColor: '#e4e4e7',
                    height: 60,
                    paddingBottom: 8,
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
            }}
        >
            <Tabs.Screen
                name="clients"
                options={{
                    title: 'Clientes',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="people" size={size} color={color} />
                    ),
                    headerRight: () => (
                        <View style={styles.headerRight}>
                            <UserProfile />
                        </View>
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
            />
            <Tabs.Screen
                name="admins"
                options={{
                    title: 'Admins',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="shield-checkmark" size={size} color={color} />
                    ),
                    headerRight: () => (
                        <View style={styles.headerRight}>
                            <UserProfile />
                        </View>
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