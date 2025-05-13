import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if it exists
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Проверяем, не истек ли токен
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Пытаемся декодировать JWT токен
          const payload = JSON.parse(atob(token.split('.')[1]));
          const expirationTime = payload.exp * 1000; // конвертируем в миллисекунды
          
          if (Date.now() >= expirationTime) {
            console.log('Token expired, clearing auth data');
            localStorage.removeItem('token');
            window.location.href = '/'; // Редирект на главную
          }
        } catch (e) {
          console.error('Error parsing token:', e);
          localStorage.removeItem('token');
          window.location.href = '/';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Products API
export const productsApi = {
  getAll: () => api.get('/product'),
  getById: (id: string) => api.get(`/product/${id}`),
  create: (data: any) => api.post('/product', data),
  update: (id: string, data: any) => api.patch(`/product/${id}`, data),
  delete: (id: string) => api.delete(`/product/${id}`),
  getImage: (path: string) => `${api.defaults.baseURL}/product/image/${path}`,
};

// Cart API
export const cartApi = {
  getCart: () => api.get('/cart'),
  addToCart: (data: any) => api.post('/cart/add', data),
  updateCartItem: (itemId: string, data: any) => api.patch(`/cart/items/${itemId}`, data),
  removeFromCart: (itemId: string) => api.delete(`/cart/items/${itemId}`),
  clearCart: () => api.delete('/cart/clear'),
};

// Orders API
export const ordersApi = {
  create: (data: any) => api.post('/orders', data),
  getAll: () => api.get('/orders'),
  getById: (id: string) => api.get(`/orders/${id}`),
  update: (id: string, data: any) => api.put(`/orders/${id}`, data),
  delete: (id: string) => api.delete(`/orders/${id}`),
};

// Auth API
export const authApi = {
  login: (data: { username: string; password: string }) => 
    api.post('/auth/login', data),
  register: (data: { 
    username: string; 
    password: string; 
    email: string; 
    phone: string;
    firstName: string;
  }) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
  logout: () => api.post('/auth/logout'),
};

// User API
export const userApi = {
  getProfile: () => api.get('/users/me'),
  updateMeasurements: (data: any) => api.patch('/users/measurements', data),
  getMeasurements: () => api.get('/users/measurements'),
};

// Category API
export const categoryApi = {
  getAll: () => api.get('/category'),
  getById: (id: string) => api.get(`/category/${id}`),
  create: (data: any) => api.post('/category', data),
  update: (id: string, data: any) => api.patch(`/category/${id}`, data),
  delete: (id: string) => api.delete(`/category/${id}`),
};

export default api; 