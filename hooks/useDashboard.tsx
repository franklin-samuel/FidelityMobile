import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard.service';

export const DASHBOARD_QUERY_KEY = 'dashboard';

export const useDashboardMetrics = () => {
    return useQuery({
        queryKey: [DASHBOARD_QUERY_KEY, 'metrics'],
        queryFn: () => dashboardService.getMetrics(),
    });
};