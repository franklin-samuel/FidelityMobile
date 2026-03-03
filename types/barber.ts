export interface Barber {
    id: string;
    name: string;
    email: string;
    role: 'BARBER';
    created_at: string;
}

export interface CreateBarberRequest {
    name: string;
    email: string;
    password: string;
}

export interface DeleteBarberRequest {
    email_confirmation: string;
}