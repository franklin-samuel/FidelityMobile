import { httpClient } from '../utils/http-client';
import type { Settings, UpdateSettingsRequest } from '../types/settings';

export const settingsService = {
    get: async (): Promise<Settings> => {
        const response = await httpClient.get<Settings>('/settings');
        return response.data!;
    },

    update: async (data: UpdateSettingsRequest): Promise<Settings> => {
        const response = await httpClient.patch<Settings>('/settings', data);
        return response.data!;
    },
};