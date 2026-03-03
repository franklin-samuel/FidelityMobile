export interface Product {
    id: string;
    name: string;
    price: number;
    commission_percentage: number;
    created_at: string;
    modified_at: string;
}

export interface CreateProductRequest {
    name: string;
    price: number;
    commission_percentage: number;
}

export interface UpdateProductRequest {
    name?: string;
    price?: number;
    commission_percentage?: number;
}