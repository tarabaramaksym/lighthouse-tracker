import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type { LoginRequest, RegisterRequest, AuthResponse } from '@/types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiService {
	private api: AxiosInstance;

	constructor() {
		this.api = axios.create({
			baseURL: API_BASE,
			headers: {
				'Content-Type': 'application/json',
			},
		});

		this.setupInterceptors();
	}

	private setupInterceptors() {
		this.api.interceptors.request.use(
			(config) => {
				const token = localStorage.getItem('token');
				if (token) {
					config.headers.Authorization = `Bearer ${token}`;
				}
				return config;
			},
			(error) => Promise.reject(error)
		);

		this.api.interceptors.response.use(
			(response) => response,
			(error) => {
				if (error.response?.status === 401) {
					localStorage.removeItem('token');
					localStorage.removeItem('user');
				}
				return Promise.reject(error);
			}
		);
	}

	public auth = {
		login: async (credentials: LoginRequest): Promise<AuthResponse> => {
			const response: AxiosResponse<AuthResponse> = await this.api.post('/api/auth/login', credentials);

			return response.data;
		},

		register: async (userData: RegisterRequest): Promise<AuthResponse> => {
			const response: AxiosResponse<AuthResponse> = await this.api.post('/api/auth/register', userData);

			return response.data;
		},

		getMe: async (): Promise<AuthResponse> => {
			const response: AxiosResponse<AuthResponse> = await this.api.get('/api/auth/me');
			return response.data;
		},
	};
}

export const apiService = new ApiService(); 