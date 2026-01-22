export interface Settings {
    id: string;
    haircuts_for_free: number;
}

export interface UpdateSettingsRequest {
    haircuts_for_free: number;
}