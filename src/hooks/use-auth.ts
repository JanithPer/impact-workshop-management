import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { useAuthStore } from '@/stores/auth.store';
import { LoginFormData } from '@/schemas/auth';

export const useLogin = () => {
  const loginStore = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      const response = await api.post('/auth/sign-in', data);
      return response.data;
    },
    onSuccess: (data) => {
      loginStore(data.data.token, data.data.user);
      window.location.href = '/';
    },
  });
};