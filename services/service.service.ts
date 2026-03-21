import { httpClient } from '../utils/http-client';
import type { Service, CreateServiceRequest, UpdateServiceRequest } from '../types/service';

export const serviceService = {
    list: async (): Promise<Service[]> => {
        const response = await httpClient.get<Service[]>('/service');
        return Array.isArray(response.data) ? response.data : [];    },

    create: async (data: CreateServiceRequest): Promise<Service> => {
        const response = await httpClient.post<Service>('/service', data);
        return response.data!;
    },

    update: async (id: string, data: UpdateServiceRequest): Promise<Service> => {
        const response = await httpClient.patch<Service>(`/service/${id}`, data);
        return response.data!;
    },

    delete: async (id: string): Promise<void> => {
        await httpClient.post(`/service/${id}/delete`);
    },
};