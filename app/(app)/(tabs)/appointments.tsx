import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppointments } from '../../../hooks/useAppointment';
import { useBarbers } from '../../../hooks/useBarber';
import { useAuth } from '../../../hooks/useAuth';
import { formatCurrency } from '../../../utils/formatter';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { AppointmentFilters } from '../../../types/appointment';

const DEFAULT_FILTERS: AppointmentFilters = {
    page: 1,
    size: 25,
};

export default function AppointmentsPage() {
    const [filters, setFilters] = useState<AppointmentFilters>(DEFAULT_FILTERS);
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';
    const { data: result, isLoading } = useAppointments(filters);

    const appointments = result?.content ?? [];
    const totalElements = result?.total_elements ?? 0;
    const hasNext = result?.has_next ?? false;
    const hasPrevious = result?.has_previous ?? false;
    const currentPage = result?.page ?? 1;

    const handleNextPage = () => setFilters(prev => ({ ...prev, page: (prev.page ?? 1) + 1 }));
    const handlePrevPage = () => setFilters(prev => ({ ...prev, page: (prev.page ?? 1) - 1 }));

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#f59e0b" />
                    </View>
                ) : appointments.length === 0 ? (
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIcon}>
                            <Ionicons name="receipt-outline" size={48} color="#a1a1aa" />
                        </View>
                        <Text style={styles.emptyTitle}>Nenhum atendimento encontrado</Text>
                        <Text style={styles.emptyDescription}>
                            Os atendimentos registrados aparecerão aqui
                        </Text>
                    </View>
                ) : (
                    <>
                        <Text style={styles.totalText}>{totalElements} atendimentos</Text>
                        {appointments.map((appointment) => {
                            const isService = appointment.type === 'SERVICE';
                            const itemName = isService ? appointment.service_name : appointment.product_name;

                            return (
                                <View key={appointment.id} style={styles.card}>
                                    <View style={styles.cardLeft}>
                                        <View style={[styles.iconBox, isService ? styles.iconBoxService : styles.iconBoxProduct]}>
                                            <Ionicons
                                                name={isService ? 'cut' : 'cube-outline'}
                                                size={20}
                                                color={isService ? '#f59e0b' : '#6366f1'}
                                            />
                                        </View>
                                        <View style={styles.cardInfo}>
                                            <View style={styles.cardTitleRow}>
                                                <Text style={styles.cardTitle} numberOfLines={1}>
                                                    {itemName ?? (isService ? 'Serviço' : 'Produto')}
                                                </Text>
                                                {appointment.loyalty_discount_applied && (
                                                    <View style={styles.loyaltyBadge}>
                                                        <Text style={styles.loyaltyBadgeText}>Fidelidade</Text>
                                                    </View>
                                                )}
                                            </View>
                                            <Text style={styles.cardDate}>
                                                {format(new Date(appointment.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                            </Text>
                                            {isAdmin && appointment.barber_name && (
                                                <Text style={styles.cardSub}>{appointment.barber_name}</Text>
                                            )}
                                            {isAdmin && appointment.customer_name && (
                                                <Text style={styles.cardSub}>{appointment.customer_name}</Text>
                                            )}
                                        </View>
                                    </View>

                                    <View style={styles.cardRight}>
                                        <Text style={styles.cardPrice}>{formatCurrency(appointment.price)}</Text>
                                        <Text style={styles.cardCommission}>{appointment.commission_percentage}% comissão</Text>
                                        {appointment.tip > 0 && (
                                            <Text style={styles.cardTip}>+{formatCurrency(appointment.tip)} gorjeta</Text>
                                        )}
                                        <Text style={styles.cardEarning}>
                                            {formatCurrency(isAdmin
                                                ? (appointment.barbershop_revenue ?? 0)
                                                : (appointment.barber_total ?? 0)
                                            )}
                                        </Text>
                                    </View>
                                </View>
                            );
                        })}

                        {/* Pagination */}
                        <View style={styles.pagination}>
                            <TouchableOpacity
                                onPress={handlePrevPage}
                                disabled={!hasPrevious}
                                style={[styles.pageButton, !hasPrevious && styles.pageButtonDisabled]}
                            >
                                <Ionicons name="chevron-back" size={20} color={hasPrevious ? '#18181b' : '#a1a1aa'} />
                            </TouchableOpacity>
                            <Text style={styles.pageText}>Página {currentPage}</Text>
                            <TouchableOpacity
                                onPress={handleNextPage}
                                disabled={!hasNext}
                                style={[styles.pageButton, !hasNext && styles.pageButtonDisabled]}
                            >
                                <Ionicons name="chevron-forward" size={20} color={hasNext ? '#18181b' : '#a1a1aa'} />
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    scrollView: { flex: 1 },
    content: { padding: 16, gap: 12, paddingBottom: 80 },
    loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 64 },
    emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 64, gap: 12 },
    emptyIcon: { width: 80, height: 80, backgroundColor: '#f4f4f5', borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    emptyTitle: { fontSize: 18, fontWeight: '600', color: '#18181b' },
    emptyDescription: { fontSize: 14, color: '#71717a', textAlign: 'center', paddingHorizontal: 32 },
    totalText: { fontSize: 13, color: '#71717a', marginBottom: 4 },
    card: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e4e4e7', padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
    cardLeft: { flexDirection: 'row', gap: 10, flex: 1 },
    iconBox: { width: 40, height: 40, borderRadius: 8, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    iconBoxService: { backgroundColor: '#fffbeb' },
    iconBoxProduct: { backgroundColor: '#eef2ff' },
    cardInfo: { flex: 1, gap: 2 },
    cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
    cardTitle: { fontSize: 14, fontWeight: '600', color: '#18181b' },
    loyaltyBadge: { backgroundColor: '#dcfce7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
    loyaltyBadgeText: { fontSize: 10, color: '#16a34a', fontWeight: '600' },
    cardDate: { fontSize: 12, color: '#a1a1aa' },
    cardSub: { fontSize: 12, color: '#71717a' },
    cardRight: { alignItems: 'flex-end', gap: 2 },
    cardPrice: { fontSize: 14, fontWeight: '600', color: '#18181b' },
    cardCommission: { fontSize: 11, color: '#71717a' },
    cardTip: { fontSize: 11, color: '#71717a' },
    cardEarning: { fontSize: 14, fontWeight: '700', color: '#16a34a' },
    pagination: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16, paddingTop: 8 },
    pageButton: { padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#e4e4e7' },
    pageButtonDisabled: { opacity: 0.4 },
    pageText: { fontSize: 14, color: '#71717a' },
});