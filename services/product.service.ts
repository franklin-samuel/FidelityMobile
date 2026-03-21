import { httpClient } from '../utils/http-client';
import type { Product, CreateProductRequest, UpdateProductRequest } from '../types/product';

export const productService = {
    list: async (): Promise<Product[]> => {
        const response = await httpClient.get<Product[]>('/product');
        return Array.isArray(response.data) ? response.data : [];    },

    create: async (data: CreateProductRequest): Promise<Product> => {
        const response = await httpClient.post<Product>('/product', data);
        return response.data!;
    },

    update: async (id: string, data: UpdateProductRequest): Promise<Product> => {
        const response = await httpClient.patch<Product>(`/product/${id}`, data);
        return response.data!;
    },

    delete: async (id: string): Promise<void> => {
        await httpClient.post(`/product/${id}/delete`);
    },
};