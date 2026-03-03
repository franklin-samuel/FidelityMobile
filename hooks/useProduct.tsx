import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/product.service';
import type { CreateProductRequest, UpdateProductRequest } from '../types/product';

export const PRODUCT_QUERY_KEY = 'products';

export const useProducts = () => {
    return useQuery({
        queryKey: [PRODUCT_QUERY_KEY],
        queryFn: () => productService.list(),
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateProductRequest) => productService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PRODUCT_QUERY_KEY] });
        },
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateProductRequest }) =>
            productService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PRODUCT_QUERY_KEY] });
        },
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => productService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PRODUCT_QUERY_KEY] });
        },
    });
};