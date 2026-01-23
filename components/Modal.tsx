import React from 'react';
import {
    Modal as RNModal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ModalRootProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const ModalRoot: React.FC<ModalRootProps> = ({ open, onClose, children }) => {
    return (
        <RNModal
            visible={open}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={onClose}
                />
                <View style={styles.container}>{children}</View>
            </View>
        </RNModal>
    );
};

interface ModalContentProps {
    children: React.ReactNode;
}

const ModalContent: React.FC<ModalContentProps> = ({ children }) => {
    return <View style={styles.content}>{children}</View>;
};

interface ModalHeaderProps {
    children: React.ReactNode;
    onClose?: () => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ children, onClose }) => {
    return (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>{children}</Text>
            {onClose && (
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#71717a" />
                </TouchableOpacity>
            )}
        </View>
    );
};

interface ModalBodyProps {
    children: React.ReactNode;
}

const ModalBody: React.FC<ModalBodyProps> = ({ children }) => {
    return <View style={styles.body}>{children}</View>;
};

interface ModalFooterProps {
    children: React.ReactNode;
}

const ModalFooter: React.FC<ModalFooterProps> = ({ children }) => {
    return <View style={styles.footer}>{children}</View>;
};

export const Modal = {
    Root: ModalRoot,
    Content: ModalContent,
    Header: ModalHeader,
    Body: ModalBody,
    Footer: ModalFooter,
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    container: {
        width: '90%',
        maxWidth: 500,
        margin: 16,
    },
    content: {
        backgroundColor: '#fff',
        borderRadius: 16,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e4e4e7',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#18181b',
        flex: 1,
    },
    closeButton: {
        padding: 4,
    },
    body: {
        padding: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#e4e4e7',
    },
});