import React from 'react';
import {
    TouchableOpacity,
    TouchableOpacityProps,
    Text,
    View,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';

interface ButtonRootProps extends TouchableOpacityProps {
    variant?: 'primary' | 'secondary' | 'success' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
    isLoading?: boolean;
}

const ButtonRoot: React.FC<ButtonRootProps> = ({
                                                   variant = 'primary',
                                                   size = 'md',
                                                   children,
                                                   disabled,
                                                   isLoading,
                                                   style,
                                                   ...props
                                               }) => {
    const variantStyles = {
        primary: styles.variantPrimary,
        secondary: styles.variantSecondary,
        success: styles.variantSuccess,
        danger: styles.variantDanger,
    };

    const sizeStyles = {
        sm: styles.sizeSm,
        md: styles.sizeMd,
        lg: styles.sizeLg,
    };

    return (
        <TouchableOpacity
            style={[
                styles.base,
                variantStyles[variant],
                sizeStyles[size],
                (disabled || isLoading) && styles.disabled,
                style,
            ]}
            disabled={disabled || isLoading}
            activeOpacity={0.7}
            {...props}
        >
            {isLoading ? (
                <ActivityIndicator color={variant === 'secondary' ? '#18181b' : '#fff'} />
            ) : (
                children
            )}
        </TouchableOpacity>
    );
};

interface ButtonIconProps {
    children: React.ReactNode;
}

const ButtonIcon: React.FC<ButtonIconProps> = ({ children }) => {
    return <View style={styles.icon}>{children}</View>;
};

interface ButtonTextProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'success' | 'danger';
}

const ButtonText: React.FC<ButtonTextProps> = ({ children, variant = 'primary' }) => {
    const textColorStyles = {
        primary: styles.textPrimary,
        secondary: styles.textSecondary,
        success: styles.textSuccess,
        danger: styles.textDanger,
    };

    return <Text style={[styles.text, textColorStyles[variant]]}>{children}</Text>;
};

export const Button = {
    Root: ButtonRoot,
    Icon: ButtonIcon,
    Text: ButtonText,
};

const styles = StyleSheet.create({
    base: {
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    variantPrimary: {
        backgroundColor: '#18181b',
    },
    variantSecondary: {
        backgroundColor: '#f4f4f5',
    },
    variantSuccess: {
        backgroundColor: '#16a34a',
    },
    variantDanger: {
        backgroundColor: '#dc2626',
    },
    sizeSm: {
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    sizeMd: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    sizeLg: {
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    disabled: {
        opacity: 0.5,
    },
    icon: {
        width: 20,
        height: 20,
    },
    text: {
        fontWeight: '600',
        fontSize: 16,
    },
    textPrimary: {
        color: '#fff',
    },
    textSecondary: {
        color: '#18181b',
    },
    textSuccess: {
        color: '#fff',
    },
    textDanger: {
        color: '#fff',
    },
});