export interface Service {
    id: string;
    name: string;
    price: number;
    commission_percentage: number;
    created_at: string;
    modified_at: string;
}

export interface CreateServiceRequest {
    name: string;
    price: number;
    commission_percentage: number;
}

export interface UpdateServiceRequest {
    name?: string;
    price?: number;
    commission_percentage?: number;
}