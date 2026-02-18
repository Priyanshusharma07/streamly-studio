import { apiFetch } from './config';
import type { AuthUser, CreateUserDto } from './types';

export const getUsers = async (): Promise<AuthUser[]> => {
    return apiFetch<AuthUser[]>('/users');
};

export const createUser = async (dto: CreateUserDto): Promise<AuthUser> => {
    return apiFetch<AuthUser>('/users', {
        method: 'POST',
        body: JSON.stringify(dto),
    });
};
