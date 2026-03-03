import { httpClient } from '../utils/http-client';
import type { Barber, CreateBarberRequest, DeleteBarberRequest } from '../types/barber';

export const barberService = {
    list: async (): Promise<Barber[]> => {
        const response = await httpClient.get<Barber[]>('/barber');
        return response.data || [];
    },

    create: async (data: CreateBarberRequest): Promise<Barber> => {
        const response = await httpClient.post<Barber>('/barber', data);
        return response.data!;
    },

    delete: async (id: string, data: DeleteBarberRequest): Promise<void> => {
        await httpClient.post(`/barber/${id}/delete`, data);
    },
};