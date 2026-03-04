import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Scissors } from "lucide-react-native";
import { Ionicons } from '@expo/vector-icons';
import { useCustomers, useSearchCustomers, useCreateCustomer } from '../../../hooks/useCustomer';
import { useRegisterHaircut } from '../../../hooks/useHaircut';
import { useSettings } from '../../../hooks/useSettings';
import { useBarbers } from '../../../hooks/useBarber';
import { CustomerCardSkeleton } from '../../../components/Loading';
import { CustomerCard } from '../../../components/CustomerCard';
import { StepIndicator } from '../../../components/StepIndicator';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { Modal } from '../../../components/Modal';
import type { Customer, Gender, ReferralSource, PreferredFrequency, PreferredStyle } from '../../../types/customer';

const STEPS = [
    { id: 1, label: 'Dados' },
    { id: 2, label: 'Preferências' },
    { id: 3, label: 'Adicional' },
];

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
    { value: 'MALE', label: 'Masculino' },
    { value: 'FEMALE', label: 'Feminino' },
    { value: 'OTHER', label: 'Outro' },
    { value: 'NOT_INFORMED', label: 'Não informar' },
];

const REFERRAL_OPTIONS: { value: ReferralSource; label: string }[] = [
    { value: 'INSTAGRAM', label: 'Instagram' },
    { value: 'INDICATION', label: 'Indicação' },
    { value: 'GOOGLE', label: 'Google' },
    { value: 'FACEBOOK', label: 'Facebook' },
    { value: 'OUTDOOR', label: 'Outdoor' },
    { value: 'WALKING', label: 'Passando na frente' },
    { value: 'OTHERS', label: 'Outros' },
    { value: 'NOT_INFORMED', label: 'Não informar' },
];

const STYLE_OPTIONS: { value: PreferredStyle; label: string }[] = [
    { value: 'LOW_FADE', label: 'Low Fade' },
    { value: 'MEDIUM_FADE', label: 'Medium Fade' },
    { value: 'HIGH_FADE', label: 'High Fade' },
    { value: 'TAPER_FADE', label: 'Taper Fade' },
    { value: 'BALD', label: 'Careca / Navalhado' },
    { value: 'SOCIAL', label: 'Social' },
    { value: 'CLASSIC', label: 'Clássico' },
    { value: 'OTHERS', label: 'Outros' },
    { value: 'NOT_INFORMED', label: 'Não informar' },
];

const FREQUENCY_OPTIONS: { value: PreferredFrequency; label: string }[] = [
    { value: 'SEMANAL', label: 'Semanal' },
    { value: 'QUINZENAL', label: 'Quinzenal' },
    { value: 'MENSAL', label: 'Mensal' },
    { value: 'BIMENSAL', label: 'Bimensal' },
    { value: 'TRIMENSAL', label: 'Trimestral' },
    { value: 'NOT_INFORMED', label: 'Não informar' },
];

export default function ClientsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    const [newCustomer, setNewCustomer] = useState({
        name: '',
        email: '',
        phone_number: '',
        preferred_style: 'NOT_INFORMED' as PreferredStyle,
        preferred_frequency: 'NOT_INFORMED' as PreferredFrequency,
        preferred_barber_id: null as string | null,
        date_of_birth: '',
        gender: 'NOT_INFORMED' as Gender,
        referral_source: 'NOT_INFORMED' as ReferralSource,
        instagram_username: '',
        occupation: '',
    });

    const { data: allCustomers, isLoading: customersLoading } = useCustomers();
    const { data: searchResults, isLoading: searchLoading } = useSearchCustomers(searchTerm);
    const { data: settings } = useSettings();
    const { data: barbers } = useBarbers();
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

    const handleOpenCreateModal = () => {
        setCurrentStep(1);
        setNewCustomer({
            name: '',
            email: '',
            phone_number: '',
            preferred_style: 'NOT_INFORMED',
            preferred_frequency: 'NOT_INFORMED',
            preferred_barber_id: null,
            date_of_birth: '',
            gender: 'NOT_INFORMED',
            referral_source: 'NOT_INFORMED',
            instagram_username: '',
            occupation: '',
        });
        setIsCreateModalOpen(true);
    };

    const handleNextStep = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleCreateCustomer = () => {
        const payload: any = {
            name: newCustomer.name,
            email: newCustomer.email,
            phone_number: newCustomer.phone_number,
        };

        if (newCustomer.preferred_style !== 'NOT_INFORMED') {
            payload.preferred_style = newCustomer.preferred_style;
        }
        if (newCustomer.preferred_frequency !== 'NOT_INFORMED') {
            payload.preferred_frequency = newCustomer.preferred_frequency;
        }
        if (newCustomer.preferred_barber_id) {
            payload.preferred_barber_id = newCustomer.preferred_barber_id;
        }
        if (newCustomer.date_of_birth) {
            payload.date_of_birth = newCustomer.date_of_birth;
        }
        if (newCustomer.gender !== 'NOT_INFORMED') {
            payload.gender = newCustomer.gender;
        }
        if (newCustomer.referral_source !== 'NOT_INFORMED') {
            payload.referral_source = newCustomer.referral_source;
        }
        if (newCustomer.instagram_username) {
            payload.instagram_username = newCustomer.instagram_username;
        }
        if (newCustomer.occupation) {
            payload.occupation = newCustomer.occupation;
        }

        createCustomer(payload, {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                setCurrentStep(1);
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

    const showSearchLoader = isSearching || searchLoading;
    const hasCustomers = customers && customers.length > 0;

    const canProceedStep1 = newCustomer.name && newCustomer.email && newCustomer.phone_number;

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
                {customersLoading ? (
                    <View style={styles.customersList}>
                        {[1, 2, 3, 4].map((i) => (
                            <CustomerCardSkeleton key={i} />
                        ))}
                    </View>
                ) : !hasCustomers ? (
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
                            const isFreeReady = customer.service_count >= haircutsForFree;

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
                                        current={customer.service_count}
                                        total={haircutsForFree}
                                    />

                                    <CustomerCard.Claimed count={customer.discounts_claimed} />
                                </CustomerCard.Root>
                            );
                        })}
                    </View>
                )}
            </ScrollView>

            {/* FAB */}
            <TouchableOpacity
                style={styles.fab}
                onPress={handleOpenCreateModal}
            >
                <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>

            {/* Create Customer Modal com Steps */}
            <Modal.Root open={isCreateModalOpen} onClose={() => !creating && setIsCreateModalOpen(false)}>
                <Modal.Content>
                    <Modal.Header onClose={() => !creating && setIsCreateModalOpen(false)}>
                        Novo Cliente
                    </Modal.Header>

                    <StepIndicator steps={STEPS} currentStep={currentStep} />

                    <Modal.Body>
                        <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                            {/* STEP 1 - Dados Básicos */}
                            {currentStep === 1 && (
                                <View style={styles.stepContent}>
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
                            )}

                            {/* STEP 2 - Preferências */}
                            {currentStep === 2 && (
                                <View style={styles.stepContent}>
                                    <View>
                                        <Text style={styles.selectLabel}>Estilo Preferido</Text>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsScroll}>
                                            {STYLE_OPTIONS.map((option) => (
                                                <TouchableOpacity
                                                    key={option.value}
                                                    onPress={() => setNewCustomer({ ...newCustomer, preferred_style: option.value })}
                                                    style={[
                                                        styles.optionChip,
                                                        newCustomer.preferred_style === option.value && styles.optionChipActive,
                                                    ]}
                                                >
                                                    <Text style={[
                                                        styles.optionChipText,
                                                        newCustomer.preferred_style === option.value && styles.optionChipTextActive,
                                                    ]}>
                                                        {option.label}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>

                                    <View>
                                        <Text style={styles.selectLabel}>Frequência Preferida</Text>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsScroll}>
                                            {FREQUENCY_OPTIONS.map((option) => (
                                                <TouchableOpacity
                                                    key={option.value}
                                                    onPress={() => setNewCustomer({ ...newCustomer, preferred_frequency: option.value })}
                                                    style={[
                                                        styles.optionChip,
                                                        newCustomer.preferred_frequency === option.value && styles.optionChipActive,
                                                    ]}
                                                >
                                                    <Text style={[
                                                        styles.optionChipText,
                                                        newCustomer.preferred_frequency === option.value && styles.optionChipTextActive,
                                                    ]}>
                                                        {option.label}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>

                                    {barbers && barbers.length > 0 && (
                                        <View>
                                            <Text style={styles.selectLabel}>Barbeiro Preferido (Opcional)</Text>
                                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsScroll}>
                                                <TouchableOpacity
                                                    onPress={() => setNewCustomer({ ...newCustomer, preferred_barber_id: null })}
                                                    style={[
                                                        styles.optionChip,
                                                        !newCustomer.preferred_barber_id && styles.optionChipActive,
                                                    ]}
                                                >
                                                    <Text style={[
                                                        styles.optionChipText,
                                                        !newCustomer.preferred_barber_id && styles.optionChipTextActive,
                                                    ]}>
                                                        Nenhum
                                                    </Text>
                                                </TouchableOpacity>
                                                {barbers.map((barber) => (
                                                    <TouchableOpacity
                                                        key={barber.id}
                                                        onPress={() => setNewCustomer({ ...newCustomer, preferred_barber_id: barber.id })}
                                                        style={[
                                                            styles.optionChip,
                                                            newCustomer.preferred_barber_id === barber.id && styles.optionChipActive,
                                                        ]}
                                                    >
                                                        <Text style={[
                                                            styles.optionChipText,
                                                            newCustomer.preferred_barber_id === barber.id && styles.optionChipTextActive,
                                                        ]}>
                                                            {barber.name}
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </ScrollView>
                                        </View>
                                    )}
                                </View>
                            )}

                            {/* STEP 3 - Informações Adicionais */}
                            {currentStep === 3 && (
                                <View style={styles.stepContent}>
                                    <Input.Root>
                                        <Input.Label>Data de Nascimento</Input.Label>
                                        <Input.Field
                                            placeholder="DD/MM/AAAA"
                                            value={newCustomer.date_of_birth}
                                            onChangeText={(text) => setNewCustomer({ ...newCustomer, date_of_birth: text })}
                                        />
                                    </Input.Root>

                                    <View>
                                        <Text style={styles.selectLabel}>Gênero</Text>
                                        <View style={styles.optionsGrid}>
                                            {GENDER_OPTIONS.map((option) => (
                                                <TouchableOpacity
                                                    key={option.value}
                                                    onPress={() => setNewCustomer({ ...newCustomer, gender: option.value })}
                                                    style={[
                                                        styles.optionButton,
                                                        newCustomer.gender === option.value && styles.optionButtonActive,
                                                    ]}
                                                >
                                                    <Text style={[
                                                        styles.optionButtonText,
                                                        newCustomer.gender === option.value && styles.optionButtonTextActive,
                                                    ]}>
                                                        {option.label}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>

                                    <View>
                                        <Text style={styles.selectLabel}>Como nos conheceu?</Text>
                                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsScroll}>
                                            {REFERRAL_OPTIONS.map((option) => (
                                                <TouchableOpacity
                                                    key={option.value}
                                                    onPress={() => setNewCustomer({ ...newCustomer, referral_source: option.value })}
                                                    style={[
                                                        styles.optionChip,
                                                        newCustomer.referral_source === option.value && styles.optionChipActive,
                                                    ]}
                                                >
                                                    <Text style={[
                                                        styles.optionChipText,
                                                        newCustomer.referral_source === option.value && styles.optionChipTextActive,
                                                    ]}>
                                                        {option.label}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </ScrollView>
                                    </View>

                                    <Input.Root>
                                        <Input.Label>Instagram (Opcional)</Input.Label>
                                        <Input.Field
                                            placeholder="@usuario"
                                            value={newCustomer.instagram_username}
                                            onChangeText={(text) => setNewCustomer({ ...newCustomer, instagram_username: text })}
                                            autoCapitalize="none"
                                        />
                                    </Input.Root>

                                    <Input.Root>
                                        <Input.Label>Ocupação (Opcional)</Input.Label>
                                        <Input.Field
                                            placeholder="Ex: Engenheiro"
                                            value={newCustomer.occupation}
                                            onChangeText={(text) => setNewCustomer({ ...newCustomer, occupation: text })}
                                        />
                                    </Input.Root>
                                </View>
                            )}
                        </ScrollView>
                    </Modal.Body>

                    <Modal.Footer>
                        {currentStep > 1 && (
                            <Button.Root
                                variant="secondary"
                                onPress={handlePrevStep}
                                disabled={creating}
                            >
                                <Button.Text variant="secondary">Voltar</Button.Text>
                            </Button.Root>
                        )}

                        {currentStep < 3 ? (
                            <Button.Root
                                onPress={handleNextStep}
                                disabled={currentStep === 1 && !canProceedStep1}
                            >
                                <Button.Text>Próximo</Button.Text>
                            </Button.Root>
                        ) : (
                            <Button.Root
                                onPress={handleCreateCustomer}
                                isLoading={creating}
                                disabled={creating || !canProceedStep1}
                            >
                                <Button.Text>Salvar</Button.Text>
                            </Button.Root>
                        )}
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

                                {selectedCustomer.service_count >= haircutsForFree && (
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
                            variant={selectedCustomer && selectedCustomer.service_count >= haircutsForFree ? 'success' : 'primary'}
                            onPress={confirmRegisterHaircut}
                            isLoading={registering}
                            disabled={registering}
                        >
                            <Button.Text variant={selectedCustomer && selectedCustomer.service_count >= haircutsForFree ? 'success' : 'primary'}>
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
    modalScroll: {
        maxHeight: 400,
    },
    stepContent: {
        gap: 20,
    },
    selectLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#18181b',
        marginBottom: 8,
    },
    optionsScroll: {
        marginBottom: 4,
    },
    optionChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f4f4f5',
        marginRight: 8,
    },
    optionChipActive: {
        backgroundColor: '#f59e0b',
    },
    optionChipText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#71717a',
    },
    optionChipTextActive: {
        color: '#fff',
    },
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    optionButton: {
        flex: 1,
        minWidth: '45%',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e4e4e7',
        alignItems: 'center',
    },
    optionButtonActive: {
        borderColor: '#f59e0b',
        backgroundColor: '#fffbeb',
    },
    optionButtonText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#71717a',
    },
    optionButtonTextActive: {
        color: '#f59e0b',
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