import React from 'react';
import {
    View,
    Text,
    TextInput,
    TextInputProps,
    StyleSheet,
} from 'react-native';

interface InputRootProps {
    children: React.ReactNode;
}

const InputRoot: React.FC<InputRootProps> = ({ children }) => {
    return <View style={styles.root}>{children}</View>;
};

interface InputLabelProps {
    children: React.ReactNode;
    required?: boolean;
}

const InputLabel: React.FC<InputLabelProps> = ({ children, required }) => {
    return (
        <Text style={styles.label}>
            {children}
            {required && <Text style={styles.required}> *</Text>}
        </Text>
    );
};

interface InputFieldProps extends TextInputProps {
    error?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ error, style, ...props }) => {
    return (
        <TextInput
            style={[
                styles.field,
                error && styles.fieldError,
                style,
            ]}
            placeholderTextColor="#a1a1aa"
            {...props}
        />
    );
};

interface InputContainerProps {
    children: React.ReactNode;
}

const InputContainer: React.FC<InputContainerProps> = ({ children }) => {
    return <View style={styles.container}>{children}</View>;
};

interface InputIconProps {
    children: React.ReactNode;
    position?: 'left' | 'right';
}

const InputIcon: React.FC<InputIconProps> = ({ children, position = 'left' }) => {
    return (
        <View style={[styles.icon, position === 'right' && styles.iconRight]}>
            {children}
        </View>
    );
};

interface InputErrorProps {
    children: React.ReactNode;
}

const InputError: React.FC<InputErrorProps> = ({ children }) => {
    return <Text style={styles.error}>{children}</Text>;
};

export const Input = {
    Root: InputRoot,
    Label: InputLabel,
    Field: InputField,
    Container: InputContainer,
    Icon: InputIcon,
    Error: InputError,
};

const styles = StyleSheet.create({
    root: {
        gap: 6,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#3f3f46',
    },
    required: {
        color: '#ef4444',
    },
    field: {
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#d4d4d8',
        backgroundColor: '#fff',
        fontSize: 16,
        color: '#18181b',
    },
    fieldError: {
        borderColor: '#ef4444',
    },
    container: {
        position: 'relative',
    },
    icon: {
        position: 'absolute',
        left: 12,
        top: 12,
        width: 20,
        height: 20,
    },
    iconRight: {
        left: undefined,
        right: 12,
    },
    error: {
        fontSize: 12,
        color: '#ef4444',
    },
});