/**
 * useAuth.ts — React Query mutation hooks for auth API calls.
 *
 * Do NOT confuse with AuthContext (which manages the global auth state).
 * These hooks are for one-off auth actions like password management.
 */
import { useMutation, useQuery } from '@tanstack/react-query';
import {
    forgotPassword,
    resetPassword,
    changePassword,
    refreshToken,
    getProfile,
} from '@/services/api/authApi';
import type { ResetPasswordDto, ChangePasswordDto } from '@/services/api/types';

/** Fetch the current logged-in user's profile. */
export const useProfile = (enabled = true) => {
    return useQuery({
        queryKey: ['auth', 'profile'],
        queryFn: getProfile,
        enabled,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
    });
};

/** Send a password-reset email. */
export const useForgotPassword = () => {
    return useMutation({
        mutationFn: (email: string) => forgotPassword(email),
    });
};

/** Reset password using the token from the email. */
export const useResetPassword = () => {
    return useMutation({
        mutationFn: (dto: ResetPasswordDto) => resetPassword(dto),
    });
};

/** Change password while logged in. */
export const useChangePassword = () => {
    return useMutation({
        mutationFn: (dto: ChangePasswordDto) => changePassword(dto),
    });
};

/** Refresh the access token. */
export const useRefreshToken = () => {
    return useMutation({
        mutationFn: refreshToken,
    });
};
