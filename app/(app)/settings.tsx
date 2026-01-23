import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSettings, useUpdateSettings } from '../../hooks/useSettings';
import { Loading } from '../../components/Loading';
import { Input } from '../../components/Input';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

export default function SettingsPage() {
    const router = useRouter();
    const [haircutsForFree, setHaircutsForFree] = useState<string>('10');
    const [hasChanges, setHasChanges] = useState(false);

    const { data: settings, isLoading } = useSettings();
    const { mutate: updateSettings, isPending } = useUpdateSettings();

    useEffect(() => {
        if (settings?.haircuts_for_free) {
            setHaircutsForFree(settings.haircuts_for_free.toString());
        }
    }, [settings]);

    useEffect(() => {
        if (settings) {
            const currentValue = parseInt(haircutsForFree) || 0;
            setHasChanges(currentValue !== settings.haircuts_for_free);
        }
    }, [haircutsForFree, settings]);

    const handleSubmit = () => {
        const value = parseInt(haircutsForFree) || 10;

        updateSettings(
            { haircuts_for_free: value },
            {
                onSuccess: () => {
                    setHasChanges(false);
                }
            }
        );
    };

    if (isLoading) {
        return <Loading fullScreen text="Carregando configurações..." />;
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#18181b" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Configurações</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                <Text style={styles.pageDescription}>
                    Configure as regras do programa de fidelidade
                </Text>

                <Card.Root>
                    <Card.Header>
                        <View style={styles.cardHeaderContent}>
                            <View style={styles.cardIcon}>
                                <Ionicons name="gift" size={24} color="#f59e0b" />
                            </View>
                            <View style={styles.cardHeaderText}>
                                <Card.Title>Programa de Fidelidade</Card.Title>
                                <Card.Description>
                                    Defina quantos cortes são necessários para ganhar um grátis
                                </Card.Description>
                            </View>
                        </View>
                    </Card.Header>

                    <Card.Body>
                        <View style={styles.formContent}>
                            <Input.Root>
                                <Input.Label>Cortes para ganhar um grátis</Input.Label>
                                <View style={styles.inputRow}>
                                    <Input.Field
                                        value={haircutsForFree}
                                        onChangeText={setHaircutsForFree}
                                        keyboardType="number-pad"
                                        style={styles.numberInput}
                                    />
                                    <Text style={styles.inputLabel}>cortes</Text>
                                </View>
                                <Text style={styles.inputHelp}>
                                    Quando um cliente atingir este número de cortes, ele ganhará um corte grátis
                                </Text>
                            </Input.Root>

                            {/* Example Preview */}
                            <View style={styles.exampleBox}>
                                <View style={styles.exampleHeader}>
                                    <Ionicons name="information-circle" size={16} color="#71717a" />
                                    <Text style={styles.exampleTitle}>Exemplo</Text>
                                </View>
                                <Text style={styles.exampleText}>
                                    Com <Text style={styles.exampleHighlight}>{haircutsForFree}</Text> cortes
                                    configurados, o cliente pagará por {haircutsForFree} cortes e o{' '}
                                    {parseInt(haircutsForFree) + 1}º será grátis.
                                </Text>
                            </View>

                            {/* Change Indicator */}
                            {hasChanges && (
                                <View style={styles.changesAlert}>
                                    <Ionicons name="information-circle" size={16} color="#3b82f6" />
                                    <Text style={styles.changesText}>
                                        Você tem alterações não salvas
                                    </Text>
                                </View>
                            )}
                        </View>
                    </Card.Body>

                    <Card.Footer>
                        <Button.Root
                            onPress={handleSubmit}
                            isLoading={isPending}
                            disabled={isPending || !hasChanges}
                        >
                            <Button.Icon>
                                <Ionicons name="save" size={20} color="#fff" />
                            </Button.Icon>
                            <Button.Text>
                                {isPending ? 'Salvando...' : 'Salvar Alterações'}
                            </Button.Text>
                        </Button.Root>
                    </Card.Footer>
                </Card.Root>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e4e4e7',
        backgroundColor: '#fff',
        paddingTop: 48,
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#18181b',
    },
    headerSpacer: {
        width: 32,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 16,
        gap: 16,
    },
    pageDescription: {
        fontSize: 14,
        color: '#71717a',
    },
    cardHeaderContent: {
        flexDirection: 'row',
        gap: 12,
    },
    cardIcon: {
        width: 48,
        height: 48,
        backgroundColor: '#fffbeb',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardHeaderText: {
        flex: 1,
    },
    formContent: {
        gap: 16,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    numberInput: {
        width: 120,
    },
    inputLabel: {
        fontSize: 16,
        color: '#71717a',
    },
    inputHelp: {
        fontSize: 14,
        color: '#71717a',
        lineHeight: 20,
    },
    exampleBox: {
        backgroundColor: '#f4f4f5',
        borderRadius: 8,
        padding: 12,
        gap: 8,
    },
    exampleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    exampleTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#18181b',
    },
    exampleText: {
        fontSize: 14,
        color: '#71717a',
        lineHeight: 20,
    },
    exampleHighlight: {
        fontWeight: '600',
        color: '#f59e0b',
    },
    changesAlert: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    changesText: {
        fontSize: 14,
        color: '#3b82f6',
    },
});