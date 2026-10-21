// API Client for Shimoga Business Directory & SEO Platform

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('shimoga_token');
};

export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('shimoga_token', token);
  }
};

export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('shimoga_token');
    localStorage.removeItem('shimoga_user');
  }
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body?: any) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' }),
};

// Auth API Endpoints
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post<any>('/auth/login', credentials),
  register: (payload: any) =>
    api.post<any>('/auth/register', payload),
  getMe: () =>
    api.get<any>('/auth/me'),
  updateProfile: (data: any) =>
    api.put<any>('/auth/profile', data),
  changePassword: (data: any) =>
    api.put<any>('/auth/change-password', data),
  forgotPassword: (email: string) =>
    api.post<any>('/auth/forgot-password', { email }),
  resetPassword: (code: string, password: string) =>
    api.post<any>('/auth/reset-password', { code, password }),
};

// Business API Endpoints
export const businessAPI = {
  getAll: (params?: Record<string, string | number>) => {
    const query = params
      ? '?' +
        Object.entries(params)
          .filter(([_, v]) => v !== undefined && v !== '')
          .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
          .join('&')
      : '';
    return api.get<any>(`/businesses${query}`);
  },
  getFeatured: () =>
    api.get<any>('/businesses/featured'),
  getBySlug: (slug: string) =>
    api.get<any>(`/businesses/${slug}`),
  trackInteraction: (businessId: string, action: 'call' | 'whatsapp' | 'website' | 'directions' | 'view') =>
    api.post<any>(`/businesses/${businessId}/track`, { action }),
  getMyDashboard: () =>
    api.get<any>('/businesses/my/dashboard'),
  updateMyProfile: (data: any) =>
    api.put<any>('/businesses/my/profile', data),
  renewSubscription: (duration: '1 month' | '6 months' | '1 year') =>
    api.post<any>('/businesses/my/renew', { duration }),
};

// Admin API Endpoints
export const adminAPI = {
  getDashboard: () =>
    api.get<any>('/admin/dashboard'),
  getBusinesses: (params?: Record<string, string | number>) => {
    const query = params
      ? '?' +
        Object.entries(params)
          .filter(([_, v]) => v !== undefined && v !== '')
          .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
          .join('&')
      : '';
    return api.get<any>(`/admin/businesses${query}`);
  },
  createBusiness: (data: any) =>
    api.post<any>('/admin/businesses', data),
  updateBusiness: (id: string, data: any) =>
    api.put<any>(`/admin/businesses/${id}`, data),
  deleteBusiness: (id: string) =>
    api.delete<any>(`/admin/businesses/${id}`),
  getUsers: () =>
    api.get<any>('/admin/users'),
  createCategory: (data: any) =>
    api.post<any>('/admin/categories', data),
  deleteCategory: (id: string) =>
    api.delete<any>(`/admin/categories/${id}`),
};

// Categories & Leads & Reviews
export const categoryAPI = {
  getAll: () => api.get<any>('/categories'),
};

export const leadAPI = {
  submit: (leadData: {
    businessId: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    serviceNeeded?: string;
    message: string;
  }) => api.post<any>('/leads', leadData),
  getMyLeads: () => api.get<any>('/leads/my'),
};

export const reviewAPI = {
  submit: (reviewData: {
    businessId: string;
    name: string;
    rating: number;
    comment: string;
  }) => api.post<any>('/reviews', reviewData),
};
