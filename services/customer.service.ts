import { httpClient } from '../utils/http-client';
import type {
    Customer,
    CreateCustomerRequest,
    UpdateCustomerRequest,
} from '../types/customer';

export const customerService = {
    list: async (): Promise<Customer[]> => {
        const response = await httpClient.get<Customer[]>('/customer');
        return response.data || [];
    },

    search: async (query: string): Promise<Customer[]> => {
        const response = await httpClient.get<Customer[]>(
            `/customer/search?q=${encodeURIComponent(query)}`
        );
        return response.data || [];
    },

    create: async (data: CreateCustomerRequest): Promise<Customer> => {
        const response = await httpClient.post<Customer>('/customer', data);
        return response.data!;
    },

    update: async (id: string, data: UpdateCustomerRequest): Promise<Customer> => {
        const response = await httpClient.patch<Customer>(`/customer/${id}`, data);
        return response.data!;
    },
};