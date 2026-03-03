export type AppointmentType = 'SERVICE' | 'PRODUCT';
export type PaymentMethod = 'CREDIT' | 'DEBIT' | 'PIX' | 'MONEY';

export interface Appointment {
    id: string;
    barber_id: string;
    barber_name?: string;
    customer_id: string | null;
    customer_name?: string | null;
    type: AppointmentType;
    service_id: string | null;
    service_name?: string | null;
    product_id: string | null;
    product_name?: string | null;
    payment_method: PaymentMethod;
    tip: number;
    price: number;
    commission_percentage: number;
    commission_amount: number;
    discount_amount: number;
    total_amount: number;
    loyalty_discount_applied: boolean;
    barber_total?: number;
    barbershop_revenue?: number;
    created_at: string;
}

export interface PaginatedAppointments {
    content: Appointment[];
    page: number;
    size: number;
    total_elements: number;
    total_pages: number;
    sort: string;
    direction: string;
    has_next: boolean;
    has_previous: boolean;
}

export interface AppointmentFilters {
    page?: number;
    size?: number;
    search?: string;
    type?: AppointmentType | '';
    payment_method?: PaymentMethod | '';
    barber_id?: string;
    date_from?: string;
    date_to?: string;
}

export interface RegisterServiceAppointmentRequest {
    payment_method: PaymentMethod;
    customer_id?: string;
    service_id: string;
    tip?: number;
}

export interface RegisterProductAppointmentRequest {
    payment_method: PaymentMethod;
    customer_id?: string;
    product_id: string;
    tip?: number;
}

export interface UpdateAppointmentRequest {
    customer_id: string;
}