import { httpClient } from '../utils/http-client';
import type { DashboardMetrics } from '../types/dashboard';

export const dashboardService = {
    getMetrics: async (): Promise<DashboardMetrics> => {
        const response = await httpClient.get<DashboardMetrics>('/dashboard/metrics');
        return response.data!;
    },
};