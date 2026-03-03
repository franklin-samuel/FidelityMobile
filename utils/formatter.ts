
export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value ?? 0);
};

export const formatCurrencyShort = (value: number): string => {
    if (value >= 1000) {
        return `R$ ${(value / 1000).toFixed(1)}k`;
    }
    return `R$ ${value?.toFixed(0)}`;
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
    return `${value.toFixed(decimals)}%`;
};

export const getGenderLabel = (gender: string): string => {
    const labels: Record<string, string> = {
        MALE: 'Masculino',
        FEMALE: 'Feminino',
        OTHER: 'Outro',
        NOT_INFORMED: 'Não informado',
    };
    return labels[gender] ?? gender;
};

export const getReferralSourceLabel = (source: string): string => {
    const labels: Record<string, string> = {
        INSTAGRAM: 'Instagram',
        INDICATION: 'Indicação',
        GOOGLE: 'Google',
        FACEBOOK: 'Facebook',
        OUTDOOR: 'Outdoor',
        WALKING: 'Passando na frente',
        OTHERS: 'Outros',
        NOT_INFORMED: 'Não informado',
    };
    return labels[source] ?? source;
};

export const getStyleLabel = (style: string): string => {
    const labels: Record<string, string> = {
        LOW_FADE: 'Low Fade',
        MEDIUM_FADE: 'Medium Fade',
        HIGH_FADE: 'High Fade',
        TAPER_FADE: 'Taper Fade',
        BALD: 'Careca / Navalhado',
        SOCIAL: 'Social',
        CLASSIC: 'Clássico',
        OTHERS: 'Outros',
        NOT_INFORMED: 'Não informado',
    };
    return labels[style] ?? style;
};

export const getFrequencyLabel = (frequency: string): string => {
    const labels: Record<string, string> = {
        SEMANAL: 'Semanal',
        QUINZENAL: 'Quinzenal',
        MENSAL: 'Mensal',
        BIMENSAL: 'Bimensal',
        TRIMENSAL: 'Trimestral',
        NOT_INFORMED: 'Não informado',
    };
    return labels[frequency] ?? frequency;
};

export const getPaymentMethodLabel = (method: string): string => {
    const labels: Record<string, string> = {
        PIX: 'Pix',
        MONEY: 'Dinheiro',
        CREDIT: 'Crédito',
        DEBIT: 'Débito',
    };
    return labels[method] ?? method;
};