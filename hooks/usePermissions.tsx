import { useAuth } from './useAuth';

type Role = 'ADMIN' | 'BARBER';

interface PermissionConfig {
    allowedRoles: Role[];
}

const PERMISSIONS = {
    analytics: { allowedRoles: ['ADMIN'] as Role[] },
    catalog: { allowedRoles: ['ADMIN'] as Role[] },
    barbers: { allowedRoles: ['ADMIN'] as Role[] },
    admins: { allowedRoles: ['ADMIN'] as Role[] },
    settings: { allowedRoles: ['ADMIN'] as Role[] },
    dashboard: { allowedRoles: ['ADMIN', 'BARBER'] as Role[] },
    appointments: { allowedRoles: ['ADMIN', 'BARBER'] as Role[] },
    sales: { allowedRoles: ['ADMIN', 'BARBER'] as Role[] },
    clients: { allowedRoles: ['ADMIN', 'BARBER'] as Role[] },
} as const;

type PermissionKey = keyof typeof PERMISSIONS;

export function usePermissions() {
    const { user } = useAuth();

    const hasPermission = (key: PermissionKey): boolean => {
        if (!user) return false;
        const permission = PERMISSIONS[key];
        return permission.allowedRoles.includes(user.role);
    };

    const isAdmin = user?.role === 'ADMIN';
    const isBarber = user?.role === 'BARBER';

    return {
        hasPermission,
        isAdmin,
        isBarber,
        userRole: user?.role,
    };
}