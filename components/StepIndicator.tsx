import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Step {
    id: number;
    label: string;
}

interface StepIndicatorProps {
    steps: Step[];
    currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
    return (
        <View style={styles.container}>
            {steps.map((step, index) => {
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                const isLast = index === steps.length - 1;

                return (
                    <React.Fragment key={step.id}>
                        <View style={styles.stepContainer}>
                            <View
                                style={[
                                    styles.stepCircle,
                                    isActive && styles.stepCircleActive,
                                    isCompleted && styles.stepCircleCompleted,
                                ]}
                            >
                                {isCompleted ? (
                                    <Ionicons name="checkmark" size={16} color="#fff" />
                                ) : (
                                    <Text
                                        style={[
                                            styles.stepNumber,
                                            isActive && styles.stepNumberActive,
                                        ]}
                                    >
                                        {step.id}
                                    </Text>
                                )}
                            </View>
                            <Text
                                style={[
                                    styles.stepLabel,
                                    isActive && styles.stepLabelActive,
                                    isCompleted && styles.stepLabelCompleted,
                                ]}
                            >
                                {step.label}
                            </Text>
                        </View>

                        {!isLast && (
                            <View
                                style={[
                                    styles.stepLine,
                                    isCompleted && styles.stepLineCompleted,
                                ]}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
    },
    stepContainer: {
        alignItems: 'center',
        gap: 8,
    },
    stepCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f4f4f5',
        borderWidth: 2,
        borderColor: '#e4e4e7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepCircleActive: {
        backgroundColor: '#f59e0b',
        borderColor: '#f59e0b',
    },
    stepCircleCompleted: {
        backgroundColor: '#16a34a',
        borderColor: '#16a34a',
    },
    stepNumber: {
        fontSize: 14,
        fontWeight: '600',
        color: '#a1a1aa',
    },
    stepNumberActive: {
        color: '#fff',
    },
    stepLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: '#a1a1aa',
        textAlign: 'center',
    },
    stepLabelActive: {
        color: '#f59e0b',
        fontWeight: '600',
    },
    stepLabelCompleted: {
        color: '#16a34a',
    },
    stepLine: {
        flex: 1,
        height: 2,
        backgroundColor: '#e4e4e7',
        marginHorizontal: 8,
    },
    stepLineCompleted: {
        backgroundColor: '#16a34a',
    },
});