import { defineStore } from 'pinia';
import StorageService from '@/utils/services/base/StorageService';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    role: StorageService.get('role') || '',
    accessToken: StorageService.get('accessToken') || '',
    refreshToken: StorageService.get('refreshToken') || '',
    isAuthenticated: !!StorageService.get('accessToken')
  }),
  actions: {
    setRole(role: string) {
      this.role = role;

      StorageService.set('role', role);
    },
    setTokens(accessToken: string, refreshToken: string) {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      this.isAuthenticated = true;

      StorageService.set('accessToken', accessToken);
      StorageService.set('refreshToken', refreshToken);
    },
    clearUser() {
      this.role = '';
      this.accessToken = '';
      this.refreshToken = '';
      this.isAuthenticated = false;

      StorageService.remove('role');
      StorageService.remove('accessToken');
      StorageService.remove('refreshToken');
    },
  },
});
