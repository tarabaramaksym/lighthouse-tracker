export interface User {
	id: number;
	email: string;
	is_read_only?: boolean;
	plan?: 'free' | 'pro' | 'pro-plus';
	created_at: string;
	updated_at: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterRequest {
	email: string;
	password: string;
}

export interface AuthResponse {
	token: string;
	user: User;
	message?: string;
}

export interface AuthError {
	message: string;
	status?: number;
}

export interface AuthState {
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
} 