import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TrendingUp, DollarSign, Scissors, Gift, Users, Package } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { LineChart } from 'react-native-gifted-charts';
import { useDashboardMetrics } from '../../../hooks/useDashboard';
import { usePermissions } from '../../../hooks/usePermissions';
import { DashboardSkeleton } from '../../../components/Loading';
import { MetricCard } from '../../../components/MetricCard';
import { Card } from '../../../components/Card';
import { formatCurrency } from '../../../utils/formatter';
import { isAdminMetrics, type AdminDashboardMetrics, type BarberDashboardMetrics } from '../../../types/dashboard';

const { width } = Dimensions.get('window');
const chartWidth = width - 64;

export default function DashboardPage() {
    const router = useRouter();
    const { data: metrics, isLoading } = useDashboardMetrics();
    const { isAdmin } = usePermissions();

    if (isLoading) {
        return (
            <ScrollView style={styles.container}>
                <DashboardSkeleton />
            </ScrollView>
        );
    }

    if (!metrics) {
        return null;
    }

    if (isAdmin && isAdminMetrics(metrics)) {
        const adminMetrics = metrics as AdminDashboardMetrics;

        const revenueData = adminMetrics.last_30_days_revenue.map((item, index) => ({
            value: item.amount,
            label: index % 5 === 0 ? new Date(item.date).getDate().toString() : '',
            dataPointText: index % 5 === 0 ? formatCurrency(item.amount) : '',
        }));

        return (
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Dashboard Administrativo</Text>
                    <Text style={styles.headerDescription}>Visão geral da barbearia</Text>
                </View>

                {/* Revenue Cards */}
                <View style={styles.metricsGrid}>
                    <View style={styles.metricRow}>
                        <View style={styles.metricItem}>
                            <MetricCard.Root>
                                <MetricCard.Header
                                    title="Hoje"
                                    icon={<DollarSign size={20} color="#71717a" />}
                                />
                                <MetricCard.Value>
                                    {formatCurrency(adminMetrics.today_revenue)}
                                </MetricCard.Value>
                            </MetricCard.Root>
                        </View>

                        <View style={styles.metricItem}>
                            <MetricCard.Root>
                                <MetricCard.Header
                                    title="Esta Semana"
                                    icon={<TrendingUp size={20} color="#71717a" />}
                                />
                                <MetricCard.Value>
                                    {formatCurrency(adminMetrics.week_revenue)}
                                </MetricCard.Value>
                            </MetricCard.Root>
                        </View>
                    </View>

                    <View style={styles.metricRow}>
                        <View style={styles.metricItem}>
                            <MetricCard.Root variant="highlight">
                                <MetricCard.Header
                                    title="Este Mês"
                                    icon={<Ionicons name="calendar" size={20} color="#f59e0b" />}
                                />
                                <MetricCard.Value variant="highlight">
                                    {formatCurrency(adminMetrics.month_revenue)}
                                </MetricCard.Value>
                            </MetricCard.Root>
                        </View>

                        <View style={styles.metricItem}>
                            <MetricCard.Root>
                                <MetricCard.Header
                                    title="Crescimento"
                                    icon={<TrendingUp size={20} color="#71717a" />}
                                />
                                <MetricCard.Value>
                                    {adminMetrics.monthly_growth_percentage >= 0 ? '+' : ''}
                                    {adminMetrics.monthly_growth_percentage.toFixed(1)}%
                                </MetricCard.Value>
                            </MetricCard.Root>
                        </View>
                    </View>
                </View>

                {/* Revenue Chart */}
                {revenueData.length > 0 && (
                    <Card.Root>
                        <Card.Header>
                            <Card.Title>Receita - Últimos 30 Dias</Card.Title>
                            <Card.Description>Evolução diária da receita</Card.Description>
                        </Card.Header>
                        <Card.Body>
                            <LineChart
                                data={revenueData}
                                width={chartWidth - 32}
                                height={180}
                                spacing={15}
                                thickness={3}
                                color="#f59e0b"
                                startFillColor="#fef3c7"
                                endFillColor="#fef3c7"
                                startOpacity={0.5}
                                endOpacity={0.1}
                                areaChart
                                curved
                                hideRules
                                hideDataPoints={false}
                                dataPointsColor="#f59e0b"
                                dataPointsRadius={4}
                                xAxisThickness={1}
                                yAxisThickness={1}
                                yAxisTextStyle={{ color: '#71717a', fontSize: 11 }}
                                xAxisLabelTextStyle={{ color: '#71717a', fontSize: 10 }}
                                noOfSections={4}
                            />
                        </Card.Body>
                    </Card.Root>
                )}

                {/* Revenue by Type */}
                <View style={styles.metricsGrid}>
                    <View style={styles.metricRow}>
                        <View style={styles.metricItem}>
                            <MetricCard.Root>
                                <MetricCard.Header
                                    title="Receita Serviços"
                                    icon={<Scissors size={20} color="#71717a" />}
                                />
                                <MetricCard.Value>
                                    {formatCurrency(adminMetrics.services_revenue)}
                                </MetricCard.Value>
                            </MetricCard.Root>
                        </View>

                        <View style={styles.metricItem}>
                            <MetricCard.Root>
                                <MetricCard.Header
                                    title="Receita Produtos"
                                    icon={<Package size={20} color="#71717a" />}
                                />
                                <MetricCard.Value>
                                    {formatCurrency(adminMetrics.products_revenue)}
                                </MetricCard.Value>
                            </MetricCard.Root>
                        </View>
                    </View>
                </View>

                {/* Top Barbers */}
                {adminMetrics.top_barbers && adminMetrics.top_barbers.length > 0 && (
                    <Card.Root>
                        <Card.Header>
                            <Card.Title>Top Barbeiros</Card.Title>
                            <Card.Description>Melhor desempenho do mês</Card.Description>
                        </Card.Header>
                        <Card.Body>
                            <View style={styles.topBarbersList}>
                                {adminMetrics.top_barbers.slice(0, 5).map((barber, index) => (
                                    <View key={index} style={styles.topBarberItem}>
                                        <View style={styles.topBarberRank}>
                                            <Text style={styles.topBarberRankText}>{index + 1}</Text>
                                        </View>
                                        <View style={styles.topBarberInfo}>
                                            <Text style={styles.topBarberName}>{barber.barber_name}</Text>
                                            <Text style={styles.topBarberCount}>
                                                {barber.appointments_count} atendimentos
                                            </Text>
                                        </View>
                                        <Text style={styles.topBarberRevenue}>
                                            {formatCurrency(barber.total_revenue)}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </Card.Body>
                    </Card.Root>
                )}

                {/* Quick Actions */}
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Acesso Rápido</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <View style={styles.quickActions}>
                            <TouchableOpacity
                                style={styles.quickAction}
                                onPress={() => router.push('/(tabs)/more')}
                            >
                                <Ionicons name="analytics" size={24} color="#3b82f6" />
                                <Text style={styles.quickActionText}>Analytics</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.quickAction}
                                onPress={() => router.push('/(tabs)/appointments')}
                            >
                                <Ionicons name="receipt-outline" size={24} color="#f59e0b" />
                                <Text style={styles.quickActionText}>Atendimentos</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.quickAction}
                                onPress={() => router.push('/(tabs)/clients')}
                            >
                                <Users size={24} color="#8b5cf6" />
                                <Text style={styles.quickActionText}>Clientes</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.quickAction}
                                onPress={() => router.push('/(tabs)/catalog')}
                            >
                                <Package size={24} color="#16a34a" />
                                <Text style={styles.quickActionText}>Catálogo</Text>
                            </TouchableOpacity>
                        </View>
                    </Card.Body>
                </Card.Root>
            </ScrollView>
        );
    }

    const barberMetrics = metrics as BarberDashboardMetrics;

    const earningsData = barberMetrics.last_30_days_earnings.map((item, index) => ({
        value: item.amount,
        label: index % 5 === 0 ? new Date(item.date).getDate().toString() : '',
        dataPointText: index % 5 === 0 ? formatCurrency(item.amount) : '',
    }));

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Meu Dashboard</Text>
                <Text style={styles.headerDescription}>Acompanhe seu desempenho</Text>
            </View>

            {/* Earnings Cards */}
            <View style={styles.metricsGrid}>
                <View style={styles.metricRow}>
                    <View style={styles.metricItem}>
                        <MetricCard.Root>
                            <MetricCard.Header
                                title="Ganhos Hoje"
                                icon={<DollarSign size={20} color="#71717a" />}
                            />
                            <MetricCard.Value>
                                {formatCurrency(barberMetrics.today_earnings)}
                            </MetricCard.Value>
                        </MetricCard.Root>
                    </View>

                    <View style={styles.metricItem}>
                        <MetricCard.Root>
                            <MetricCard.Header
                                title="Esta Semana"
                                icon={<TrendingUp size={20} color="#71717a" />}
                            />
                            <MetricCard.Value>
                                {formatCurrency(barberMetrics.week_earnings)}
                            </MetricCard.Value>
                        </MetricCard.Root>
                    </View>
                </View>

                <View style={styles.metricRow}>
                    <View style={styles.metricItem}>
                        <MetricCard.Root variant="highlight">
                            <MetricCard.Header
                                title="Este Mês"
                                icon={<Ionicons name="calendar" size={20} color="#f59e0b" />}
                            />
                            <MetricCard.Value variant="highlight">
                                {formatCurrency(barberMetrics.month_earnings)}
                            </MetricCard.Value>
                        </MetricCard.Root>
                    </View>

                    <View style={styles.metricItem}>
                        <MetricCard.Root>
                            <MetricCard.Header
                                title="Atendimentos"
                                icon={<Scissors size={20} color="#71717a" />}
                            />
                            <MetricCard.Value>
                                {barberMetrics.month_appointments}
                            </MetricCard.Value>
                        </MetricCard.Root>
                    </View>
                </View>
            </View>

            {/* Earnings Chart */}
            {earningsData.length > 0 && (
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Ganhos - Últimos 30 Dias</Card.Title>
                        <Card.Description>Evolução dos seus ganhos</Card.Description>
                    </Card.Header>
                    <Card.Body>
                        <LineChart
                            data={earningsData}
                            width={chartWidth - 32}
                            height={180}
                            spacing={15}
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
                            dataPointsRadius={4}
                            xAxisThickness={1}
                            yAxisThickness={1}
                            yAxisTextStyle={{ color: '#71717a', fontSize: 11 }}
                            xAxisLabelTextStyle={{ color: '#71717a', fontSize: 10 }}
                            noOfSections={4}
                        />
                    </Card.Body>
                </Card.Root>
            )}

            {/* Month Details */}
            <Card.Root>
                <Card.Header>
                    <Card.Title>Detalhes do Mês</Card.Title>
                </Card.Header>
                <Card.Body>
                    <View style={styles.detailsList}>
                        <View style={styles.detailItem}>
                            <View style={styles.detailIcon}>
                                <DollarSign size={20} color="#3b82f6" />
                            </View>
                            <View style={styles.detailInfo}>
                                <Text style={styles.detailLabel}>Ticket Médio</Text>
                                <Text style={styles.detailValue}>
                                    {formatCurrency(barberMetrics.month_average_ticket)}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.detailItem}>
                            <View style={styles.detailIcon}>
                                <Gift size={20} color="#16a34a" />
                            </View>
                            <View style={styles.detailInfo}>
                                <Text style={styles.detailLabel}>Total em Gorjetas</Text>
                                <Text style={styles.detailValue}>
                                    {formatCurrency(barberMetrics.month_total_tips)}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.detailItem}>
                            <View style={styles.detailIcon}>
                                <TrendingUp size={20} color="#f59e0b" />
                            </View>
                            <View style={styles.detailInfo}>
                                <Text style={styles.detailLabel}>Comissões</Text>
                                <Text style={styles.detailValue}>
                                    {formatCurrency(barberMetrics.month_commission)}
                                </Text>
                            </View>
                        </View>
                    </View>
                </Card.Body>
            </Card.Root>

            {/* Quick Actions */}
            <Card.Root>
                <Card.Header>
                    <Card.Title>Acesso Rápido</Card.Title>
                </Card.Header>
                <Card.Body>
                    <View style={styles.quickActions}>
                        <TouchableOpacity
                            style={styles.quickAction}
                            onPress={() => router.push('/(tabs)/sales')}
                        >
                            <Ionicons name="add-circle" size={24} color="#16a34a" />
                            <Text style={styles.quickActionText}>Nova Venda</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.quickAction}
                            onPress={() => router.push('/(tabs)/appointments')}
                        >
                            <Ionicons name="receipt-outline" size={24} color="#f59e0b" />
                            <Text style={styles.quickActionText}>Meus Atendimentos</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.quickAction}
                            onPress={() => router.push('/(tabs)/clients')}
                        >
                            <Users size={24} color="#3b82f6" />
                            <Text style={styles.quickActionText}>Clientes</Text>
                        </TouchableOpacity>
                    </View>
                </Card.Body>
            </Card.Root>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fafafa' },
    content: { padding: 16, gap: 16, paddingBottom: 40 },
    header: { gap: 4, paddingVertical: 8 },
    headerTitle: { fontSize: 28, fontWeight: '700', color: '#18181b' },
    headerDescription: { fontSize: 15, color: '#71717a' },
    metricsGrid: { gap: 12 },
    metricRow: { flexDirection: 'row', gap: 12 },
    metricItem: { flex: 1 },
    topBarbersList: { gap: 12 },
    topBarberItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: '#f4f4f5', borderRadius: 8 },
    topBarberRank: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#f59e0b', alignItems: 'center', justifyContent: 'center' },
    topBarberRankText: { fontSize: 16, fontWeight: '700', color: '#fff' },
    topBarberInfo: { flex: 1 },
    topBarberName: { fontSize: 15, fontWeight: '600', color: '#18181b' },
    topBarberCount: { fontSize: 13, color: '#71717a' },
    topBarberRevenue: { fontSize: 16, fontWeight: '700', color: '#16a34a' },
    quickActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    quickAction: { flex: 1, minWidth: '45%', alignItems: 'center', gap: 8, padding: 16, backgroundColor: '#f4f4f5', borderRadius: 8 },
    quickActionText: { fontSize: 13, fontWeight: '600', color: '#18181b', textAlign: 'center' },
    detailsList: { gap: 12 },
    detailItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: '#f4f4f5', borderRadius: 8 },
    detailIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
    detailInfo: { flex: 1 },
    detailLabel: { fontSize: 13, color: '#71717a' },
    detailValue: { fontSize: 16, fontWeight: '700', color: '#18181b', marginTop: 2 },
});