import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUsers, useCreateUser } from '../../../hooks/useUser';
import { useAuth } from '../../../hooks/useAuth';
import { AdminCardSkeleton } from '../../../components/Loading';
import { AdminCard } from '../../../components/AdminCard';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { Modal } from '../../../components/Modal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function AdminsPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newAdmin, setNewAdmin] = useState({
        name: '',
        email: '',
        password: ''
    });

    const { data: users, isLoading } = useUsers();
    const { mutate: createUser, isPending } = useCreateUser();
    const { user: currentUser, refetch } = useAuth();

    useEffect(() => {
        if (!currentUser) {
            refetch();
        }
    }, [currentUser, refetch]);

    const handleCreateAdmin = () => {
        createUser(newAdmin, {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                setNewAdmin({ name: '', email: '', password: '' });
            }
        });
    };

    const admins = users || [];

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
            >
                {isLoading ? (
                    <View style={styles.adminsList}>
                        {[1, 2, 3].map((i) => (
                            <AdminCardSkeleton key={i} />
                        ))}
                    </View>
                ) : admins.length === 0 ? (
                    <View style={styles.emptyState}>
                        <View style={styles.emptyIcon}>
                            <Ionicons name="shield-checkmark" size={48} color="#a1a1aa" />
                        </View>
                        <Text style={styles.emptyTitle}>
                            Nenhum administrador cadastrado
                        </Text>
                        <Text style={styles.emptyDescription}>
                            Comece adicionando o primeiro administrador do sistema
                        </Text>
                        <TouchableOpacity
                            style={styles.emptyButton}
                            onPress={() => setIsCreateModalOpen(true)}
                        >
                            <Ionicons name="add" size={20} color="#fff" />
                            <Text style={styles.emptyButtonText}>Adicionar Administrador</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.adminsList}>
                        {admins.map((admin) => {
                            const isCurrentUser = currentUser?.email === admin.email;
                            const formattedDate = format(
                                new Date(admin.created_at),
                                "dd 'de' MMMM 'de' yyyy",
                                { locale: ptBR }
                            );

                            return (
                                <AdminCard.Root key={admin.id} isCurrentUser={isCurrentUser}>
                                    <AdminCard.Header name={admin.name} isCurrentUser={isCurrentUser} />

                                    <View style={styles.adminInfo}>
                                        <AdminCard.Info
                                            icon={<Ionicons name="mail" size={16} color="#71717a" />}
                                        >
                                            {admin.email}
                                        </AdminCard.Info>

                                        <AdminCard.Info
                                            icon={<Ionicons name="calendar" size={16} color="#71717a" />}
                                        >
                                            Desde {formattedDate}
                                        </AdminCard.Info>
                                    </View>
                                </AdminCard.Root>
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

            {/* Create Admin Modal */}
            <Modal.Root open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
                <Modal.Content>
                    <Modal.Header onClose={() => setIsCreateModalOpen(false)}>
                        Novo Administrador
                    </Modal.Header>

                    <Modal.Body>
                        <View style={styles.modalForm}>
                            <Input.Root>
                                <Input.Label required>Nome</Input.Label>
                                <Input.Field
                                    placeholder="Nome completo"
                                    value={newAdmin.name}
                                    onChangeText={(text) => setNewAdmin({ ...newAdmin, name: text })}
                                />
                            </Input.Root>

                            <Input.Root>
                                <Input.Label required>Email</Input.Label>
                                <Input.Field
                                    placeholder="admin@barbearia.com"
                                    value={newAdmin.email}
                                    onChangeText={(text) => setNewAdmin({ ...newAdmin, email: text })}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </Input.Root>

                            <Input.Root>
                                <Input.Label required>Senha</Input.Label>
                                <Input.Field
                                    placeholder="••••••••"
                                    value={newAdmin.password}
                                    onChangeText={(text) => setNewAdmin({ ...newAdmin, password: text })}
                                    secureTextEntry
                                />
                            </Input.Root>
                        </View>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button.Root
                            variant="secondary"
                            onPress={() => setIsCreateModalOpen(false)}
                            disabled={isPending}
                        >
                            <Button.Text variant="secondary">Cancelar</Button.Text>
                        </Button.Root>

                        <Button.Root
                            onPress={handleCreateAdmin}
                            isLoading={isPending}
                            disabled={isPending}
                        >
                            <Button.Text>Salvar</Button.Text>
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
        gap: 12,
        paddingBottom: 80,
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
        marginBottom: 8,
    },
    emptyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: '#18181b',
        borderRadius: 8,
    },
    emptyButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    adminsList: {
        gap: 12,
    },
    adminInfo: {
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
});