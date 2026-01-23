import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '../services/customer.service';
import type { CreateCustomerRequest, UpdateCustomerRequest } from '../types/customer';
import { useState, useEffect } from 'react';

export const CUSTOMER_QUERY_KEY = 'customers';

export const useCustomers = () => {
    return useQuery({
        queryKey: [CUSTOMER_QUERY_KEY],
        queryFn: () => customerService.list(),
    });
};

export const useSearchCustomers = (searchTerm: string) => {
    const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedTerm(searchTerm);
        }, 0);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    return useQuery({
        queryKey: [CUSTOMER_QUERY_KEY, 'search', debouncedTerm],
        queryFn: () => customerService.search(debouncedTerm),
        enabled: debouncedTerm.length > 0,
    });
};

export const useCreateCustomer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateCustomerRequest) => customerService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [CUSTOMER_QUERY_KEY] });
        },
    });
};

export const useUpdateCustomer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateCustomerRequest }) =>
            customerService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [CUSTOMER_QUERY_KEY] });
        },
    });
};