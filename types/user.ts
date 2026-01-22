export interface User {
    id: string;
    name: string;
    email: string;
    created_at: string;
}

export interface CreateUserRequest {
    name: string;
    email: string;
    password: string;
}