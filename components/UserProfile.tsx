import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Animated,
    TouchableWithoutFeedback,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export function UserProfile() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const scaleAnim = useRef(new Animated.Value(0)).current;

    const getInitials = (name: string): string => {
        const names = name.trim().split(' ');
        if (names.length === 1) {
            return names[0].substring(0, 2).toUpperCase();
        }
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    };

    const openMenu = () => {
        setIsMenuOpen(true);
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 50,
            friction: 7,
        }).start();
    };

    const closeMenu = () => {
        Animated.timing(scaleAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            setIsMenuOpen(false);
        });
    };

    const handleSettings = () => {
        closeMenu();
        router.push('/settings');
    };

    const handleLogout = () => {
        closeMenu();
        logout();
    };

    if (!user) return null;

    return (
        <>
            <TouchableOpacity onPress={openMenu} style={styles.avatar}>
                <Text style={styles.avatarText}>{getInitials(user.name)}</Text>
            </TouchableOpacity>

            <Modal
                visible={isMenuOpen}
                transparent
                animationType="none"
                onRequestClose={closeMenu}
            >
                <TouchableWithoutFeedback onPress={closeMenu}>
                    <View style={styles.overlay}>
                        <Animated.View
                            style={[
                                styles.menu,
                                {
                                    transform: [
                                        { scale: scaleAnim },
                                        {
                                            translateY: scaleAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [-20, 0],
                                            }),
                                        },
                                    ],
                                    opacity: scaleAnim,
                                },
                            ]}
                        >
                            {/* User Info */}
                            <View style={styles.userInfo}>
                                <View style={styles.avatarLarge}>
                                    <Text style={styles.avatarLargeText}>{getInitials(user.name)}</Text>
                                </View>
                                <View style={styles.userDetails}>
                                    <Text style={styles.userName} numberOfLines={1}>
                                        {user.name}
                                    </Text>
                                    <Text style={styles.userEmail} numberOfLines={1}>
                                        {user.email}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.divider} />

                            {/* Menu Items */}
                            <TouchableOpacity style={styles.menuItem} onPress={handleSettings}>
                                <Ionicons name="settings-outline" size={20} color="#18181b" />
                                <Text style={styles.menuItemText}>Configurações</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                                <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                                <Text style={[styles.menuItemText, styles.menuItemLogout]}>Sair</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f59e0b',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        paddingTop: 60,
        paddingRight: 16,
    },
    menu: {
        backgroundColor: '#fff',
        borderRadius: 12,
        width: width * 0.8,
        maxWidth: 320,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
    },
    avatarLarge: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#f59e0b',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarLargeText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#fff',
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#18181b',
        marginBottom: 2,
    },
    userEmail: {
        fontSize: 14,
        color: '#71717a',
    },
    divider: {
        height: 1,
        backgroundColor: '#e4e4e7',
        marginHorizontal: 16,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
    },
    menuItemText: {
        fontSize: 16,
        color: '#18181b',
        fontWeight: '500',
    },
    menuItemLogout: {
        color: '#ef4444',
    },
});