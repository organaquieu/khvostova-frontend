// src/lib/api.mock.ts

export const productsApi = {
  getAll: async () => ({ data: [{ id: '1', name: 'Mock Product', price: 100, image: '', productType: 'dress' }] }),
  getById: async (id: string) => ({ data: { id, name: 'Mock Product', price: 100, image: '', productType: 'dress' } }),
  create: async (data: any) => ({ data }),
  update: async (id: string, data: any) => ({ data }),
  delete: async (id: string) => ({ data: true }),
  getImage: (path: string) => `/mock-image.png`,
};

export const cartApi = {
  getCart: async () => ({ data: [] }),
  addToCart: async (data: any) => ({ data }),
  updateCartItem: async (itemId: string, data: any) => ({ data }),
  removeFromCart: async (itemId: string) => ({ data: true }),
  clearCart: async () => ({ data: true }),
};

export const ordersApi = {
  create: async (data: any) => ({ data }),
  getAll: async () => ({ data: [] }),
  getById: async (id: string) => ({ data: {} }),
  update: async (id: string, data: any) => ({ data }),
  delete: async (id: string) => ({ data: true }),
};

export const authApi = {
  login: async (data: { username: string; password: string }) => ({ data: { token: 'mock-token' } }),
  register: async (data: any) => ({ data: { token: 'mock-token' } }),
  getProfile: async () => ({ data: { id: '1', username: 'mockuser' } }),
  logout: async () => ({ data: true }),
};

export const userApi = {
  getProfile: async () => ({ data: { id: '1', username: 'mockuser' } }),
  updateMeasurements: async (data: any) => ({ data }),
  getMeasurements: async () => ({ data: {} }),
};

export const categoryApi = {
  getAll: async () => ({ data: [] }),
  getById: async (id: string) => ({ data: {} }),
  create: async (data: any) => ({ data }),
  update: async (id: string, data: any) => ({ data }),
  delete: async (id: string) => ({ data: true }),
}; 