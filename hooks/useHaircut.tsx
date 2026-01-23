import { useMutation, useQueryClient } from '@tanstack/react-query';
import { haircutService } from '../services/haircut.service';
import { CUSTOMER_QUERY_KEY } from './useCustomer';
import { DASHBOARD_QUERY_KEY } from './useDashboard';

export const useRegisterHaircut = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (customerId: string) => haircutService.register(customerId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [CUSTOMER_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [DASHBOARD_QUERY_KEY] });
        },
    });
};