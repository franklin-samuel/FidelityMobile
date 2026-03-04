import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TrendingUp, Users, DollarSign, Target } from 'lucide-react-native';
import { BarChart, PieChart, LineChart } from 'react-native-gifted-charts';
import { useAnalyticsData } from '../../../hooks/useAnalytics';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import { Loading } from '../../../components/Loading';
import { formatCurrency, formatPercentage } from '../../../utils/formatter';

const { width } = Dimensions.get('window');
const chartWidth = width - 64;

export default function AnalyticsPage() {
    const { data: analytics, isLoading } = useAnalyticsData();

    if (isLoading) {
        return <Loading fullScreen text="Carregando analytics..." />;
    }

    if (!analytics) {
        return (
            <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={48} color="#ef4444" />
                <Text style={styles.errorText}>Erro ao carregar dados</Text>
            </View>
        );
    }

    const ageGroupData = Object.entries(analytics.customers_by_age_group || {}).map(([label, value]) => ({
        value: value as number,
        label: label.replace('_', '-'),
        frontColor: '#f59e0b',
    }));

    const genderData = Object.entries(analytics.customers_by_gender || {})
        .filter(([_, value]) => (value as number) > 0)
        .map(([label, value], index) => {
            const colors = ['#f59e0b', '#3b82f6', '#8b5cf6', '#a1a1aa'];
            const labels: Record<string, string> = {
                MALE: 'Masculino',
                FEMALE: 'Feminino',
                OTHER: 'Outro',
                NOT_INFORMED: 'Não informado',
            };
            return {
                value: value as number,
                color: colors[index % colors.length],
                text: `${value}`,
                label: labels[label] || label,
            };
        });

    const revenueData = (analytics.channel_vs_revenue || []).map((item) => ({
        value: item.average_ticket,
        label: item.channel.substring(0, 3),
        dataPointText: formatCurrency(item.average_ticket),
    }));

    return (
        <ProtectedRoute permission="analytics">
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Analytics</Text>
                    <Text style={styles.headerDescription}>
                        Análise detalhada dos dados da barbearia
                    </Text>
                </View>

                {/* Main Metrics */}
                <View style={styles.metricsGrid}>
                    <View style={styles.metricCard}>
                        <View style={[styles.metricIcon, { backgroundColor: '#dbeafe' }]}>
                            <Users size={20} color="#3b82f6" />
                        </View>
                        <Text style={styles.metricValue}>{analytics.total_customers}</Text>
                        <Text style={styles.metricLabel}>Total de Clientes</Text>
                    </View>

                    <View style={styles.metricCard}>
                        <View style={[styles.metricIcon, { backgroundColor: '#fef3c7' }]}>
                            <DollarSign size={20} color="#f59e0b" />
                        </View>
                        <Text style={styles.metricValue}>{formatCurrency(analytics.average_ticket)}</Text>
                        <Text style={styles.metricLabel}>Ticket Médio</Text>
                    </View>

                    <View style={styles.metricCard}>
                        <View style={[styles.metricIcon, { backgroundColor: '#dcfce7' }]}>
                            <TrendingUp size={20} color="#16a34a" />
                        </View>
                        <Text style={styles.metricValue}>{formatCurrency(analytics.total_revenue)}</Text>
                        <Text style={styles.metricLabel}>Receita Total</Text>
                    </View>

                    <View style={styles.metricCard}>
                        <View style={[styles.metricIcon, { backgroundColor: '#ede9fe' }]}>
                            <Target size={20} color="#8b5cf6" />
                        </View>
                        <Text style={styles.metricValue}>{formatPercentage(analytics.retention_rate)}</Text>
                        <Text style={styles.metricLabel}>Taxa de Retenção</Text>
                    </View>
                </View>

                {/* Clientes por Faixa Etária */}
                {ageGroupData.length > 0 && (
                    <View style={styles.chartSection}>
                        <View style={styles.chartHeader}>
                            <Ionicons name="bar-chart" size={20} color="#f59e0b" />
                            <Text style={styles.chartTitle}>Clientes por Faixa Etária</Text>
                        </View>
                        <View style={styles.chartContainer}>
                            <BarChart
                                data={ageGroupData}
                                width={chartWidth}
                                height={220}
                                barWidth={40}
                                spacing={20}
                                roundedTop
                                roundedBottom
                                hideRules
                                xAxisThickness={1}
                                yAxisThickness={1}
                                yAxisTextStyle={{ color: '#71717a', fontSize: 12 }}
                                xAxisLabelTextStyle={{ color: '#71717a', fontSize: 11 }}
                                noOfSections={4}
                                maxValue={Math.max(...ageGroupData.map(d => d.value)) + 5}
                            />
                        </View>
                    </View>
                )}

                {/* Clientes por Gênero */}
                {genderData.length > 0 && (
                    <View style={styles.chartSection}>
                        <View style={styles.chartHeader}>
                            <Ionicons name="pie-chart" size={20} color="#3b82f6" />
                            <Text style={styles.chartTitle}>Clientes por Gênero</Text>
                        </View>
                        <View style={styles.chartContainer}>
                            <PieChart
                                data={genderData}
                                radius={80}
                                innerRadius={50}
                                centerLabelComponent={() => (
                                    <View style={styles.pieCenter}>
                                        <Text style={styles.pieCenterValue}>{analytics.total_customers}</Text>
                                        <Text style={styles.pieCenterLabel}>Total</Text>
                                    </View>
                                )}
                            />
                            <View style={styles.pieLegend}>
                                {genderData.map((item, index) => (
                                    <View key={index} style={styles.legendItem}>
                                        <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                                        <Text style={styles.legendText}>
                                            {item.label}: {item.value}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                )}

                {/* Ticket Médio por Canal */}
                {revenueData.length > 0 && (
                    <View style={styles.chartSection}>
                        <View style={styles.chartHeader}>
                            <Ionicons name="trending-up" size={20} color="#16a34a" />
                            <Text style={styles.chartTitle}>Ticket Médio por Canal</Text>
                        </View>
                        <View style={styles.chartContainer}>
                            <LineChart
                                data={revenueData}
                                width={chartWidth}
                                height={200}
                                spacing={50}
                                thickness={3}
                                color="#16a34a"
                                startFillColor="#dcfce7"
                                endFillColor="#dcfce7"
                                startOpacity={0.5}
                                endOpacity={0.1}
                                areaChart
                                curved
                                hideRules
                                hideDataPoints={false}
                                dataPointsColor="#16a34a"
                                dataPointsRadius={5}
                                xAxisThickness={1}
                                yAxisThickness={1}
                                yAxisTextStyle={{ color: '#71717a', fontSize: 12 }}
                                xAxisLabelTextStyle={{ color: '#71717a', fontSize: 11 }}
                                noOfSections={4}
                            />
                        </View>
                    </View>
                )}

                {/* Top Clientes */}
                {analytics.top_customers && analytics.top_customers.length > 0 && (
                    <View style={styles.chartSection}>
                        <View style={styles.chartHeader}>
                            <Ionicons name="trophy" size={20} color="#f59e0b" />
                            <Text style={styles.chartTitle}>Top 5 Clientes</Text>
                        </View>
                        <View style={styles.topCustomersList}>
                            {analytics.top_customers.slice(0, 5).map((customer, index) => (
                                <View key={index} style={styles.topCustomerItem}>
                                    <View style={styles.topCustomerRank}>
                                        <Text style={styles.topCustomerRankText}>{index + 1}</Text>
                                    </View>
                                    <View style={styles.topCustomerInfo}>
                                        <Text style={styles.topCustomerName}>{customer.name}</Text>
                                        <Text style={styles.topCustomerVisits}>
                                            {customer.visits_count} visitas
                                        </Text>
                                    </View>
                                    <Text style={styles.topCustomerSpent}>
                                        {formatCurrency(customer.total_spent)}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {/* Canais de Aquisição */}
                {analytics.acquisition_channels && analytics.acquisition_channels.length > 0 && (
                    <View style={styles.chartSection}>
                        <View style={styles.chartHeader}>
                            <Ionicons name="megaphone" size={20} color="#8b5cf6" />
                            <Text style={styles.chartTitle}>Canais de Aquisição</Text>
                        </View>
                        <View style={styles.channelsList}>
                            {analytics.acquisition_channels.map((channel, index) => (
                                <View key={index} style={styles.channelItem}>
                                    <View style={styles.channelInfo}>
                                        <Text style={styles.channelName}>{channel.channel}</Text>
                                        <Text style={styles.channelCount}>
                                            {channel.customer_count} clientes
                                        </Text>
                                    </View>
                                    <View style={styles.channelPercentage}>
                                        <Text style={styles.channelPercentageText}>
                                            {formatPercentage(channel.percentage, 0)}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                )}
            </ScrollView>
        </ProtectedRoute>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fafafa' },
    content: { padding: 16, gap: 20, paddingBottom: 40 },
    header: { gap: 4 },
    headerTitle: { fontSize: 28, fontWeight: '700', color: '#18181b' },
    headerDescription: { fontSize: 15, color: '#71717a' },
    metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    metricCard: { flex: 1, minWidth: '45%', backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#e4e4e7', gap: 8 },
    metricIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    metricValue: { fontSize: 24, fontWeight: '700', color: '#18181b' },
    metricLabel: { fontSize: 13, color: '#71717a' },
    chartSection: { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#e4e4e7' },
    chartHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
    chartTitle: { fontSize: 16, fontWeight: '600', color: '#18181b' },
    chartContainer: { alignItems: 'center', paddingVertical: 8 },
    pieCenter: { alignItems: 'center' },
    pieCenterValue: { fontSize: 24, fontWeight: '700', color: '#18181b' },
    pieCenterLabel: { fontSize: 12, color: '#71717a' },
    pieLegend: { marginTop: 20, gap: 8, width: '100%' },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    legendDot: { width: 12, height: 12, borderRadius: 6 },
    legendText: { fontSize: 13, color: '#71717a' },
    topCustomersList: { gap: 12 },
    topCustomerItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: '#f4f4f5', borderRadius: 8 },
    topCustomerRank: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#f59e0b', alignItems: 'center', justifyContent: 'center' },
    topCustomerRankText: { fontSize: 16, fontWeight: '700', color: '#fff' },
    topCustomerInfo: { flex: 1 },
    topCustomerName: { fontSize: 15, fontWeight: '600', color: '#18181b' },
    topCustomerVisits: { fontSize: 13, color: '#71717a' },
    topCustomerSpent: { fontSize: 16, fontWeight: '700', color: '#16a34a' },
    channelsList: { gap: 12 },
    channelItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, backgroundColor: '#f4f4f5', borderRadius: 8 },
    channelInfo: { flex: 1 },
    channelName: { fontSize: 15, fontWeight: '600', color: '#18181b' },
    channelCount: { fontSize: 13, color: '#71717a' },
    channelPercentage: { backgroundColor: '#ede9fe', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
    channelPercentageText: { fontSize: 14, fontWeight: '700', color: '#8b5cf6' },
    errorContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
    errorText: { fontSize: 16, color: '#ef4444', fontWeight: '600' },
});