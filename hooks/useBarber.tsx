import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { barberService } from '../services/barber.service';
import type { CreateBarberRequest, DeleteBarberRequest } from '../types/barber';

export const BARBER_QUERY_KEY = 'barbers';

export const useBarbers = () => {
    return useQuery({
        queryKey: [BARBER_QUERY_KEY],
        queryFn: () => barberService.list(),
    });
};

export const useCreateBarber = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateBarberRequest) => barberService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [BARBER_QUERY_KEY] });
        },
    });
};

export const useDeleteBarber = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ barberId, data }: { barberId: string; data: DeleteBarberRequest }) =>
            barberService.delete(barberId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [BARBER_QUERY_KEY] });
        },
    });
};