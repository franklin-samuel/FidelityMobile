import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, DimensionValue } from 'react-native';

interface LoadingProps {
    size?: 'small' | 'large';
    text?: string;
    fullScreen?: boolean;
    color?: string;
}

export function Loading({
                            size = 'large',
                            text,
                            fullScreen = false,
                            color = '#f59e0b',
                        }: LoadingProps) {
    const content = (
        <View style={styles.container}>
            <ActivityIndicator size={size} color={color} />
            {text && <Text style={styles.text}>{text}</Text>}
        </View>
    );

    if (fullScreen) {
        return <View style={styles.fullScreen}>{content}</View>;
    }

    return content;
}

interface SkeletonProps {
    width?: DimensionValue;
    height?: DimensionValue;
    variant?: 'text' | 'circular' | 'rectangular';
    size?: number;
}

export function Skeleton({
                             width = '100%',
                             height = 16,
                             variant = 'text',
                             size,
                         }: SkeletonProps) {

    const getSize = () => {
        if (variant === 'circular') {
            const s = size || 48;
            return { width: s, height: s };
        }
        return { width, height };
    };

    const variantStyles = {
        text: styles.skeletonText,
        circular: styles.skeletonCircular,
        rectangular: styles.skeletonRectangular,
    };

    return (
        <View
            style={[
                styles.skeleton,
                variantStyles[variant],
                getSize(),
            ]}
        />
    );
}

export function CardSkeleton() {
    return (
        <View style={styles.cardSkeleton}>
            <View style={styles.cardSkeletonHeader}>
                <View style={{ flex: 1 }}>
                    <Skeleton width="60%" height={24} />
                    <View style={{ marginTop: 8 }}>
                        <Skeleton width="40%" height={16} />
                    </View>
                </View>
                <Skeleton width={48} height={48} variant="circular" />
            </View>
            <View style={styles.cardSkeletonBody}>
                <Skeleton width="100%" height={8} />
                <Skeleton width="80%" height={8} />
            </View>
            <View style={styles.cardSkeletonFooter}>
                <Skeleton width="100%" height={40} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: 20,
    },
    fullScreen: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 14,
        color: '#71717a',
        marginTop: 8,
    },
    skeleton: {
        backgroundColor: '#e4e4e7',
        overflow: 'hidden',
    },
    skeletonText: {
        borderRadius: 4,
    },
    skeletonCircular: {
        borderRadius: 9999,
    },
    skeletonRectangular: {
        borderRadius: 8,
    },
    cardSkeleton: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e4e4e7',
        padding: 16,
        gap: 12,
    },
    cardSkeletonHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    cardSkeletonBody: {
        gap: 8,
    },
    cardSkeletonFooter: {
        paddingTop: 8,
    },
});