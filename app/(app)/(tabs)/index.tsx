import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDashboardMetrics } from '../../../hooks/useDashboard';
import { useSettings } from '../../../hooks/useSettings';
import { Loading } from '../../../components/Loading';
import { MetricCard } from '../../../components/MetricCard';
import { Card } from '../../../components/Card';

export default function DashboardPage() {
    const router = useRouter();
    const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics();
    const { data: settings, isLoading: settingsLoading } = useSettings();

    if (metricsLoading || settingsLoading) {
        return <Loading fullScreen text="Carregando dashboard..." />;
    }

    const haircutsForFree = settings?.haircuts_for_free || 10;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Metrics Grid */}
            <View style={styles.metricsGrid}>
                <View style={styles.metricRow}>
                    <View style={styles.metricItem}>
                        <MetricCard.Root>
                            <MetricCard.Header
                                title="Total de Clientes"
                                icon={
                                    <Ionicons name="people" size={20} color="#71717a" />
                                }
                            />
                            <MetricCard.Value>
                                {metrics?.total_customers || 0}
                            </MetricCard.Value>
                        </MetricCard.Root>
                    </View>

                    <View style={styles.metricItem}>
                        <MetricCard.Root>
                            <MetricCard.Header
                                title="Cortes Realizados"
                                icon={
                                    <Ionicons name="cut" size={20} color="#71717a" />
                                }
                            />
                            <MetricCard.Value>
                                {metrics?.total_haircuts || 0}
                            </MetricCard.Value>
                        </MetricCard.Root>
                    </View>
                </View>

                <View style={styles.metricRow}>
                    <View style={styles.metricItem}>
                        <MetricCard.Root>
                            <MetricCard.Header
                                title="Cortes Grátis Dados"
                                icon={
                                    <Ionicons name="gift" size={20} color="#71717a" />
                                }
                            />
                            <MetricCard.Value>
                                {metrics?.free_haircuts_given || 0}
                            </MetricCard.Value>
                        </MetricCard.Root>
                    </View>

                    <View style={styles.metricItem}>
                        <MetricCard.Root variant="highlight">
                            <MetricCard.Header
                                title="Prontos para Grátis"
                                icon={
                                    <Ionicons name="checkmark-circle" size={20} color="#f59e0b" />
                                }
                            />
                            <MetricCard.Value variant="highlight">
                                {metrics?.customers_ready_for_free_haircut || 0}
                            </MetricCard.Value>
                        </MetricCard.Root>
                    </View>
                </View>
            </View>

            {/* Loyalty Settings Card */}
            <Card.Root style={styles.loyaltyCard}>
                <Card.Body>
                    <View style={styles.loyaltyContent}>
                        <View style={styles.loyaltyIcon}>
                            <Ionicons name="gift" size={24} color="#f59e0b" />
                        </View>

                        <View style={styles.loyaltyInfo}>
                            <Text style={styles.loyaltyTitle}>
                                Configuração de Fidelidade
                            </Text>
                            <Text style={styles.loyaltyDescription}>
                                Atualmente, clientes ganham um corte grátis a cada{' '}
                                <Text style={styles.loyaltyHighlight}>{haircutsForFree} cortes</Text>
                            </Text>

                            <TouchableOpacity
                                style={styles.settingsButton}
                                onPress={() => router.push('/settings')}
                            >
                                <Text style={styles.settingsButtonText}>
                                    Alterar Configuração
                                </Text>
                                <Ionicons name="arrow-forward" size={16} color="#18181b" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Card.Body>
            </Card.Root>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
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
    loyaltyCard: {
        marginTop: 4,
    },
    loyaltyContent: {
        flexDirection: 'row',
        gap: 12,
    },
    loyaltyIcon: {
        width: 48,
        height: 48,
        backgroundColor: '#fffbeb',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loyaltyInfo: {
        flex: 1,
        gap: 8,
    },
    loyaltyTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#18181b',
    },
    loyaltyDescription: {
        fontSize: 14,
        color: '#71717a',
        lineHeight: 20,
    },
    loyaltyHighlight: {
        fontWeight: '600',
        color: '#f59e0b',
    },
    settingsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#f4f4f5',
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginTop: 4,
    },
    settingsButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#18181b',
    },
});