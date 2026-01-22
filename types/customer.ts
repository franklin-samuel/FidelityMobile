export interface Customer {
    id: string;
    name: string;
    email: string;
    phone_number: string;
    haircut_count: number;
    free_haircuts_claimed: number;
    created_at: string;
    updated_at: string;
}

export interface CreateCustomerRequest {
    name: string;
    email: string;
    phone_number: string;
}

export interface UpdateCustomerRequest {
    name: string;
    email: string;
    phone_number: string;
}