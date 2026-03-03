import { httpClient } from '../utils/http-client';
import type {
    Appointment,
    PaginatedAppointments,
    AppointmentFilters,
    RegisterServiceAppointmentRequest,
    RegisterProductAppointmentRequest,
    UpdateAppointmentRequest,
} from '../types/appointment';

export const appointmentService = {
    list: async (filters: AppointmentFilters = {}): Promise<PaginatedAppointments> => {
        const params = new URLSearchParams();

        params.set('page', String((filters.page ?? 1) - 1));
        params.set('size', String(filters.size ?? 25));

        if (filters.payment_method) params.set('paymentMethod', filters.payment_method);
        if (filters.barber_id)      params.set('barberId', filters.barber_id);
        if (filters.date_from)      params.set('startDate', filters.date_from + 'T00:00:00');
        if (filters.date_to)        params.set('endDate', filters.date_to + 'T23:59:59');
        if (filters.search)         params.set('searchAnything', filters.search);
        if (filters.type)           params.set('type', filters.type);

        const query = params.toString();
        const response = await httpClient.get<PaginatedAppointments>(
            `/appointment${query ? `?${query}` : ''}`
        );

        const data = response.data!;

        return {
            ...data,
            page: data.page + 1,
        };
    },

    registerService: async (data: RegisterServiceAppointmentRequest): Promise<Appointment> => {
        const response = await httpClient.post<Appointment>('/appointment/service', data);
        return response.data!;
    },

    registerProduct: async (data: RegisterProductAppointmentRequest): Promise<Appointment> => {
        const response = await httpClient.post<Appointment>('/appointment/product', data);
        return response.data!;
    },

    linkCustomer: async (appointmentId: string, data: UpdateAppointmentRequest): Promise<Appointment> => {
        const response = await httpClient.patch<Appointment>(`/appointment/${appointmentId}`, data);
        return response.data!;
    },
};