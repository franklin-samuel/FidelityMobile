import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentService } from '../services/appointment.service';
import type {
    AppointmentFilters,
    RegisterServiceAppointmentRequest,
    RegisterProductAppointmentRequest,
    UpdateAppointmentRequest,
} from '../types/appointment';

export const APPOINTMENT_QUERY_KEY = 'appointments';

export const useAppointments = (filters: AppointmentFilters = {}) => {
    return useQuery({
        queryKey: [APPOINTMENT_QUERY_KEY, filters],
        queryFn: () => appointmentService.list(filters),
    });
};

export const useRegisterServiceAppointment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: RegisterServiceAppointmentRequest) =>
            appointmentService.registerService(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [APPOINTMENT_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: ['customers'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            queryClient.invalidateQueries({ queryKey: ['analytics'] });
        },
    });
};

export const useRegisterProductAppointment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: RegisterProductAppointmentRequest) =>
            appointmentService.registerProduct(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [APPOINTMENT_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
            queryClient.invalidateQueries({ queryKey: ['analytics'] });
        },
    });
};

export const useLinkCustomerToAppointment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ appointmentId, data }: { appointmentId: string; data: UpdateAppointmentRequest }) =>
            appointmentService.linkCustomer(appointmentId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [APPOINTMENT_QUERY_KEY] });
        },
    });
};