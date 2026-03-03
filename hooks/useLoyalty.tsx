import { useQuery } from '@tanstack/react-query';
import { customerService } from '../services/customer.service';

export const useLoyaltyStatus = (customerId: string | null, serviceId?: string | null) => {
    return useQuery({
        queryKey: ['loyalty-status', customerId, serviceId],
        queryFn: () => customerService.getLoyaltyStatus(customerId!, serviceId ?? undefined),
        enabled: !!customerId,
    });
};