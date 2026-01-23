import React, { useEffect, useRef } from 'react';
import { View, ActivityIndicator, Text, StyleSheet, DimensionValue, Animated } from 'react-native';

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
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmerAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

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

    const opacity = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    return (
        <Animated.View
            style={[
                styles.skeleton,
                variantStyles[variant],
                getSize(),
                { opacity },
            ]}
        />
    );
}

export function CustomerCardSkeleton() {
    return (
        <View style={styles.customerCardSkeleton}>
            <View style={styles.cardSkeletonHeader}>
                <Skeleton width="60%" height={24} />
            </View>

            <View style={styles.cardSkeletonInfo}>
                <Skeleton width="70%" height={16} />
                <Skeleton width="80%" height={16} />
            </View>

            <View style={styles.cardSkeletonProgress}>
                <View style={styles.progressHeader}>
                    <Skeleton width={60} height={14} />
                    <Skeleton width={40} height={14} />
                </View>
                <Skeleton width="100%" height={8} variant="rectangular" />
            </View>

            <Skeleton width="100%" height={14} />

            <View style={styles.cardSkeletonActions}>
                <Skeleton width="100%" height={44} variant="rectangular" />
            </View>
        </View>
    );
}

export function AdminCardSkeleton() {
    return (
        <View style={styles.adminCardSkeleton}>
            <View style={styles.cardSkeletonHeader}>
                <Skeleton width="50%" height={24} />
            </View>

            <View style={styles.cardSkeletonInfo}>
                <Skeleton width="75%" height={16} />
                <Skeleton width="65%" height={16} />
            </View>
        </View>
    );
}

export function MetricCardSkeleton() {
    return (
        <View style={styles.metricCardSkeleton}>
            <View style={styles.metricHeader}>
                <Skeleton width="70%" height={14} />
            </View>
            <Skeleton width={80} height={40} />
        </View>
    );
}

export function DashboardSkeleton() {
    return (
        <View style={styles.dashboardSkeleton}>
            <View style={styles.metricsGrid}>
                <View style={styles.metricRow}>
                    <View style={styles.metricItem}>
                        <MetricCardSkeleton />
                    </View>
                    <View style={styles.metricItem}>
                        <MetricCardSkeleton />
                    </View>
                </View>
                <View style={styles.metricRow}>
                    <View style={styles.metricItem}>
                        <MetricCardSkeleton />
                    </View>
                    <View style={styles.metricItem}>
                        <MetricCardSkeleton />
                    </View>
                </View>
            </View>

            <View style={styles.loyaltyCardSkeleton}>
                <View style={styles.loyaltyContent}>
                    <Skeleton width={48} height={48} variant="rectangular" />
                    <View style={styles.loyaltyInfo}>
                        <Skeleton width="60%" height={20} />
                        <Skeleton width="90%" height={16} />
                        <Skeleton width={150} height={36} variant="rectangular" />
                    </View>
                </View>
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
    customerCardSkeleton: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e4e4e7',
        padding: 16,
        gap: 12,
    },
    adminCardSkeleton: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e4e4e7',
        padding: 16,
        gap: 12,
    },
    cardSkeletonHeader: {
        marginBottom: 4,
    },
    cardSkeletonInfo: {
        gap: 8,
    },
    cardSkeletonProgress: {
        gap: 8,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardSkeletonActions: {
        paddingTop: 8,
    },
    metricCardSkeleton: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e4e4e7',
        padding: 16,
    },
    metricHeader: {
        marginBottom: 12,
    },
    dashboardSkeleton: {
        padding: 16,
        gap: 16,
    },
    metricsGrid: {
        gap: 12,
    },
    metricRow: {
        flexDirection: 'row',
        gap: 12,
    },
    metricItem: {
        flex: 1,
    },
    loyaltyCardSkeleton: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e4e4e7',
        padding: 16,
        marginTop: 4,
    },
    loyaltyContent: {
        flexDirection: 'row',
        gap: 12,
    },
    loyaltyInfo: {
        flex: 1,
        gap: 8,
    },
});