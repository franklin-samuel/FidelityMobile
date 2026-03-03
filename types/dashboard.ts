export interface DailyRevenue {
    date: string;
    amount: number;
}

export interface BarberPerformance {
    barber_name: string;
    total_revenue: number;
    appointments_count: number;
}

export interface AdminDashboardMetrics {
    today_revenue: number;
    week_revenue: number;
    month_revenue: number;
    last_30_days_revenue: DailyRevenue[];
    current_month_revenue: number;
    previous_month_revenue: number;
    monthly_growth_percentage: number;
    top_barbers: BarberPerformance[];
    services_revenue: number;
    products_revenue: number;
}

export interface BarberDashboardMetrics {
    today_earnings: number;
    week_earnings: number;
    month_earnings: number;
    last_30_days_earnings: DailyRevenue[];
    month_appointments: number;
    month_average_ticket: number;
    month_total_tips: number;
    month_commission: number;
    month_tips: number;
}

export type DashboardMetrics = AdminDashboardMetrics | BarberDashboardMetrics;

export function isAdminMetrics(m: DashboardMetrics): m is AdminDashboardMetrics {
    return 'today_revenue' in m;
}