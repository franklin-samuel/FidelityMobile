import { httpClient } from '../utils/http-client';
import type { User, CreateUserRequest } from '../types/user';

export const userService = {
    list: async (): Promise<User[]> => {
        const response = await httpClient.get<User[]>('/user');
        return response.data || [];
    },

    create: async (data: CreateUserRequest): Promise<User> => {
        const response = await httpClient.post<User>('/user', data);
        return response.data!;
    },
};