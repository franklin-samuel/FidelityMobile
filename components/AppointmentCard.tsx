import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency } from '../utils/formatter';
import type { Appointment } from '../types/appointment';

interface AppointmentCardProps {
    appointment: Appointment;
    showBarberName?: boolean;
    showCustomerName?: boolean;
}

export function AppointmentCard({
                                    appointment,
                                    showBarberName = false,
                                    showCustomerName = false,
                                }: AppointmentCardProps) {
    const isService = appointment.type === 'SERVICE';
    const itemName = isService ? appointment.service_name : appointment.product_name;

    return (
        <View style={styles.card}>
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
                    {showBarberName && appointment.barber_name && (
                        <Text style={styles.cardSub}>{appointment.barber_name}</Text>
                    )}
                    {showCustomerName && appointment.customer_name && (
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
                    {formatCurrency(showBarberName
                        ? (appointment.barbershop_revenue ?? 0)
                        : (appointment.barber_total ?? 0)
                    )}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e4e4e7',
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 12,
    },
    cardLeft: {
        flexDirection: 'row',
        gap: 10,
        flex: 1,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    iconBoxService: {
        backgroundColor: '#fffbeb',
    },
    iconBoxProduct: {
        backgroundColor: '#eef2ff',
    },
    cardInfo: {
        flex: 1,
        gap: 2,
    },
    cardTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        flexWrap: 'wrap',
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#18181b',
    },
    loyaltyBadge: {
        backgroundColor: '#dcfce7',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    loyaltyBadgeText: {
        fontSize: 10,
        color: '#16a34a',
        fontWeight: '600',
    },
    cardDate: {
        fontSize: 12,
        color: '#a1a1aa',
    },
    cardSub: {
        fontSize: 12,
        color: '#71717a',
    },
    cardRight: {
        alignItems: 'flex-end',
        gap: 2,
    },
    cardPrice: {
        fontSize: 14,
        fontWeight: '600',
        color: '#18181b',
    },
    cardCommission: {
        fontSize: 11,
        color: '#71717a',
    },
    cardTip: {
        fontSize: 11,
        color: '#71717a',
    },
    cardEarning: {
        fontSize: 14,
        fontWeight: '700',
        color: '#16a34a',
    },
});