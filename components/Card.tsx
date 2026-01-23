import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface CardRootProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

const CardRoot: React.FC<CardRootProps> = ({ children, style }) => {
    return <View style={[styles.root, style]}>{children}</View>;
};

interface CardHeaderProps {
    children: React.ReactNode;
}

const CardHeader: React.FC<CardHeaderProps> = ({ children }) => {
    return <View style={styles.header}>{children}</View>;
};

interface CardTitleProps {
    children: React.ReactNode;
}

const CardTitle: React.FC<CardTitleProps> = ({ children }) => {
    return <Text style={styles.title}>{children}</Text>;
};

interface CardDescriptionProps {
    children: React.ReactNode;
}

const CardDescription: React.FC<CardDescriptionProps> = ({ children }) => {
    return <Text style={styles.description}>{children}</Text>;
};

interface CardBodyProps {
    children: React.ReactNode;
}

const CardBody: React.FC<CardBodyProps> = ({ children }) => {
    return <View style={styles.body}>{children}</View>;
};

interface CardFooterProps {
    children: React.ReactNode;
}

const CardFooter: React.FC<CardFooterProps> = ({ children }) => {
    return <View style={styles.footer}>{children}</View>;
};

export const Card = {
    Root: CardRoot,
    Header: CardHeader,
    Title: CardTitle,
    Description: CardDescription,
    Body: CardBody,
    Footer: CardFooter,
};

const styles = StyleSheet.create({
    root: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e4e4e7',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e4e4e7',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#18181b',
    },
    description: {
        fontSize: 14,
        color: '#71717a',
        marginTop: 4,
    },
    body: {
        padding: 16,
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#e4e4e7',
    },
});