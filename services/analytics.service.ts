import { httpClient } from '../utils/http-client';
import type { AnalyticsData } from '../types/analytics';

export const analyticsService = {
    getData: async (): Promise<AnalyticsData> => {
        const response = await httpClient.get<AnalyticsData>('/analytics');
        return response.data!;
    },
};