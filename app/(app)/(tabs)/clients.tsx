import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCustomers, useSearchCustomers, useCreateCustomer } from '../../../hooks/useCustomer';
import { useRegisterHaircut } from '../../../hooks/useHaircut';
import { useSettings } from '../../../hooks/useSettings';
import { Loading, CardSkeleton } from '../../../components/Loading';
import { CustomerCard } from '../../../components/CustomerCard';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { Modal } from '../../../components/Modal';
import type { Customer } from '../../../types/customer';

export default function ClientsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    const [newCustomer, setNewCustomer] = useState({
        name: '',
        email: '',
        phone_number: ''
    });

    const { data: allCustomers, isLoading: customersLoading } = useCustomers();
    const { data: searchResults, isLoading: searchLoading } = useSearchCustomers(searchTerm);
    const { data: settings } = useSettings();
    const { mutate: createCustomer, isPending: creating } = useCreateCustomer();
    const { mutate: registerHaircut, isPending: registering } = useRegisterHaircut();

    const haircutsForFree = settings?.haircuts_for_free || 10;

    const customers = searchTerm.length > 0 ? searchResults : allCustomers;

    React.useEffect(() => {
        if (searchTerm.length > 0) {
            setIsSearching(true);
            const timer = setTimeout(() => {
                setIsSearching(false);
            }, 300);
            return () => clearTimeout(timer);
        } else {
            setIsSearching(false);
        }
    }, [searchTerm]);

    const handleCreateCustomer = () => {
        createCustomer(newCustomer, {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                setNewCustomer({ name: '', email: '', phone_number: '' });
            }
        });
    };

    const handleRegisterHaircut = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsRegisterModalOpen(true);
    };

    const confirmRegisterHaircut = () => {
        if (!selectedCustomer) return;

        registerHaircut(selectedCustomer.id, {
            onSuccess: () => {
                setIsRegisterModalOpen(false);
                setSelectedCustomer(null);
            }
        });
    };

    if (customersLoading) {
        return <Loading fullScreen text="Carregando clientes..." />;
    }

    const showSearchLoader = isSearching || searchLoading;
    const hasCustomers = customers && customers.length > 0;

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
            >
                {/* Search */}
                <View style={styles.searchContainer}>
                    <Input.Root>
                        <Input.Container>
                            <Input.Icon>
                                {showSearchLoader ? (
                                    <ActivityIndicator size="small" color="#f59e0b" />
                                ) : (
                                    <Ionicons name="search" size={20} color="#71717a" />
                                )}
                            </Input.Icon>
                            <Input.Field
                                placeholder="Buscar por nome, telefone ou email..."
                                value={searchTerm}
                                onChangeText={setSearchTerm}
                            />
                            {searchTerm && (
                                <TouchableOpacity
                                    onPress={() => setSearchTerm('')}
                                    style={styles.clearButton}
                                >
                                    <Ionicons name="close-circle" size={20} color="#71717a" />
                                </TouchableOpacity>
                            )}
                        </Input.Container>
                    </Input.Root>

                    {searchTerm && hasCustomers && (
                        <Text style={styles.searchResults}>
                            {customers.length} {customers.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
                        </Text>
                    )}
                </View>

                {/* Customers List */}
                {!hasCustomers ? (
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIcon}>
                            <Ionicons name="people" size={48} color="#a1a1aa" />
                        </View>
                        <Text style={styles.emptyTitle}>
                            {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
                        </Text>
                        <Text style={styles.emptyDescription}>
                            {searchTerm
                                ? `Nenhum resultado para "${searchTerm}".`
                                : 'Comece adicionando seu primeiro cliente'
                            }
                        </Text>
                    </View>
                ) : (
                    <View style={styles.customersList}>
                        {customers.map((customer) => {
                            const isFreeReady = customer.haircut_count >= haircutsForFree;

                            return (
                                <CustomerCard.Root key={customer.id} isFreeReady={isFreeReady}>
                                    <CustomerCard.Header name={customer.name} isFreeReady={isFreeReady} />

                                    <View style={styles.customerInfo}>
                                        <CustomerCard.Info
                                            icon={<Ionicons name="call" size={16} color="#71717a" />}
                                        >
                                            {customer.phone_number}
                                        </CustomerCard.Info>

                                        <CustomerCard.Info
                                            icon={<Ionicons name="mail" size={16} color="#71717a" />}
                                        >
                                            {customer.email}
                                        </CustomerCard.Info>
                                    </View>

                                    <CustomerCard.Progress
                                        current={customer.haircut_count}
                                        total={haircutsForFree}
                                    />

                                    <CustomerCard.Claimed count={customer.free_haircuts_claimed} />

                                    <CustomerCard.Actions>
                                        <Button.Root
                                            variant={isFreeReady ? 'success' : 'primary'}
                                            onPress={() => handleRegisterHaircut(customer)}
                                            isLoading={registering && selectedCustomer?.id === customer.id}
                                        >
                                            <Button.Icon>
                                                <Ionicons name="cut" size={20} color="#fff" />
                                            </Button.Icon>
                                            <Button.Text variant={isFreeReady ? 'success' : 'primary'}>
                                                {isFreeReady ? 'Registrar Grátis' : 'Registrar Corte'}
                                            </Button.Text>
                                        </Button.Root>
                                    </CustomerCard.Actions>
                                </CustomerCard.Root>
                            );
                        })}
                    </View>
                )}
            </ScrollView>

            {/* Floating Add Button */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => setIsCreateModalOpen(true)}
            >
                <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>

            {/* Create Customer Modal */}
            <Modal.Root open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
                <Modal.Content>
                    <Modal.Header onClose={() => setIsCreateModalOpen(false)}>
                        Novo Cliente
                    </Modal.Header>

                    <Modal.Body>
                        <View style={styles.modalForm}>
                            <Input.Root>
                                <Input.Label required>Nome</Input.Label>
                                <Input.Field
                                    placeholder="Nome completo"
                                    value={newCustomer.name}
                                    onChangeText={(text) => setNewCustomer({ ...newCustomer, name: text })}
                                />
                            </Input.Root>

                            <Input.Root>
                                <Input.Label required>Email</Input.Label>
                                <Input.Field
                                    placeholder="email@exemplo.com"
                                    value={newCustomer.email}
                                    onChangeText={(text) => setNewCustomer({ ...newCustomer, email: text })}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </Input.Root>

                            <Input.Root>
                                <Input.Label required>Telefone</Input.Label>
                                <Input.Field
                                    placeholder="(00) 00000-0000"
                                    value={newCustomer.phone_number}
                                    onChangeText={(text) => setNewCustomer({ ...newCustomer, phone_number: text })}
                                    keyboardType="phone-pad"
                                />
                            </Input.Root>
                        </View>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button.Root
                            variant="secondary"
                            onPress={() => setIsCreateModalOpen(false)}
                            disabled={creating}
                        >
                            <Button.Text variant="secondary">Cancelar</Button.Text>
                        </Button.Root>

                        <Button.Root
                            onPress={handleCreateCustomer}
                            isLoading={creating}
                            disabled={creating}
                        >
                            <Button.Text>Salvar</Button.Text>
                        </Button.Root>
                    </Modal.Footer>
                </Modal.Content>
            </Modal.Root>

            {/* Register Haircut Modal */}
            <Modal.Root open={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)}>
                <Modal.Content>
                    <Modal.Header onClose={() => setIsRegisterModalOpen(false)}>
                        Confirmar Registro
                    </Modal.Header>

                    <Modal.Body>
                        {selectedCustomer && (
                            <View style={styles.confirmContent}>
                                <Text style={styles.confirmText}>
                                    Deseja registrar um corte para{' '}
                                    <Text style={styles.confirmName}>{selectedCustomer.name}</Text>?
                                </Text>

                                {selectedCustomer.haircut_count >= haircutsForFree && (
                                    <View style={styles.freeAlert}>
                                        <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
                                        <View style={styles.freeAlertContent}>
                                            <Text style={styles.freeAlertTitle}>
                                                Corte Grátis Disponível!
                                            </Text>
                                            <Text style={styles.freeAlertText}>
                                                Este corte será registrado como GRÁTIS e o contador será zerado.
                                            </Text>
                                        </View>
                                    </View>
                                )}
                            </View>
                        )}
                    </Modal.Body>

                    <Modal.Footer>
                        <Button.Root
                            variant="secondary"
                            onPress={() => setIsRegisterModalOpen(false)}
                            disabled={registering}
                        >
                            <Button.Text variant="secondary">Cancelar</Button.Text>
                        </Button.Root>

                        <Button.Root
                            variant={selectedCustomer && selectedCustomer.haircut_count >= haircutsForFree ? 'success' : 'primary'}
                            onPress={confirmRegisterHaircut}
                            isLoading={registering}
                            disabled={registering}
                        >
                            <Button.Text variant={selectedCustomer && selectedCustomer.haircut_count >= haircutsForFree ? 'success' : 'primary'}>
                                Confirmar
                            </Button.Text>
                        </Button.Root>
                    </Modal.Footer>
                </Modal.Content>
            </Modal.Root>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 16,
        gap: 16,
        paddingBottom: 80,
    },
    searchContainer: {
        gap: 8,
    },
    clearButton: {
        position: 'absolute',
        right: 12,
        top: '50%',
        marginTop: -10,
    },
    searchResults: {
        fontSize: 14,
        color: '#71717a',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 64,
        gap: 12,
    },
    emptyIcon: {
        width: 80,
        height: 80,
        backgroundColor: '#f4f4f5',
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#18181b',
    },
    emptyDescription: {
        fontSize: 14,
        color: '#71717a',
        textAlign: 'center',
        paddingHorizontal: 32,
    },
    customersList: {
        gap: 12,
    },
    customerInfo: {
        gap: 6,
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        width: 56,
        height: 56,
        backgroundColor: '#18181b',
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    modalForm: {
        gap: 16,
    },
    confirmContent: {
        gap: 16,
    },
    confirmText: {
        fontSize: 16,
        color: '#18181b',
        lineHeight: 24,
    },
    confirmName: {
        fontWeight: '600',
    },
    freeAlert: {
        flexDirection: 'row',
        gap: 12,
        backgroundColor: '#f0fdf4',
        borderWidth: 1,
        borderColor: '#bbf7d0',
        borderRadius: 8,
        padding: 12,
    },
    freeAlertContent: {
        flex: 1,
        gap: 4,
    },
    freeAlertTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#166534',
    },
    freeAlertText: {
        fontSize: 13,
        color: '#15803d',
        lineHeight: 18,
    },
});