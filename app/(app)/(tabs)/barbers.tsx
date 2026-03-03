import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBarbers, useCreateBarber, useDeleteBarber } from '../../../hooks/useBarber';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { Modal } from '../../../components/Modal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Barber } from '../../../types/barber';

export default function BarbersPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingBarber, setDeletingBarber] = useState<Barber | null>(null);
    const [emailConfirmation, setEmailConfirmation] = useState('');
    const [form, setForm] = useState({ name: '', email: '', password: '' });

    const { data: barbers, isLoading } = useBarbers();
    const { mutate: createBarber, isPending: creating } = useCreateBarber();
    const { mutate: deleteBarber, isPending: deleting } = useDeleteBarber();

    const canDelete = emailConfirmation === deletingBarber?.email;

    const handleCreate = () => {
        createBarber(form, {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                setForm({ name: '', email: '', password: '' });
            },
        });
    };

    const handleDelete = () => {
        if (!deletingBarber || !canDelete) return;
        deleteBarber(
            { barberId: deletingBarber.id, data: { email_confirmation: emailConfirmation } },
            {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    setDeletingBarber(null);
                    setEmailConfirmation('');
                },
            }
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                {isLoading ? (
                    <View style={styles.loadingList}>
                        {[1, 2, 3].map(i => (
                            <View key={i} style={styles.skeleton} />
                        ))}
                    </View>
                ) : !barbers || barbers.length === 0 ? (
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIcon}>
                            <Ionicons name="cut-outline" size={48} color="#a1a1aa" />
                        </View>
                        <Text style={styles.emptyTitle}>Nenhum barbeiro cadastrado</Text>
                    </View>
                ) : (
                    barbers.map((barber) => (
                        <View key={barber.id} style={styles.card}>
                            <View style={styles.cardLeft}>
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>
                                        {barber.name.charAt(0).toUpperCase()}
                                    </Text>
                                </View>
                                <View>
                                    <Text style={styles.barberName}>{barber.name}</Text>
                                    <Text style={styles.barberEmail}>{barber.email}</Text>
                                    <Text style={styles.barberDate}>
                                        Desde {format(new Date(barber.created_at), 'MMM yyyy', { locale: ptBR })}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={() => { setDeletingBarber(barber); setIsDeleteModalOpen(true); }}
                                style={styles.deleteButton}
                            >
                                <Ionicons name="trash-outline" size={20} color="#ef4444" />
                            </TouchableOpacity>
                        </View>
                    ))
                )}
            </ScrollView>

            <TouchableOpacity style={styles.fab} onPress={() => setIsCreateModalOpen(true)}>
                <Ionicons name="add" size={28} color="#fff" />
            </TouchableOpacity>

            {/* Create Modal */}
            <Modal.Root open={isCreateModalOpen} onClose={() => !creating && setIsCreateModalOpen(false)}>
                <Modal.Content>
                    <Modal.Header onClose={() => !creating && setIsCreateModalOpen(false)}>
                        Novo Barbeiro
                    </Modal.Header>
                    <Modal.Body>
                        <View style={styles.modalForm}>
                            <Input.Root>
                                <Input.Label required>Nome</Input.Label>
                                <Input.Field
                                    placeholder="Nome completo"
                                    value={form.name}
                                    onChangeText={text => setForm({ ...form, name: text })}
                                />
                            </Input.Root>
                            <Input.Root>
                                <Input.Label required>E-mail</Input.Label>
                                <Input.Field
                                    placeholder="email@exemplo.com"
                                    value={form.email}
                                    onChangeText={text => setForm({ ...form, email: text })}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </Input.Root>
                            <Input.Root>
                                <Input.Label required>Senha</Input.Label>
                                <Input.Field
                                    placeholder="Senha inicial"
                                    value={form.password}
                                    onChangeText={text => setForm({ ...form, password: text })}
                                    secureTextEntry
                                />
                            </Input.Root>
                        </View>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Root variant="secondary" onPress={() => setIsCreateModalOpen(false)} disabled={creating}>
                            <Button.Text variant="secondary">Cancelar</Button.Text>
                        </Button.Root>
                        <Button.Root onPress={handleCreate} isLoading={creating} disabled={creating}>
                            <Button.Text>Criar</Button.Text>
                        </Button.Root>
                    </Modal.Footer>
                </Modal.Content>
            </Modal.Root>

            {/* Delete Modal */}
            <Modal.Root open={isDeleteModalOpen} onClose={() => !deleting && setIsDeleteModalOpen(false)}>
                <Modal.Content>
                    <Modal.Header onClose={() => !deleting && setIsDeleteModalOpen(false)}>
                        Remover Barbeiro
                    </Modal.Header>
                    <Modal.Body>
                        <View style={styles.modalForm}>
                            <Text style={styles.deleteText}>
                                Para confirmar a remoção de{' '}
                                <Text style={styles.deleteNameHighlight}>{deletingBarber?.name}</Text>
                                , digite o e-mail abaixo:
                            </Text>
                            <View style={styles.emailBox}>
                                <Text style={styles.emailBoxText}>{deletingBarber?.email}</Text>
                            </View>
                            <Input.Root>
                                <Input.Field
                                    placeholder="Digite o e-mail para confirmar"
                                    value={emailConfirmation}
                                    onChangeText={setEmailConfirmation}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </Input.Root>
                        </View>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Root variant="secondary" onPress={() => { setIsDeleteModalOpen(false); setEmailConfirmation(''); }} disabled={deleting}>
                            <Button.Text variant="secondary">Cancelar</Button.Text>
                        </Button.Root>
                        <Button.Root variant="danger" onPress={handleDelete} isLoading={deleting} disabled={!canDelete || deleting}>
                            <Button.Text variant="danger">Remover</Button.Text>
                        </Button.Root>
                    </Modal.Footer>
                </Modal.Content>
            </Modal.Root>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    scrollView: { flex: 1 },
    content: { padding: 16, gap: 12, paddingBottom: 80 },
    loadingList: { gap: 12 },
    skeleton: { height: 72, backgroundColor: '#f4f4f5', borderRadius: 12 },
    emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 64, gap: 12 },
    emptyIcon: { width: 80, height: 80, backgroundColor: '#f4f4f5', borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
    emptyTitle: { fontSize: 18, fontWeight: '600', color: '#18181b' },
    card: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e4e4e7', padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
    avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fffbeb', alignItems: 'center', justifyContent: 'center' },
    avatarText: { fontSize: 16, fontWeight: '700', color: '#f59e0b' },
    barberName: { fontSize: 15, fontWeight: '600', color: '#18181b' },
    barberEmail: { fontSize: 13, color: '#71717a' },
    barberDate: { fontSize: 12, color: '#a1a1aa' },
    deleteButton: { padding: 8 },
    fab: { position: 'absolute', right: 16, bottom: 16, width: 56, height: 56, backgroundColor: '#18181b', borderRadius: 28, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
    modalForm: { gap: 16 },
    deleteText: { fontSize: 15, color: '#18181b', lineHeight: 22 },
    deleteNameHighlight: { fontWeight: '700' },
    emailBox: { backgroundColor: '#f4f4f5', borderRadius: 8, padding: 12 },
    emailBoxText: { fontSize: 13, fontFamily: 'monospace', color: '#3f3f46' },
});