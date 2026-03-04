import React from 'react';
import {
    FlatList,
    FlatListProps,
    ActivityIndicator,
    View,
    Text,
    StyleSheet,
    RefreshControl,
} from 'react-native';

interface InfiniteScrollListProps<T> extends Omit<FlatListProps<T>, 'onEndReached'> {
    data: T[];
    renderItem: FlatListProps<T>['renderItem'];
    keyExtractor: (item: T, index: number) => string;
    onLoadMore?: () => void;
    onRefresh?: () => void;
    isLoading?: boolean;
    isLoadingMore?: boolean;
    isRefreshing?: boolean;
    hasMore?: boolean;
    emptyMessage?: string;
    emptyIcon?: React.ReactNode;
}

export function InfiniteScrollList<T>({
                                          data,
                                          renderItem,
                                          keyExtractor,
                                          onLoadMore,
                                          onRefresh,
                                          isLoading = false,
                                          isLoadingMore = false,
                                          isRefreshing = false,
                                          hasMore = false,
                                          emptyMessage = 'Nenhum item encontrado',
                                          emptyIcon,
                                          ...rest
                                      }: InfiniteScrollListProps<T>) {
    const handleEndReached = () => {
        if (hasMore && !isLoadingMore && !isLoading) {
            onLoadMore?.();
        }
    };

    const renderFooter = () => {
        if (!isLoadingMore) return null;

        return (
            <View style={styles.footer}>
                <ActivityIndicator size="small" color="#f59e0b" />
                <Text style={styles.footerText}>Carregando mais...</Text>
            </View>
        );
    };

    const renderEmpty = () => {
        if (isLoading) {
            return (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#f59e0b" />
                </View>
            );
        }

        return (
            <View style={styles.emptyState}>
                {emptyIcon && <View style={styles.emptyIcon}>{emptyIcon}</View>}
                <Text style={styles.emptyText}>{emptyMessage}</Text>
            </View>
        );
    };

    return (
        <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderEmpty}
            refreshControl={
                onRefresh ? (
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={onRefresh}
                        colors={['#f59e0b']}
                        tintColor="#f59e0b"
                    />
                ) : undefined
            }
            contentContainerStyle={[
                styles.contentContainer,
                data.length === 0 && styles.emptyContentContainer,
            ]}
            {...rest}
        />
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        padding: 16,
        gap: 12,
        paddingBottom: 80,
    },
    emptyContentContainer: {
        flexGrow: 1,
    },
    centerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 64,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        paddingVertical: 20,
    },
    footerText: {
        fontSize: 14,
        color: '#71717a',
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 64,
        gap: 16,
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
    emptyText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#71717a',
        textAlign: 'center',
        paddingHorizontal: 32,
    },
});