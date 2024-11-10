import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Environment-specific configuration
const API_CONFIG = {
  BASE_URL: 'https://api.example.com', // Replace with actual API URL in production
  TIMEOUT: 30000,
  MOCK_DELAY: 300, // Milliseconds to simulate API delay in development
};

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: any
  ) {
    super(`${status}: ${statusText}`);
    this.name = 'ApiError';
  }
}

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        // Get token from storage
        const token = localStorage.getItem('auth_token');
        
        // If token exists, add it to headers
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response) {
          // Handle specific error cases
          switch (error.response.status) {
            case 401:
              // Handle unauthorized (e.g., clear token and redirect to login)
              localStorage.removeItem('auth_token');
              window.location.href = '/login';
              break;
            case 403:
              // Handle forbidden
              console.error('Access forbidden');
              break;
            case 404:
              // Handle not found
              console.error('Resource not found');
              break;
            case 500:
              // Handle server error
              console.error('Server error');
              break;
          }

          throw new ApiError(
            error.response.status,
            error.response.statusText,
            error.response.data
          );
        }
        
        throw error;
      }
    );
  }

  // Generic request method
  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.api.request(config);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  // HTTP method wrappers
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  // Mock API call for development
  public async mockApiCall<T>(data: T, delay: number = API_CONFIG.MOCK_DELAY): Promise<T> {
    await new Promise(resolve => setTimeout(resolve, delay));
    return data;
  }
}

// Export singleton instance
export const apiService = new ApiService();