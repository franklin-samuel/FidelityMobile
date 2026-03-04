import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useServices } from '../../../hooks/useService';
import { useProducts } from '../../../hooks/useProduct';
import { useSearchCustomers } from '../../../hooks/useCustomer';
import { useLoyaltyStatus } from '../../../hooks/useLoyalty';
import { useRegisterServiceAppointment, useRegisterProductAppointment, useAppointments } from '../../../hooks/useAppointment';
import { StepIndicator } from '../../../components/StepIndicator';
import { AppointmentCard } from '../../../components/AppointmentCard';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { Modal } from '../../../components/Modal';
import { usePermissions } from '../../../hooks/usePermissions';
import type { Service } from '../../../types/service';
import type { Product } from '../../../types/product';
import type { Customer } from '../../../types/customer';
import type { PaymentMethod } from '../../../types/appointment';
import { formatCurrency } from '../../../utils/formatter';

type TabType = 'services' | 'products';

const STEPS = [
    { id: 1, label: 'Item' },
    { id: 2, label: 'Cliente' },
    { id: 3, label: 'Pagamento' },
];

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
    { value: 'PIX', label: 'Pix' },
    { value: 'MONEY', label: 'Dinheiro' },
    { value: 'CREDIT', label: 'Crédito' },
    { value: 'DEBIT', label: 'Débito' },
];

export default function SalesPage() {
    const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [tab, setTab] = useState<TabType>('services');
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [customerSearch, setCustomerSearch] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');
    const [tip, setTip] = useState('');

    const { isAdmin } = usePermissions();
    const { data: services, isLoading: loadingServices } = useServices();
    const { data: products, isLoading: loadingProducts } = useProducts();
    const { data: searchResults, isLoading: searchingCustomers } = useSearchCustomers(customerSearch);
    const { mutate: registerService, isPending: registeringService } = useRegisterServiceAppointment();
    const { mutate: registerProduct, isPending: registeringProduct } = useRegisterProductAppointment();
    
    const { data: recentResult } = useAppointments({ page: 1, size: 10 });
    const recentAppointments = recentResult?.content ?? [];

    const isService = tab === 'services';
    const selectedItem = isService ? selectedService : selectedProduct;
    const isRegistering = registeringService || registeringProduct;

    const { data: loyaltyStatus, isLoading: loadingLoyalty } = useLoyaltyStatus(
        isService && selectedCustomer ? selectedCustomer.id : null,
        isService && selectedService ? selectedService.id : null,
    );

    const tipValue = parseFloat(tip) || 0;
    const originalPrice = isService
        ? (loyaltyStatus?.original_price ?? selectedService?.price ?? 0)
        : (selectedProduct?.price ?? 0);
    const discountAmount = (isService && loyaltyStatus?.has_discount) ? (loyaltyStatus.discount_amount ?? 0) : 0;
    const totalBeforeTip = originalPrice - discountAmount;
    const totalWithTip = totalBeforeTip + tipValue;

    const handleOpenSaleModal = () => {
        setCurrentStep(1);
        setTab('services');
        setSelectedService(null);
        setSelectedProduct(null);
        setSelectedCustomer(null);
        setCustomerSearch('');
        setPaymentMethod('PIX');
        setTip('');
        setIsSaleModalOpen(true);
    };

    const handleSelectItem = (item: Service | Product) => {
        if (isService) {
            setSelectedService(item as Service);
            setSelectedProduct(null);
        } else {
            setSelectedProduct(item as Product);
            setSelectedService(null);
        }
        setCurrentStep(2);
    };

    const handleSelectCustomer = (customer: Customer) => {
        setSelectedCustomer(customer);
        setCustomerSearch('');
        setCurrentStep(3);
    };

    const handleSkipCustomer = () => {
        setSelectedCustomer(null);
        setCurrentStep(3);
    };

    const handleConfirmSale = () => {
        if (isService && selectedService) {
            registerService({
                service_id: selectedService.id,
                payment_method: paymentMethod,
                customer_id: selectedCustomer?.id,
                tip: tipValue > 0 ? tipValue : undefined,
            }, {
                onSuccess: () => {
                    setIsSaleModalOpen(false);
                }
            });
        } else if (selectedProduct) {
            registerProduct({
                product_id: selectedProduct.id,
                payment_method: paymentMethod,
                customer_id: selectedCustomer?.id,
                tip: tipValue > 0 ? tipValue : undefined,
            }, {
                onSuccess: () => {
                    setIsSaleModalOpen(false);
                }
            });
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Atendimentos Recentes</Text>
                    <Text style={styles.headerDescription}>
                        Últimos 10 registros
                    </Text>
                </View>

                {/* Recent Appointments */}
                {recentAppointments.length === 0 ? (
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIcon}>
                            <Ionicons name="receipt-outline" size={48} color="#a1a1aa" />
                        </View>
                        <Text style={styles.emptyTitle}>Nenhuma venda registrada</Text>
                        <Text style={styles.emptyDescription}>
                            Registre sua primeira venda usando o botão abaixo
                        </Text>
                    </View>
                ) : (
                    <View style={styles.appointmentsList}>
                        {recentAppointments.map((appointment) => (
                            <AppointmentCard
                                key={appointment.id}
                                appointment={appointment}
                                showBarberName={isAdmin}
                                showCustomerName={isAdmin}
                            />
                        ))}
                    </View>
                )}
            </ScrollView>

            <TouchableOpacity style={styles.fab} onPress={handleOpenSaleModal}>
                <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>

            {/* Sale Modal */}
            <Modal.Root open={isSaleModalOpen} onClose={() => !isRegistering && setIsSaleModalOpen(false)}>
                <Modal.Content>
                    <Modal.Header onClose={() => !isRegistering && setIsSaleModalOpen(false)}>
                        Registrar Venda
                    </Modal.Header>

                    <StepIndicator steps={STEPS} currentStep={currentStep} />

                    <Modal.Body>
                        <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                            {/* STEP 1 - Selecionar Item */}
                            {currentStep === 1 && (
                                <View style={styles.stepContent}>
                                    {/* Tabs */}
                                    <View style={styles.tabs}>
                                        {(['services', 'products'] as TabType[]).map(t => (
                                            <TouchableOpacity
                                                key={t}
                                                onPress={() => setTab(t)}
                                                style={[styles.tab, tab === t && styles.tabActive]}
                                            >
                                                <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                                                    {t === 'services' ? 'Serviços' : 'Produtos'}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>

                                    {/* Items List */}
                                    {(isService ? loadingServices : loadingProducts) ? (
                                        <ActivityIndicator color="#f59e0b" />
                                    ) : (
                                        <View style={styles.itemsList}>
                                            {(isService ? services : products)?.map(item => (
                                                <TouchableOpacity
                                                    key={item.id}
                                                    onPress={() => handleSelectItem(item)}
                                                    style={styles.itemCard}
                                                >
                                                    <View style={styles.itemCardLeft}>
                                                        <View style={[styles.itemIcon, isService ? styles.itemIconService : styles.itemIconProduct]}>
                                                            <Ionicons
                                                                name={isService ? 'cut' : 'cube-outline'}
                                                                size={20}
                                                                color={isService ? '#f59e0b' : '#6366f1'}
                                                            />
                                                        </View>
                                                        <View style={styles.itemCardInfo}>
                                                            <Text style={styles.itemName}>{item.name}</Text>
                                                            <Text style={styles.itemCommission}>
                                                                Comissão: {item.commission_percentage}%
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            )}

                            {/* STEP 2 - Selecionar Cliente */}
                            {currentStep === 2 && (
                                <View style={styles.stepContent}>
                                    <Text style={styles.stepTitle}>
                                        Selecionar Cliente {!isService && '(Opcional)'}
                                    </Text>

                                    {selectedItem && (
                                        <View style={styles.selectedItemCard}>
                                            <Ionicons
                                                name={isService ? 'cut' : 'cube-outline'}
                                                size={20}
                                                color="#71717a"
                                            />
                                            <Text style={styles.selectedItemText}>{selectedItem.name}</Text>
                                            <Text style={styles.selectedItemPrice}>
                                                {formatCurrency(selectedItem.price)}
                                            </Text>
                                        </View>
                                    )}

                                    <Input.Root>
                                        <Input.Field
                                            placeholder="Buscar cliente por nome ou telefone..."
                                            value={customerSearch}
                                            onChangeText={setCustomerSearch}
                                        />
                                    </Input.Root>

                                    {searchingCustomers && (
                                        <ActivityIndicator size="small" color="#f59e0b" />
                                    )}

                                    {customerSearch.length > 0 && searchResults && (
                                        <View style={styles.customerResults}>
                                            {searchResults.length === 0 ? (
                                                <Text style={styles.noResults}>Nenhum cliente encontrado</Text>
                                            ) : (
                                                searchResults.map(customer => (
                                                    <TouchableOpacity
                                                        key={customer.id}
                                                        onPress={() => handleSelectCustomer(customer)}
                                                        style={styles.customerResult}
                                                    >
                                                        <View style={styles.customerResultInfo}>
                                                            <Text style={styles.customerResultName}>
                                                                {customer.name}
                                                            </Text>
                                                            <Text style={styles.customerResultPhone}>
                                                                {customer.phone_number}
                                                            </Text>
                                                        </View>
                                                        <Ionicons name="chevron-forward" size={20} color="#a1a1aa" />
                                                    </TouchableOpacity>
                                                ))
                                            )}
                                        </View>
                                    )}

                                    <TouchableOpacity onPress={handleSkipCustomer} style={styles.skipButton}>
                                        <Text style={styles.skipText}>Continuar sem cliente</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {/* STEP 3 - Pagamento */}
                            {currentStep === 3 && (
                                <View style={styles.stepContent}>
                                    <Text style={styles.stepTitle}>Resumo da Venda</Text>

                                    {/* Summary */}
                                    <View style={styles.summary}>
                                        <View style={styles.summaryRow}>
                                            <Text style={styles.summaryLabel}>Item</Text>
                                            <Text style={styles.summaryValue}>{selectedItem?.name}</Text>
                                        </View>
                                        {selectedCustomer && (
                                            <View style={styles.summaryRow}>
                                                <Text style={styles.summaryLabel}>Cliente</Text>
                                                <Text style={styles.summaryValue}>{selectedCustomer.name}</Text>
                                            </View>
                                        )}
                                        <View style={styles.summaryRow}>
                                            <Text style={styles.summaryLabel}>Preço</Text>
                                            <Text style={styles.summaryValue}>{formatCurrency(originalPrice)}</Text>
                                        </View>
                                        {discountAmount > 0 && (
                                            <View style={styles.summaryRow}>
                                                <Text style={styles.discountLabel}>Desconto Fidelidade</Text>
                                                <Text style={styles.discountValue}>- {formatCurrency(discountAmount)}</Text>
                                            </View>
                                        )}
                                    </View>

                                    {/* Loyalty Alert */}
                                    {isService && selectedCustomer && loyaltyStatus?.has_discount && (
                                        <View style={styles.loyaltyAlert}>
                                            <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
                                            <View style={styles.loyaltyAlertContent}>
                                                <Text style={styles.loyaltyAlertTitle}>
                                                    🎉 Desconto de Fidelidade!
                                                </Text>
                                                <Text style={styles.loyaltyAlertText}>
                                                    Cliente ganhou 50% de desconto neste serviço
                                                </Text>
                                            </View>
                                        </View>
                                    )}

                                    {/* Payment Method */}
                                    <View>
                                        <Text style={styles.selectLabel}>Forma de Pagamento</Text>
                                        <View style={styles.paymentGrid}>
                                            {PAYMENT_METHODS.map(pm => (
                                                <TouchableOpacity
                                                    key={pm.value}
                                                    onPress={() => setPaymentMethod(pm.value)}
                                                    style={[
                                                        styles.paymentOption,
                                                        paymentMethod === pm.value && styles.paymentOptionActive,
                                                    ]}
                                                >
                                                    <Text style={[
                                                        styles.paymentOptionText,
                                                        paymentMethod === pm.value && styles.paymentOptionTextActive,
                                                    ]}>
                                                        {pm.label}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>

                                    {/* Tip */}
                                    <Input.Root>
                                        <Input.Label>Gorjeta (Opcional)</Input.Label>
                                        <Input.Field
                                            placeholder="R$ 0,00"
                                            value={tip}
                                            onChangeText={setTip}
                                            keyboardType="decimal-pad"
                                        />
                                    </Input.Root>

                                    {/* Final Total */}
                                    <View style={styles.totalCard}>
                                        <Text style={styles.totalLabel}>Total Final</Text>
                                        <Text style={[styles.totalValue, discountAmount > 0 && styles.totalValueDiscount]}>
                                            {formatCurrency(totalWithTip)}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </ScrollView>
                    </Modal.Body>

                    <Modal.Footer>
                        {currentStep > 1 && (
                            <Button.Root
                                variant="secondary"
                                onPress={handlePrevStep}
                                disabled={isRegistering}
                            >
                                <Button.Text variant="secondary">Voltar</Button.Text>
                            </Button.Root>
                        )}

                        {currentStep === 3 && (
                            <Button.Root
                                onPress={handleConfirmSale}
                                isLoading={isRegistering}
                                disabled={isRegistering}
                            >
                                <Button.Text>Confirmar Venda</Button.Text>
                            </Button.Root>
                        )}
                    </Modal.Footer>
                </Modal.Content>
            </Modal.Root>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    scrollView: { flex: 1 },
    content: { padding: 16, gap: 16, paddingBottom: 80 },
    header: { gap: 4 },
    headerTitle: { fontSize: 20, fontWeight: '700', color: '#18181b' },
    headerDescription: { fontSize: 14, color: '#71717a' },
    emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 64, gap: 12 },
    emptyIcon: { width: 80, height: 80, backgroundColor: '#f4f4f5', borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
    emptyTitle: { fontSize: 18, fontWeight: '600', color: '#18181b' },
    emptyDescription: { fontSize: 14, color: '#71717a', textAlign: 'center', paddingHorizontal: 32 },
    appointmentsList: { gap: 12 },
    fab: { position: 'absolute', right: 16, bottom: 16, width: 56, height: 56, backgroundColor: '#18181b', borderRadius: 28, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
    modalScroll: { maxHeight: 450 },
    stepContent: { gap: 16 },
    stepTitle: { fontSize: 16, fontWeight: '600', color: '#18181b' },
    tabs: { flexDirection: 'row', borderRadius: 8, backgroundColor: '#f4f4f5', padding: 4 },
    tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
    tabActive: { backgroundColor: '#fff' },
    tabText: { fontSize: 14, fontWeight: '600', color: '#71717a' },
    tabTextActive: { color: '#18181b' },
    itemsList: { gap: 8 },
    itemCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#e4e4e7', backgroundColor: '#fff' },
    itemCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
    itemIcon: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
    itemIconService: { backgroundColor: '#fffbeb' },
    itemIconProduct: { backgroundColor: '#eef2ff' },
    itemCardInfo: { flex: 1 },
    itemName: { fontSize: 14, fontWeight: '600', color: '#18181b' },
    itemCommission: { fontSize: 12, color: '#71717a' },
    itemPrice: { fontSize: 15, fontWeight: '700', color: '#18181b' },
    selectedItemCard: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 8, backgroundColor: '#f4f4f5' },
    selectedItemText: { flex: 1, fontSize: 14, fontWeight: '600', color: '#18181b' },
    selectedItemPrice: { fontSize: 14, fontWeight: '700', color: '#f59e0b' },
    customerResults: { gap: 8, maxHeight: 200 },
    customerResult: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, borderRadius: 8, backgroundColor: '#f4f4f5' },
    customerResultInfo: { flex: 1 },
    customerResultName: { fontSize: 14, fontWeight: '600', color: '#18181b' },
    customerResultPhone: { fontSize: 12, color: '#71717a' },
    noResults: { fontSize: 14, color: '#a1a1aa', textAlign: 'center', paddingVertical: 20 },
    skipButton: { paddingVertical: 8 },
    skipText: { fontSize: 14, color: '#f59e0b', fontWeight: '600', textAlign: 'center', textDecorationLine: 'underline' },
    summary: { backgroundColor: '#f4f4f5', borderRadius: 8, padding: 12, gap: 8 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    summaryLabel: { fontSize: 14, color: '#71717a' },
    summaryValue: { fontSize: 14, fontWeight: '600', color: '#18181b' },
    discountLabel: { fontSize: 14, color: '#16a34a', fontWeight: '600' },
    discountValue: { fontSize: 14, fontWeight: '700', color: '#16a34a' },
    loyaltyAlert: { flexDirection: 'row', gap: 12, backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#bbf7d0', borderRadius: 8, padding: 12 },
    loyaltyAlertContent: { flex: 1, gap: 4 },
    loyaltyAlertTitle: { fontSize: 14, fontWeight: '600', color: '#166534' },
    loyaltyAlertText: { fontSize: 13, color: '#15803d' },
    selectLabel: { fontSize: 14, fontWeight: '600', color: '#18181b', marginBottom: 8 },
    paymentGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    paymentOption: { flex: 1, minWidth: '45%', paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#e4e4e7', alignItems: 'center', backgroundColor: '#fff' },
    paymentOptionActive: { borderColor: '#f59e0b', backgroundColor: '#fffbeb' },
    paymentOptionText: { fontSize: 14, fontWeight: '600', color: '#71717a' },
    paymentOptionTextActive: { color: '#f59e0b' },
    totalCard: { backgroundColor: '#18181b', borderRadius: 8, padding: 16, alignItems: 'center', gap: 4 },
    totalLabel: { fontSize: 14, color: '#a1a1aa', fontWeight: '600' },
    totalValue: { fontSize: 28, fontWeight: '700', color: '#fff' },
    totalValueDiscount: { color: '#16a34a' },
});