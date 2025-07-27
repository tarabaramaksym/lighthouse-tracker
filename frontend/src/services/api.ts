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

	public domains = {
		getDomains: async (): Promise<any> => {
			const response: AxiosResponse<any> = await this.api.get('/api/domains');
			return response.data;
		},

		createDomain: async (url: string): Promise<any> => {
			const response: AxiosResponse<any> = await this.api.post('/api/domains', { url });
			return response.data;
		},

		deleteDomain: async (id: number): Promise<any> => {
			const response: AxiosResponse<any> = await this.api.delete(`/api/domains/${id}`);
			return response.data;
		},
	};

	public urls = {
		getUrls: async (domainId: number): Promise<any> => {
			const response: AxiosResponse<any> = await this.api.get(`/api/domains/${domainId}/urls`);
			return response.data;
		},

		createUrl: async (domainId: number, path: string): Promise<any> => {
			const response: AxiosResponse<any> = await this.api.post(`/api/domains/${domainId}/urls`, { path });
			return response.data;
		},

		deleteUrl: async (id: number): Promise<any> => {
			const response: AxiosResponse<any> = await this.api.delete(`/api/urls/${id}`);
			return response.data;
		},
	};

	public issues = {
		getDailyIssues: async (domainId: number, websiteId: number, date?: string): Promise<any> => {
			const url = date
				? `/api/domains/${domainId}/websites/${websiteId}/daily/${date}`
				: `/api/domains/${domainId}/websites/${websiteId}/daily`;
			const response: AxiosResponse<any> = await this.api.get(url);
			return response.data;
		},

		getCalendarData: async (domainId: number, websiteId: number, year: number, month: number): Promise<any> => {
			const response: AxiosResponse<any> = await this.api.get(`/api/domains/${domainId}/websites/${websiteId}/calendar/${year}/${month}`);
			return response.data;
		},

		getOldestDate: async (domainId: number, websiteId: number): Promise<any> => {
			const response: AxiosResponse<any> = await this.api.get(`/api/domains/${domainId}/websites/${websiteId}/oldest-date`);
			return response.data;
		},
	};
}

export const apiService = new ApiService(); 