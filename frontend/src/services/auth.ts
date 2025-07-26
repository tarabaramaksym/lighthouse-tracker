import { apiService } from './api';
import type { LoginRequest, RegisterRequest, AuthResponse, User } from '@/types';

export class AuthService {
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiService.auth.login(credentials);
	  const { token, user } = response;

      this.setToken(token);
      this.setUser(user);

      return response;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiService.auth.register(userData);
	  const { token, user } = response;

      this.setToken(token);
      this.setUser(user);

      return response;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const token = this.getToken();
      if (!token) return null;

      const response = await apiService.auth.getMe();
      this.setUser(response.user);
      return response.user;
    } catch (error: any) {
      this.logout();
      return null;
    }
  }

  static logout(): void {
    this.removeToken();
    this.removeUser();
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static getToken(): string | null {
    return localStorage.getItem('token');
  }

  static getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  private static setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  private static setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  private static removeToken(): void {
    localStorage.removeItem('token');
  }

  private static removeUser(): void {
    localStorage.removeItem('user');
  }

  private static handleError(error: any): Error {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    return new Error(message);
  }
} 