import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '../services/settings.service';
import type { UpdateSettingsRequest } from '../types/settings';

export const SETTINGS_QUERY_KEY = 'settings';

export const useSettings = () => {
    return useQuery({
        queryKey: [SETTINGS_QUERY_KEY],
        queryFn: () => settingsService.get(),
    });
};

export const useUpdateSettings = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateSettingsRequest) => settingsService.update(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [SETTINGS_QUERY_KEY] });
        },
    });
};