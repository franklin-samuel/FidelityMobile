import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceService } from '../services/service.service';
import type { CreateServiceRequest, UpdateServiceRequest } from '../types/service';

export const SERVICE_QUERY_KEY = 'services';

export const useServices = () => {
    return useQuery({
        queryKey: [SERVICE_QUERY_KEY],
        queryFn: () => serviceService.list(),
    });
};

export const useCreateService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateServiceRequest) => serviceService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [SERVICE_QUERY_KEY] });
        },
    });
};

export const useUpdateService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateServiceRequest }) =>
            serviceService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [SERVICE_QUERY_KEY] });
        },
    });
};

export const useDeleteService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => serviceService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [SERVICE_QUERY_KEY] });
        },
    });
};