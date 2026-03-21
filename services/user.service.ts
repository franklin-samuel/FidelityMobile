import { httpClient } from '../utils/http-client';
import type { User, CreateUserRequest, DeleteUserRequest } from '../types/user';

export const userService = {
    list: async (): Promise<User[]> => {
        const response = await httpClient.get<User[]>('/user');
        return Array.isArray(response.data) ? response.data : [];    },

    create: async (data: CreateUserRequest): Promise<User> => {
        const response = await httpClient.post<User>('/user', data);
        return response.data!;
    },

    delete: async (userId: string, data: DeleteUserRequest): Promise<void> => {
        await httpClient.post(`/user/${userId}/delete`, data);
    },
};