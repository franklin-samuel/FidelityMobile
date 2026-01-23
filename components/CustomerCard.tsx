import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CustomerCardRootProps {
    children: React.ReactNode;
    isFreeReady?: boolean;
}

const CustomerCardRoot: React.FC<CustomerCardRootProps> = ({ children, isFreeReady = false }) => {
    return (
        <View style={[styles.root, isFreeReady && styles.rootFreeReady]}>
            {children}
        </View>
    );
};

interface CustomerCardHeaderProps {
    name: string;
    isFreeReady?: boolean;
}

const CustomerCardHeader: React.FC<CustomerCardHeaderProps> = ({ name, isFreeReady = false }) => {
    return (
        <View style={styles.header}>
            <Text style={styles.headerName} numberOfLines={1}>{name}</Text>
            {isFreeReady && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>Grátis!</Text>
                </View>
            )}
        </View>
    );
};

interface CustomerCardInfoProps {
    icon: React.ReactNode;
    children: React.ReactNode;
}

const CustomerCardInfo: React.FC<CustomerCardInfoProps> = ({ icon, children }) => {
    return (
        <View style={styles.info}>
            <View style={styles.infoIcon}>{icon}</View>
            <Text style={styles.infoText} numberOfLines={1}>{children}</Text>
        </View>
    );
};

interface CustomerCardProgressProps {
    current: number;
    total: number;
}

const CustomerCardProgress: React.FC<CustomerCardProgressProps> = ({ current, total }) => {
    const percentage = (current / total) * 100;
    const isFull = current >= total;

    return (
        <View style={styles.progress}>
            <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Progresso</Text>
                <Text style={styles.progressValue}>{current}/{total}</Text>
            </View>
            <View style={styles.progressBar}>
                <View
                    style={[
                        styles.progressFill,
                        { width: `${Math.min(percentage, 100)}%` },
                        isFull && styles.progressFillComplete,
                    ]}
                />
            </View>
        </View>
    );
};

interface CustomerCardClaimedProps {
    count: number;
}

const CustomerCardClaimed: React.FC<CustomerCardClaimedProps> = ({ count }) => {
    if (count === 0) {
        return (
            <Text style={styles.claimed}>Nenhum corte grátis resgatado</Text>
        );
    }

    return (
        <Text style={styles.claimed}>
            {count} corte{count !== 1 ? 's' : ''} grátis já resgatado{count !== 1 ? 's' : ''}
        </Text>
    );
};

interface CustomerCardActionsProps {
    children: React.ReactNode;
}

const CustomerCardActions: React.FC<CustomerCardActionsProps> = ({ children }) => {
    return <View style={styles.actions}>{children}</View>;
};

export const CustomerCard = {
    Root: CustomerCardRoot,
    Header: CustomerCardHeader,
    Info: CustomerCardInfo,
    Progress: CustomerCardProgress,
    Claimed: CustomerCardClaimed,
    Actions: CustomerCardActions,
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
    rootFreeReady: {
        borderColor: '#bbf7d0',
        backgroundColor: '#f0fdf4',
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
        backgroundColor: '#16a34a',
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
    progress: {
        gap: 8,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    progressLabel: {
        fontSize: 14,
        color: '#71717a',
    },
    progressValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#18181b',
    },
    progressBar: {
        height: 8,
        backgroundColor: '#e4e4e7',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#18181b',
        borderRadius: 4,
    },
    progressFillComplete: {
        backgroundColor: '#16a34a',
    },
    claimed: {
        fontSize: 14,
        color: '#71717a',
    },
    actions: {
        gap: 12,
        paddingTop: 8,
    },
});