import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../services/analytics.service';

export const ANALYTICS_QUERY_KEY = 'analytics';

export const useAnalyticsData = () => {
    return useQuery({
        queryKey: [ANALYTICS_QUERY_KEY],
        queryFn: () => analyticsService.getData(),
    });
};