import { httpClient } from '../utils/http-client';

export const haircutService = {
    register: async (customerId: string): Promise<void> => {
        await httpClient.post(`/haircut/${customerId}`);
    },
};