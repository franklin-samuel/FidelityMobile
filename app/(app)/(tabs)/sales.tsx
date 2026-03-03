import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useServices } from '../../../hooks/useService';
import { useProducts } from '../../../hooks/useProduct';
import { useSearchCustomers } from '../../../hooks/useCustomer';
import { useLoyaltyStatus } from '../../../hooks/useLoyalty';
import { useRegisterServiceAppointment, useRegisterProductAppointment } from '../../../hooks/useAppointment';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { Modal } from '../../../components/Modal';
import type { Service } from '../../../types/service';
import type { Product } from '../../../types/product';
import type { Customer } from '../../../types/customer';
import type { PaymentMethod } from '../../../types/appointment';

type TabType = 'services' | 'products';
type SaleStep = 'select-item' | 'select-customer' | 'confirm';

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
    { value: 'PIX', label: 'Pix' },
    { value: 'MONEY', label: 'Dinheiro' },
    { value: 'CREDIT', label: 'Crédito' },
    { value: 'DEBIT', label: 'Débito' },
];

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export default function SalesPage() {
    const [tab, setTab] = useState<TabType>('services');
    const [step, setStep] = useState<SaleStep>('select-item');
    const [itemSearch, setItemSearch] = useState('');
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [customerSearch, setCustomerSearch] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');
    const [tip, setTip] = useState('');
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const { data: services, isLoading: loadingServices } = useServices();
    const { data: products, isLoading: loadingProducts } = useProducts();
    const { data: searchResults, isLoading: searchingCustomers } = useSearchCustomers(customerSearch);
    const { mutate: registerService, isPending: registeringService } = useRegisterServiceAppointment();
    const { mutate: registerProduct, isPending: registeringProduct } = useRegisterProductAppointment();

    const isService = tab === 'services';
    const selectedItem = isService ? selectedService : selectedProduct;
    const isRegistering = registeringService || registeringProduct;

    const filteredItems = useMemo(() => {
        const items = isService ? services : products;
        if (!items) return [];
        if (!itemSearch.trim()) return items;
        return items.filter(i => i.name.toLowerCase().includes(itemSearch.toLowerCase()));
    }, [services, products, isService, itemSearch]);

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

    const handleSelectItem = (item: Service | Product) => {
        if (isService) { setSelectedService(item as Service); setSelectedProduct(null); }
        else { setSelectedProduct(item as Product); setSelectedService(null); }
        setSelectedCustomer(null);
        setCustomerSearch('');
        setStep('select-customer');
    };

    const handleSelectCustomer = (customer: Customer) => {
        setSelectedCustomer(customer);
        setCustomerSearch('');
        setStep('confirm');
    };

    const handleConfirm = () => {
        if (isService && selectedService) {
            registerService({
                service_id: selectedService.id,
                payment_method: paymentMethod,
                customer_id: selectedCustomer?.id,
                tip: tipValue > 0 ? tipValue : undefined,
            }, { onSuccess: () => { resetAll(); setIsConfirmOpen(false); } });
        } else if (selectedProduct) {
            registerProduct({
                product_id: selectedProduct.id,
                payment_method: paymentMethod,
                customer_id: selectedCustomer?.id,
                tip: tipValue > 0 ? tipValue : undefined,
            }, { onSuccess: () => { resetAll(); setIsConfirmOpen(false); } });
        }
    };

    const resetAll = () => {
        setSelectedService(null); setSelectedProduct(null); setSelectedCustomer(null);
        setCustomerSearch(''); setItemSearch(''); setPaymentMethod('PIX'); setTip('');
        setStep('select-item');
    };

    return (
        <View style={styles.container}>
            {/* Tabs */}
            <View style={styles.tabs}>
                {(['services', 'products'] as TabType[]).map(t => (
                    <TouchableOpacity
                        key={t}
                        onPress={() => { setTab(t); resetAll(); }}
                        style={[styles.tab, tab === t && styles.tabActive]}
                    >
                        <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                            {t === 'services' ? 'Serviços' : 'Produtos'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                {/* Item search */}
                <Input.Root>
                    <Input.Container>
                        <Input.Icon><Ionicons name="search" size={20} color="#71717a" /></Input.Icon>
                        <Input.Field
                            placeholder={`Buscar ${isService ? 'serviço' : 'produto'}...`}
                            value={itemSearch}
                            onChangeText={setItemSearch}
                            style={styles.searchInput}
                        />
                    </Input.Container>
                </Input.Root>

                {/* Items list */}
                {(isService ? loadingServices : loadingProducts) ? (
                    <ActivityIndicator color="#f59e0b" />
                ) : filteredItems.length === 0 ? (
                    <Text style={styles.emptyText}>
                        Nenhum {isService ? 'serviço' : 'produto'} encontrado
                    </Text>
                ) : (
                    filteredItems.map(item => {
                        const isSelected = isService
                            ? selectedService?.id === item.id
                            : selectedProduct?.id === item.id;

                        return (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => handleSelectItem(item)}
                                style={[styles.itemCard, isSelected && styles.itemCardSelected]}
                            >
                                <View>
                                    <Text style={styles.itemName}>{item.name}</Text>
                                    <Text style={styles.itemCommission}>Comissão: {item.commission_percentage}%</Text>
                                </View>
                                <Text style={[styles.itemPrice, isSelected && styles.itemPriceSelected]}>
                                    {formatCurrency(item.price)}
                                </Text>
                            </TouchableOpacity>
                        );
                    })
                )}

                {/* Summary panel */}
                {selectedItem && (
                    <View style={styles.summaryCard}>
                        <View style={styles.summaryHeader}>
                            <Text style={styles.summaryTitle}>Resumo</Text>
                            <TouchableOpacity onPress={resetAll}>
                                <Text style={styles.clearText}>Limpar</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>{selectedItem.name}</Text>
                            <Text style={styles.summaryValue}>{formatCurrency(selectedItem.price)}</Text>
                        </View>

                        {/* Step: select customer */}
                        {(step === 'select-customer' || step === 'confirm') && (
                            <View style={styles.summarySection}>
                                <Text style={styles.summarySectionTitle}>
                                    Cliente {!isService ? '(opcional)' : ''}
                                </Text>

                                {step === 'select-customer' ? (
                                    <View style={styles.customerSearch}>
                                        <Input.Root>
                                            <Input.Field
                                                placeholder="Buscar cliente..."
                                                value={customerSearch}
                                                onChangeText={setCustomerSearch}
                                            />
                                        </Input.Root>
                                        {searchingCustomers && <ActivityIndicator size="small" color="#f59e0b" />}
                                        {customerSearch.length > 0 && searchResults && (
                                            <View style={styles.customerResults}>
                                                {searchResults.length === 0 ? (
                                                    <Text style={styles.emptyText}>Nenhum cliente encontrado</Text>
                                                ) : searchResults.map(c => (
                                                    <TouchableOpacity
                                                        key={c.id}
                                                        onPress={() => handleSelectCustomer(c)}
                                                        style={styles.customerResult}
                                                    >
                                                        <Text style={styles.customerResultName}>{c.name}</Text>
                                                        <Text style={styles.customerResultPhone}>{c.phone_number}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                        )}
                                        <TouchableOpacity onPress={() => setStep('confirm')}>
                                            <Text style={styles.skipText}>Continuar sem cliente</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <View style={styles.selectedCustomerRow}>
                                        <View>
                                            {selectedCustomer ? (
                                                <>
                                                    <Text style={styles.selectedCustomerName}>{selectedCustomer.name}</Text>
                                                    <Text style={styles.selectedCustomerPhone}>{selectedCustomer.phone_number}</Text>
                                                </>
                                            ) : (
                                                <Text style={styles.noCustomer}>Sem cliente</Text>
                                            )}
                                        </View>
                                        <TouchableOpacity onPress={() => setStep('select-customer')}>
                                            <Text style={styles.changeText}>Alterar</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        )}

                        {/* Loyalty */}
                        {step === 'confirm' && isService && selectedCustomer && (
                            <View style={styles.summarySection}>
                                {loadingLoyalty ? (
                                    <ActivityIndicator size="small" color="#f59e0b" />
                                ) : loyaltyStatus?.has_discount ? (
                                    <View style={styles.loyaltyBox}>
                                        <Text style={styles.loyaltyTitle}>🎉 Desconto de fidelidade!</Text>
                                        <View style={styles.loyaltyRow}>
                                            <Text style={styles.loyaltyLabel}>Preço original</Text>
                                            <Text style={styles.loyaltyValue}>{formatCurrency(loyaltyStatus.original_price ?? 0)}</Text>
                                        </View>
                                        <View style={styles.loyaltyRow}>
                                            <Text style={styles.loyaltyDiscount}>Desconto (50%)</Text>
                                            <Text style={styles.loyaltyDiscount}>- {formatCurrency(loyaltyStatus.discount_amount ?? 0)}</Text>
                                        </View>
                                    </View>
                                ) : loyaltyStatus ? (
                                    <Text style={styles.loyaltyInfo}>
                                        Fidelidade: {loyaltyStatus.service_count} cortes acumulados
                                    </Text>
                                ) : null}
                            </View>
                        )}

                        {/* Confirm step */}
                        {step === 'confirm' && (
                            <View style={styles.summarySection}>
                                {discountAmount > 0 && (
                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryLabel}>Subtotal com desconto</Text>
                                        <Text style={styles.summaryValue}>{formatCurrency(totalBeforeTip)}</Text>
                                    </View>
                                )}
                                <View style={[styles.summaryRow, styles.summaryTotal]}>
                                    <Text style={styles.summaryTotalLabel}>Total</Text>
                                    <Text style={[styles.summaryTotalValue, discountAmount > 0 && styles.discountedTotal]}>
                                        {formatCurrency(totalWithTip)}
                                    </Text>
                                </View>
                                <Button.Root onPress={() => setIsConfirmOpen(true)} style={styles.finishButton}>
                                    <Button.Text>Finalizar Venda</Button.Text>
                                </Button.Root>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>

            {/* Confirm Modal */}
            <Modal.Root open={isConfirmOpen} onClose={() => !isRegistering && setIsConfirmOpen(false)}>
                <Modal.Content>
                    <Modal.Header onClose={() => !isRegistering && setIsConfirmOpen(false)}>
                        Confirmar Venda
                    </Modal.Header>
                    <Modal.Body>
                        <View style={styles.modalContent}>
                            {/* Summary */}
                            <View style={styles.modalSummary}>
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
                                {discountAmount > 0 && (
                                    <View style={styles.summaryRow}>
                                        <Text style={styles.loyaltyDiscount}>Desconto</Text>
                                        <Text style={styles.loyaltyDiscount}>- {formatCurrency(discountAmount)}</Text>
                                    </View>
                                )}
                                <View style={[styles.summaryRow, styles.summaryTotal]}>
                                    <Text style={styles.summaryTotalLabel}>Total (sem gorjeta)</Text>
                                    <Text style={styles.summaryTotalValue}>{formatCurrency(totalBeforeTip)}</Text>
                                </View>
                            </View>

                            {/* Payment method */}
                            <Text style={styles.paymentTitle}>Meio de pagamento</Text>
                            <View style={styles.paymentGrid}>
                                {PAYMENT_METHODS.map(pm => (
                                    <TouchableOpacity
                                        key={pm.value}
                                        onPress={() => setPaymentMethod(pm.value)}
                                        style={[styles.paymentOption, paymentMethod === pm.value && styles.paymentOptionSelected]}
                                    >
                                        <Text style={[styles.paymentOptionText, paymentMethod === pm.value && styles.paymentOptionTextSelected]}>
                                            {pm.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Tip */}
                            <Input.Root>
                                <Input.Label>Gorjeta (opcional)</Input.Label>
                                <Input.Field
                                    placeholder="R$ 0,00"
                                    value={tip}
                                    onChangeText={setTip}
                                    keyboardType="decimal-pad"
                                />
                            </Input.Root>

                            {/* Final total */}
                            <View style={[styles.summaryRow, styles.finalTotal]}>
                                <Text style={styles.finalTotalLabel}>Total final</Text>
                                <Text style={[styles.finalTotalValue, discountAmount > 0 && styles.discountedTotal]}>
                                    {formatCurrency(totalWithTip)}
                                </Text>
                            </View>
                        </View>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Root variant="secondary" onPress={() => setIsConfirmOpen(false)} disabled={isRegistering}>
                            <Button.Text variant="secondary">Cancelar</Button.Text>
                        </Button.Root>
                        <Button.Root onPress={handleConfirm} isLoading={isRegistering} disabled={isRegistering}>
                            <Button.Text>Confirmar</Button.Text>
                        </Button.Root>
                    </Modal.Footer>
                </Modal.Content>
            </Modal.Root>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e4e4e7' },
    tab: { flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
    tabActive: { borderBottomColor: '#f59e0b' },
    tabText: { fontSize: 14, fontWeight: '600', color: '#71717a' },
    tabTextActive: { color: '#f59e0b' },
    scrollView: { flex: 1 },
    content: { padding: 16, gap: 12, paddingBottom: 40 },
    searchInput: { paddingLeft: 40 },
    emptyText: { fontSize: 14, color: '#a1a1aa', textAlign: 'center', paddingVertical: 16 },
    itemCard: { borderWidth: 1, borderColor: '#e4e4e7', borderRadius: 12, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff' },
    itemCardSelected: { borderColor: '#f59e0b', backgroundColor: '#fffbeb' },
    itemName: { fontSize: 15, fontWeight: '600', color: '#18181b' },
    itemCommission: { fontSize: 13, color: '#71717a', marginTop: 2 },
    itemPrice: { fontSize: 16, fontWeight: '700', color: '#18181b' },
    itemPriceSelected: { color: '#f59e0b' },
    summaryCard: { backgroundColor: '#f9f9f9', borderRadius: 12, borderWidth: 1, borderColor: '#e4e4e7', padding: 16, gap: 12 },
    summaryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    summaryTitle: { fontSize: 15, fontWeight: '700', color: '#18181b' },
    clearText: { fontSize: 13, color: '#a1a1aa' },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    summaryLabel: { fontSize: 14, color: '#71717a' },
    summaryValue: { fontSize: 14, fontWeight: '600', color: '#18181b' },
    summarySection: { borderTopWidth: 1, borderTopColor: '#e4e4e7', paddingTop: 12, gap: 8 },
    summarySectionTitle: { fontSize: 12, fontWeight: '700', color: '#71717a', textTransform: 'uppercase', letterSpacing: 0.5 },
    summaryTotal: { borderTopWidth: 1, borderTopColor: '#e4e4e7', paddingTop: 8, marginTop: 4 },
    summaryTotalLabel: { fontSize: 15, fontWeight: '700', color: '#18181b' },
    summaryTotalValue: { fontSize: 16, fontWeight: '700', color: '#18181b' },
    discountedTotal: { color: '#16a34a' },
    finishButton: { width: '100%', marginTop: 4 },
    customerSearch: { gap: 8 },
    customerResults: { gap: 4, maxHeight: 160 },
    customerResult: { padding: 10, backgroundColor: '#f4f4f5', borderRadius: 8 },
    customerResultName: { fontSize: 14, fontWeight: '600', color: '#18181b' },
    customerResultPhone: { fontSize: 12, color: '#71717a' },
    skipText: { fontSize: 13, color: '#a1a1aa', textDecorationLine: 'underline' },
    selectedCustomerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    selectedCustomerName: { fontSize: 14, fontWeight: '600', color: '#18181b' },
    selectedCustomerPhone: { fontSize: 12, color: '#71717a' },
    noCustomer: { fontSize: 14, color: '#a1a1aa' },
    changeText: { fontSize: 13, color: '#f59e0b', fontWeight: '600' },
    loyaltyBox: { backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#bbf7d0', borderRadius: 8, padding: 12, gap: 4 },
    loyaltyTitle: { fontSize: 13, fontWeight: '700', color: '#16a34a', marginBottom: 4 },
    loyaltyRow: { flexDirection: 'row', justifyContent: 'space-between' },
    loyaltyLabel: { fontSize: 13, color: '#71717a' },
    loyaltyValue: { fontSize: 13, color: '#71717a' },
    loyaltyDiscount: { fontSize: 13, color: '#16a34a', fontWeight: '600' },
    loyaltyInfo: { fontSize: 13, color: '#71717a' },
    modalContent: { gap: 16 },
    modalSummary: { backgroundColor: '#f4f4f5', borderRadius: 8, padding: 12, gap: 8 },
    paymentTitle: { fontSize: 14, fontWeight: '600', color: '#18181b' },
    paymentGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    paymentOption: { flex: 1, minWidth: '45%', paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#e4e4e7', alignItems: 'center' },
    paymentOptionSelected: { borderColor: '#f59e0b', backgroundColor: '#fffbeb' },
    paymentOptionText: { fontSize: 14, fontWeight: '600', color: '#71717a' },
    paymentOptionTextSelected: { color: '#f59e0b' },
    finalTotal: { borderTopWidth: 1, borderTopColor: '#e4e4e7', paddingTop: 12, marginTop: 4 },
    finalTotalLabel: { fontSize: 16, fontWeight: '700', color: '#18181b' },
    finalTotalValue: { fontSize: 18, fontWeight: '700', color: '#18181b' },
});