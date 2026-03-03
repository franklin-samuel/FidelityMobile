import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useServices, useCreateService, useUpdateService, useDeleteService } from '../../../hooks/useService';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../../../hooks/useProduct';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { Modal } from '../../../components/Modal';
import type { Service } from '../../../types/service';
import type { Product } from '../../../types/product';

type TabType = 'services' | 'products';

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

interface ItemFormData {
    name: string;
    price: string;
    commission_percentage: string;
}

const emptyForm: ItemFormData = { name: '', price: '', commission_percentage: '' };

export default function CatalogPage() {
    const [tab, setTab] = useState<TabType>('services');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Service | Product | null>(null);
    const [deletingItem, setDeletingItem] = useState<Service | Product | null>(null);
    const [form, setForm] = useState<ItemFormData>(emptyForm);

    const { data: services, isLoading: loadingServices } = useServices();
    const { data: products, isLoading: loadingProducts } = useProducts();
    const { mutate: createService, isPending: creatingService } = useCreateService();
    const { mutate: updateService, isPending: updatingService } = useUpdateService();
    const { mutate: deleteService, isPending: deletingService } = useDeleteService();
    const { mutate: createProduct, isPending: creatingProduct } = useCreateProduct();
    const { mutate: updateProduct, isPending: updatingProduct } = useUpdateProduct();
    const { mutate: deleteProduct, isPending: deletingProduct } = useDeleteProduct();

    const isService = tab === 'services';
    const isLoading = isService ? loadingServices : loadingProducts;
    const items = isService ? services : products;
    const isSaving = isService ? (creatingService || updatingService) : (creatingProduct || updatingProduct);
    const isDeleting = isService ? deletingService : deletingProduct;

    const handleOpenCreate = () => {
        setEditingItem(null);
        setForm(emptyForm);
        setIsFormModalOpen(true);
    };

    const handleOpenEdit = (item: Service | Product) => {
        setEditingItem(item);
        setForm({
            name: item.name,
            price: String(item.price),
            commission_percentage: String(item.commission_percentage),
        });
        setIsFormModalOpen(true);
    };

    const handleSubmit = () => {
        const payload = {
            name: form.name,
            price: parseFloat(form.price),
            commission_percentage: parseFloat(form.commission_percentage),
        };

        if (editingItem) {
            if (isService) {
                updateService({ id: editingItem.id, data: payload }, { onSuccess: () => setIsFormModalOpen(false) });
            } else {
                updateProduct({ id: editingItem.id, data: payload }, { onSuccess: () => setIsFormModalOpen(false) });
            }
        } else {
            if (isService) {
                createService(payload, { onSuccess: () => { setIsFormModalOpen(false); setForm(emptyForm); } });
            } else {
                createProduct(payload, { onSuccess: () => { setIsFormModalOpen(false); setForm(emptyForm); } });
            }
        }
    };

    const handleDelete = () => {
        if (!deletingItem) return;
        if (isService) {
            deleteService(deletingItem.id, { onSuccess: () => { setIsDeleteModalOpen(false); setDeletingItem(null); } });
        } else {
            deleteProduct(deletingItem.id, { onSuccess: () => { setIsDeleteModalOpen(false); setDeletingItem(null); } });
        }
    };

    return (
        <View style={styles.container}>
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

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                {isLoading ? (
                    <View style={styles.loadingList}>
                        {[1, 2, 3].map(i => <View key={i} style={styles.skeleton} />)}
                    </View>
                ) : !items || items.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="cube-outline" size={48} color="#a1a1aa" />
                        <Text style={styles.emptyTitle}>
                            Nenhum {isService ? 'serviço' : 'produto'} cadastrado
                        </Text>
                    </View>
                ) : (
                    items.map(item => (
                        <View key={item.id} style={styles.card}>
                            <View style={styles.cardInfo}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <Text style={styles.itemCommission}>Comissão: {item.commission_percentage}%</Text>
                            </View>
                            <View style={styles.cardActions}>
                                <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
                                <TouchableOpacity onPress={() => handleOpenEdit(item)} style={styles.actionButton}>
                                    <Ionicons name="pencil-outline" size={18} color="#71717a" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => { setDeletingItem(item); setIsDeleteModalOpen(true); }}
                                    style={styles.actionButton}
                                >
                                    <Ionicons name="trash-outline" size={18} color="#ef4444" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

            <TouchableOpacity style={styles.fab} onPress={handleOpenCreate}>
                <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>

            {/* Form Modal */}
            <Modal.Root open={isFormModalOpen} onClose={() => !isSaving && setIsFormModalOpen(false)}>
                <Modal.Content>
                    <Modal.Header onClose={() => !isSaving && setIsFormModalOpen(false)}>
                        {editingItem
                            ? `Editar ${isService ? 'Serviço' : 'Produto'}`
                            : `Novo ${isService ? 'Serviço' : 'Produto'}`
                        }
                    </Modal.Header>
                    <Modal.Body>
                        <View style={styles.modalForm}>
                            <Input.Root>
                                <Input.Label required>Nome</Input.Label>
                                <Input.Field
                                    placeholder="Ex: Corte simples"
                                    value={form.name}
                                    onChangeText={text => setForm({ ...form, name: text })}
                                />
                            </Input.Root>
                            <Input.Root>
                                <Input.Label required>Preço (R$)</Input.Label>
                                <Input.Field
                                    placeholder="0,00"
                                    value={form.price}
                                    onChangeText={text => setForm({ ...form, price: text })}
                                    keyboardType="decimal-pad"
                                />
                            </Input.Root>
                            <Input.Root>
                                <Input.Label required>Comissão (%)</Input.Label>
                                <Input.Field
                                    placeholder="0"
                                    value={form.commission_percentage}
                                    onChangeText={text => setForm({ ...form, commission_percentage: text })}
                                    keyboardType="decimal-pad"
                                />
                            </Input.Root>
                        </View>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Root variant="secondary" onPress={() => setIsFormModalOpen(false)} disabled={isSaving}>
                            <Button.Text variant="secondary">Cancelar</Button.Text>
                        </Button.Root>
                        <Button.Root onPress={handleSubmit} isLoading={isSaving} disabled={isSaving}>
                            <Button.Text>Salvar</Button.Text>
                        </Button.Root>
                    </Modal.Footer>
                </Modal.Content>
            </Modal.Root>

            {/* Delete Modal */}
            <Modal.Root open={isDeleteModalOpen} onClose={() => !isDeleting && setIsDeleteModalOpen(false)}>
                <Modal.Content>
                    <Modal.Header onClose={() => !isDeleting && setIsDeleteModalOpen(false)}>
                        Confirmar Exclusão
                    </Modal.Header>
                    <Modal.Body>
                        <Text style={styles.deleteText}>
                            Tem certeza que deseja deletar{' '}
                            <Text style={styles.deleteNameHighlight}>{deletingItem?.name}</Text>?
                            Esta ação não pode ser desfeita.
                        </Text>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Root variant="secondary" onPress={() => setIsDeleteModalOpen(false)} disabled={isDeleting}>
                            <Button.Text variant="secondary">Cancelar</Button.Text>
                        </Button.Root>
                        <Button.Root variant="danger" onPress={handleDelete} isLoading={isDeleting} disabled={isDeleting}>
                            <Button.Text variant="danger">Deletar</Button.Text>
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
    content: { padding: 16, gap: 12, paddingBottom: 80 },
    loadingList: { gap: 12 },
    skeleton: { height: 64, backgroundColor: '#f4f4f5', borderRadius: 12 },
    emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 64, gap: 12 },
    emptyTitle: { fontSize: 18, fontWeight: '600', color: '#18181b' },
    card: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e4e4e7', padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    cardInfo: { flex: 1 },
    itemName: { fontSize: 15, fontWeight: '600', color: '#18181b' },
    itemCommission: { fontSize: 13, color: '#71717a', marginTop: 2 },
    cardActions: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    itemPrice: { fontSize: 16, fontWeight: '700', color: '#18181b', marginRight: 8 },
    actionButton: { padding: 8 },
    fab: { position: 'absolute', right: 16, bottom: 16, width: 56, height: 56, backgroundColor: '#18181b', borderRadius: 28, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
    modalForm: { gap: 16 },
    deleteText: { fontSize: 15, color: '#18181b', lineHeight: 22 },
    deleteNameHighlight: { fontWeight: '700' },
});