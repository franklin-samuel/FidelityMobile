import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MetricCardRootProps {
    children: React.ReactNode;
    variant?: 'default' | 'highlight';
}

const MetricCardRoot: React.FC<MetricCardRootProps> = ({ children, variant = 'default' }) => {
    return (
        <View style={[styles.root, variant === 'highlight' && styles.rootHighlight]}>
            {children}
        </View>
    );
};

interface MetricCardHeaderProps {
    icon: React.ReactNode;
    iconColor?: string;
    title: string;
}

const MetricCardHeader: React.FC<MetricCardHeaderProps> = ({ icon, title }) => {
    return (
        <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.icon}>{icon}</View>
        </View>
    );
};

interface MetricCardValueProps {
    children: React.ReactNode;
    variant?: 'default' | 'highlight';
}

const MetricCardValue: React.FC<MetricCardValueProps> = ({ children, variant = 'default' }) => {
    return (
        <Text style={[styles.value, variant === 'highlight' && styles.valueHighlight]}>
            {children}
        </Text>
    );
};

export const MetricCard = {
    Root: MetricCardRoot,
    Header: MetricCardHeader,
    Value: MetricCardValue,
};

const styles = StyleSheet.create({
    root: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e4e4e7',
        padding: 16,
    },
    rootHighlight: {
        borderColor: '#fde68a',
        backgroundColor: '#fffbeb',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    title: {
        fontSize: 14,
        fontWeight: '500',
        color: '#71717a',
    },
    icon: {
        width: 20,
        height: 20,
    },
    value: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#18181b',
    },
    valueHighlight: {
        color: '#f59e0b',
    },
});