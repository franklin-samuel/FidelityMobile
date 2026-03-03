export interface LoyaltyStatus {
    has_discount: boolean;
    service_count: number;
    discounts_claimed: number;
    original_price: number | null;
    discount_amount: number | null;
    total_amount: number | null;
}