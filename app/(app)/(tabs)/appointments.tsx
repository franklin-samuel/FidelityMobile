import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppointments } from '../../../hooks/useAppointment';
import { useAuth } from '../../../hooks/useAuth';
import { usePermissions } from '../../../hooks/usePermissions';
import { InfiniteScrollList } from '../../../components/InfiniteScrollList';
import { AppointmentCard } from '../../../components/AppointmentCard';
import type { AppointmentFilters } from '../../../types/appointment';

const DEFAULT_FILTERS: AppointmentFilters = {
    page: 1,
    size: 25,
};

export default function AppointmentsPage() {
    const [filters, setFilters] = useState<AppointmentFilters>(DEFAULT_FILTERS);
    const { user } = useAuth();
    const { isAdmin } = usePermissions();

    const finalFilters = {
        ...filters,
        barber_id: isAdmin ? undefined : user?.id,
    };

    const { data: result, isLoading, refetch } = useAppointments(finalFilters);

    const appointments = result?.content ?? [];
    const hasNext = result?.has_next ?? false;

    const handleLoadMore = () => {
        if (hasNext && !isLoading) {
            setFilters(prev => ({ ...prev, page: (prev.page ?? 1) + 1 }));
        }
    };

    const handleRefresh = () => {
        setFilters(DEFAULT_FILTERS);
        refetch();
    };

    return (
        <View style={styles.container}>
            <InfiniteScrollList
                data={appointments}
                renderItem={({ item }) => (
                    <AppointmentCard
                        appointment={item}
                        showBarberName={isAdmin}
                        showCustomerName={isAdmin}
                    />
                )}
                keyExtractor={(item) => item.id}
                onLoadMore={handleLoadMore}
                onRefresh={handleRefresh}
                hasMore={hasNext}
                isLoading={isLoading && filters.page === 1}
                isLoadingMore={isLoading && (filters.page ?? 1) > 1}
                isRefreshing={false}
                emptyMessage={
                    isAdmin
                        ? "Nenhum atendimento encontrado"
                        : "Você ainda não tem atendimentos registrados"
                }
                emptyIcon={<Ionicons name="receipt-outline" size={48} color="#a1a1aa" />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});