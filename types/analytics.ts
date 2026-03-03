export interface ChannelData {
    channel: string;
    customer_count: number;
    percentage: number;
}

export interface StyleData {
    style: string;
    count: number;
    percentage: number;
}

export interface TopCustomer {
    name: string;
    total_spent: number;
    visits_count: number;
}

export interface ChannelRevenue {
    channel: string;
    average_ticket: number;
    customer_count: number;
}

export interface AnalyticsData {
    total_customers: number;
    average_ticket: number;
    total_revenue: number;
    retention_rate: number;
    customers_by_age_group: Record<string, number>;
    customers_by_gender: Record<string, number>;
    acquisition_channels: ChannelData[];
    popular_styles: StyleData[];
    preferred_frequency: Record<string, number>;
    top_customers: TopCustomer[];
    avg_ticket_by_age: Record<string, number>;
    channel_vs_revenue: ChannelRevenue[];
}