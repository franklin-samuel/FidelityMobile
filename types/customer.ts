export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | 'NOT_INFORMED';
export type ReferralSource = 'INSTAGRAM' | 'INDICATION' | 'GOOGLE' | 'FACEBOOK' | 'OUTDOOR' | 'WALKING' | 'OTHERS' | 'NOT_INFORMED';
export type PreferredFrequency = 'SEMANAL' | 'QUINZENAL' | 'MENSAL' | 'BIMENSAL' | 'TRIMENSAL' | 'NOT_INFORMED';
export type PreferredStyle = 'LOW_FADE' | 'MEDIUM_FADE' | 'HIGH_FADE' | 'TAPER_FADE' | 'BALD' | 'SOCIAL' | 'CLASSIC' | 'OTHERS' | 'NOT_INFORMED';

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone_number: string;
    service_count: number;
    discounts_claimed: number;
    date_of_birth?: string | null;
    gender?: Gender | null;
    referral_source?: ReferralSource | null;
    preferred_frequency?: PreferredFrequency | null;
    preferred_style?: PreferredStyle | null;
    preferred_barber_id?: string | null;
    instagram_username?: string | null;
    occupation?: string | null;
    last_visit_date?: string | null;
    total_spent?: number | null;
    created_at: string;
    modified_at: string;
}

export interface CreateCustomerRequest {
    name: string;
    email: string;
    phone_number: string;
    date_of_birth?: string | null;
    gender?: Gender | null;
    referral_source?: ReferralSource | null;
    preferred_frequency?: PreferredFrequency | null;
    preferred_style?: PreferredStyle | null;
    preferred_barber_id?: string | null;
    instagram_username?: string | null;
    occupation?: string | null;
}

export interface UpdateCustomerRequest {
    name: string;
    email: string;
    phone_number: string;
}