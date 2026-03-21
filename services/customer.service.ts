import { httpClient } from '../utils/http-client';
import type {
    Customer,
    CreateCustomerRequest,
    UpdateCustomerRequest,
} from '../types/customer';
import type { LoyaltyStatus } from '../types/loyalty';

export const customerService = {
    list: async (): Promise<Customer[]> => {
        const response = await httpClient.get<Customer[]>('/customer');
        return Array.isArray(response.data) ? response.data : [];    },

    search: async (query: string): Promise<Customer[]> => {
        const response = await httpClient.get<Customer[]>(
            `/customer/search?q=${encodeURIComponent(query)}`
        );
        return Array.isArray(response.data) ? response.data : [];    },

    create: async (data: CreateCustomerRequest): Promise<Customer> => {
        const response = await httpClient.post<Customer>('/customer', data);
        return response.data!;
    },

    update: async (id: string, data: UpdateCustomerRequest): Promise<Customer> => {
        const response = await httpClient.patch<Customer>(`/customer/${id}`, data);
        return response.data!;
    },

    getLoyaltyStatus: async (customerId: string, serviceId?: string): Promise<LoyaltyStatus> => {
        const params = serviceId ? `?serviceId=${serviceId}` : '';
        const response = await httpClient.get<LoyaltyStatus>(
            `/customer/${customerId}/loyalty-status${params}`
        );
        return response.data!;
    },
};