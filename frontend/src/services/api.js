const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('greencart_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async forgotPassword(email) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token, newPassword) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }

  async refreshToken() {
    return this.request('/auth/refresh', {
      method: 'POST',
    });
  }

  // User endpoints
  async getCurrentUser() {
    return this.request('/users/me');
  }

  async updateUser(userId, userData) {
    return this.request(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(userId) {
    return this.request(`/users/${userId}`, {
      method: 'DELETE',
    });
  }

  // Admin user management
  async getAllUsers() {
    return this.request('/admin/users');
  }

  async updateUserStatus(userId, status) {
    return this.request(`/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Products endpoints
  async getAllProducts(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/products?${queryParams}`);
  }

  async getProduct(productId) {
    return this.request(`/products/${productId}`);
  }

  async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(productId, productData) {
    return this.request(`/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(productId) {
    return this.request(`/products/${productId}`, {
      method: 'DELETE',
    });
  }

  // Categories endpoints
  async getAllCategories() {
    return this.request('/admin/categories');
  }

  async createCategory(categoryData) {
    return this.request('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(categoryId, categoryData) {
    return this.request(`/admin/categories/${categoryId}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(categoryId) {
    return this.request(`/admin/categories/${categoryId}`, {
      method: 'DELETE',
    });
  }

  // Cart endpoints
  async getCart() {
    return this.request('/cart');
  }

  async addToCart(productId, quantity = 1) {
    return this.request('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async updateCartItem(itemId, quantity) {
    return this.request(`/cart/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(itemId) {
    return this.request(`/cart/items/${itemId}`, {
      method: 'DELETE',
    });
  }

  async clearCart() {
    return this.request('/cart', {
      method: 'DELETE',
    });
  }

  // Orders endpoints
  async createOrder() {
    return this.request('/orders/checkout', {
      method: 'POST',
    });
  }

  async getOrders() {
    return this.request('/orders');
  }

  async getSellerOrders() {
    return this.request('/orders/seller');
  }

  async getOrder(orderId) {
    return this.request(`/orders/${orderId}`);
  }

  async updateOrderStatus(orderId, status) {
    return this.request(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async markOrderReady(orderId) {
    return this.request(`/orders/${orderId}/ready`, {
      method: 'POST',
    });
  }

  async confirmOrderPickup(orderId) {
    return this.request(`/orders/${orderId}/pickup-confirm`, {
      method: 'POST',
    });
  }

  // Admin orders management
  async getAllOrders() {
    return this.request('/admin/orders');
  }

  // File upload
  async uploadFile(file, type = 'product') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const url = `${this.baseURL}/upload`;
    const config = {
      method: 'POST',
      headers: {
        Authorization: this.getAuthHeaders().Authorization,
      },
      body: formData,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Upload failed! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  }

  // Upload methods
  async uploadProductImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = localStorage.getItem('greencart_token');
    if (!token) {
      throw new Error('Token d\'authentification manquant');
    }
    
    const response = await fetch(`${API_BASE_URL}/upload/product-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de l\'upload');
    }

    return response.json();
  }

  async uploadStudentProof(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = localStorage.getItem('greencart_token');
    if (!token) {
      throw new Error('Token d\'authentification manquant');
    }
    
    const response = await fetch(`${API_BASE_URL}/upload/student-proof`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de l\'upload');
    }

    return response.json();
  }

  // Search and filters
  async searchProducts(query, filters = {}) {
    const params = new URLSearchParams();
    if (query) params.append('search', query);
    if (filters.type && filters.type !== 'all') params.append('type', filters.type);
    if (filters.region && filters.region !== 'all') params.append('region', filters.region);
    if (filters.solidaire) params.append('solidaire', 'true');
    if (filters.categoryId) params.append('categoryId', filters.categoryId);
    
    const response = await this.request(`/products/search?${params.toString()}`);
    return response;
  }

  // Analytics and stats (admin only)
  async getDashboardStats() {
    return this.request('/admin/stats');
  }

  async getSalesReport(startDate, endDate) {
    const params = new URLSearchParams({
      startDate,
      endDate,
    });
    return this.request(`/admin/reports/sales?${params}`);
  }

  // Notifications
  async getNotifications() {
    return this.request('/notifications');
  }

  async markNotificationAsRead(notificationId) {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  // Shop endpoints
  async getShopProducts(search = '', filters = {}) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (filters.type && filters.type !== 'all') params.append('type', filters.type);
    if (filters.region && filters.region !== 'all') params.append('region', filters.region);
    if (filters.solidaire) params.append('solidaire', 'true');
    if (filters.categoryId) params.append('categoryId', filters.categoryId);
    
    const response = await this.request(`/shop/products?${params.toString()}`);
    return response;
  }

  async getFeaturedProducts() {
    const response = await this.request('/shop/products/featured');
    return response;
  }

  async getProductsByCategory(categoryId) {
    const response = await this.request(`/shop/products/category/${categoryId}`);
    return response;
  }

  async getCategories() {
    const response = await this.request('/shop/categories');
    return response;
  }

  // Regions
  getRegions() {
    return [
      { id: 'ile-de-france', name: 'Île-de-France', code: 'IDF' },
      { id: 'auvergne-rhone-alpes', name: 'Auvergne-Rhône-Alpes', code: 'ARA' },
      { id: 'bourgogne-franche-comte', name: 'Bourgogne-Franche-Comté', code: 'BFC' },
      { id: 'bretagne', name: 'Bretagne', code: 'BRE' },
      { id: 'centre-val-de-loire', name: 'Centre-Val de Loire', code: 'CVL' },
      { id: 'corse', name: 'Corse', code: 'COR' },
      { id: 'grand-est', name: 'Grand Est', code: 'GES' },
      { id: 'hauts-de-france', name: 'Hauts-de-France', code: 'HDF' },
      { id: 'normandie', name: 'Normandie', code: 'NOR' },
      { id: 'nouvelle-aquitaine', name: 'Nouvelle-Aquitaine', code: 'NAQ' },
      { id: 'occitanie', name: 'Occitanie', code: 'OCC' },
      { id: 'pays-de-la-loire', name: 'Pays de la Loire', code: 'PDL' },
      { id: 'provence-alpes-cote-azur', name: 'Provence-Alpes-Côte d\'Azur', code: 'PAC' },
      { id: 'guadeloupe', name: 'Guadeloupe', code: 'GUA' },
      { id: 'guyane', name: 'Guyane', code: 'GUY' },
      { id: 'martinique', name: 'Martinique', code: 'MAR' },
      { id: 'mayotte', name: 'Mayotte', code: 'MAY' },
      { id: 'reunion', name: 'Réunion', code: 'REU' },
    ];
  }

  // Favorites endpoints
  async addToFavorites(productId) {
    const response = await this.request(`/favorites/${productId}`, { method: 'POST' });
    return response;
  }

  async removeFromFavorites(productId) {
    const response = await this.request(`/favorites/${productId}`, { method: 'DELETE' });
    return response;
  }

  async getUserFavorites() {
    const response = await this.request('/favorites');
    return response;
  }

  async checkIfFavorite(productId) {
    const response = await this.request(`/favorites/check/${productId}`);
    return response;
  }

  // Error handling utility
  handleError(error) {
    if (error.message.includes('401')) {
      // Unauthorized - redirect to login
      localStorage.removeItem('greencart_token');
      localStorage.removeItem('greencart_user');
      window.location.href = '/login';
    }
    throw error;
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
