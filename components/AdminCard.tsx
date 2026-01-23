import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AdminCardRootProps {
    children: React.ReactNode;
    isCurrentUser?: boolean;
}

const AdminCardRoot: React.FC<AdminCardRootProps> = ({ children, isCurrentUser = false }) => {
    return (
        <View style={[styles.root, isCurrentUser && styles.rootCurrentUser]}>
            {children}
        </View>
    );
};

interface AdminCardHeaderProps {
    name: string;
    isCurrentUser?: boolean;
}

const AdminCardHeader: React.FC<AdminCardHeaderProps> = ({ name, isCurrentUser = false }) => {
    return (
        <View style={styles.header}>
            <Text style={styles.headerName} numberOfLines={1}>{name}</Text>
            {isCurrentUser && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>Você</Text>
                </View>
            )}
        </View>
    );
};

interface AdminCardInfoProps {
    icon: React.ReactNode;
    children: React.ReactNode;
}

const AdminCardInfo: React.FC<AdminCardInfoProps> = ({ icon, children }) => {
    return (
        <View style={styles.info}>
            <View style={styles.infoIcon}>{icon}</View>
            <Text style={styles.infoText} numberOfLines={1}>{children}</Text>
        </View>
    );
};

export const AdminCard = {
    Root: AdminCardRoot,
    Header: AdminCardHeader,
    Info: AdminCardInfo,
};

const styles = StyleSheet.create({
    root: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e4e4e7',
        padding: 16,
        gap: 12,
    },
    rootCurrentUser: {
        borderColor: '#fde68a',
        backgroundColor: '#fffbeb',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 8,
    },
    headerName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#18181b',
        flex: 1,
    },
    badge: {
        backgroundColor: '#f59e0b',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },
    info: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    infoIcon: {
        width: 16,
        height: 16,
    },
    infoText: {
        fontSize: 14,
        color: '#71717a',
        flex: 1,
    },
});