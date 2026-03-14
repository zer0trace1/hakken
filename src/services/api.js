import axios from "axios";
import { getAccessToken, userManager } from "@/auth/oidc";

const API_BASE_URL = "https://api.hakken.cloud/api/v1";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
});

// ====== Interceptor: inyectar access_token en cada request ======
apiClient.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ====== Interceptor: manejo global + intento de refresh (opcional) ======
let isRefreshing = false;
let refreshPromise = null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const originalRequest = error?.config;

    // Si no hay config, o no es 401, o ya reintentamos -> log y fuera
    if (!originalRequest || status !== 401 || originalRequest._retry) {
      console.error("API Error:", error);
      return Promise.reject(error);
    }

    // Marcamos reintento para evitar bucles
    originalRequest._retry = true;

    try {
      // Intento de renovar tokens (solo si tienes silent renew configurado)
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = userManager.signinSilent(); // requiere silent_redirect_uri + sesión cognito
      }

      await refreshPromise;

      // Tras renovar, volvemos a poner token y repetimos
      const newToken = await getAccessToken();
      if (newToken) {
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
      }

      return apiClient(originalRequest);
    } catch (refreshErr) {
      // Si no se puede renovar, devolvemos el 401 original
      console.error("Auth refresh failed:", refreshErr);
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  }
);

// Exportar todas las funciones de búsqueda
export default {

  // ==================== NAME ====================
  async searchPerson(name, context = "") {
    try {
      const response = await apiClient.post(`/search/person/`, {name, context});
      return response.data;
    } catch (error) {
      throw error;
    }
  },


  // ==================== USERNAME ====================
  async searchUsername(username) {
    try {
      const safe = encodeURIComponent(username);
      const response = await apiClient.get(`/search/username/${safe}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ==================== IP ====================
  async searchIP(ip) {
    try {
      const safe = encodeURIComponent(ip);
      const response = await apiClient.get(`/search/ip/${safe}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ==================== DOMINIO ====================
  async searchDomain(domain) {
    try {
      const safe = encodeURIComponent(domain);
      const response = await apiClient.get(`/search/domain/${safe}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ==================== EMAIL (Para futuro) ====================
  async searchEmail(email) {
    try {
      const safe = encodeURIComponent(email);
      const response = await apiClient.get(`/search/email/${safe}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ==================== TELÉFONO ====================
  async searchPhone(phone, defaultRegion = 'ES') {
    try {
      const safe = encodeURIComponent(phone);
      const response = await apiClient.get(`/search/phone/${safe}`, {
        params: { default_region: defaultRegion },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async reportPhone(phone, category, comment = null) {
    const response = await apiClient.post(`/phone/report`, {
      phone,
      category,
      comment,
    });
    return response.data;
  },

  // ==================== IMAGE ====================
  async searchImage(file) {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await apiClient.post('/search/image', formData, {
        headers: {}
      })

      return response.data
    } catch (error) {
      throw error
    }
  },

  // ==================== UTILIDADES ====================
  async healthCheck() {
    try {
      const response = await apiClient.get("/health", {
        baseURL: API_BASE_URL.replace("/api/v1", ""),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getApiInfo() {
    try {
      const response = await apiClient.get("/", {
        baseURL: API_BASE_URL.replace("/api/v1", ""),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ==================== HISTORY ====================
  async getHistory({ type = null, limit = 50, offset = 0 } = {}) {
    try {
      const params = { limit, offset };
      if (type) params.type = type;
      const response = await apiClient.get(`/history`, { params });
      return response.data; // { items: [...] }
    } catch (error) {
      throw error;
    }
  },

  async clearHistory(type = null) {
    try {
      const params = {};
      if (type) params.type = type;
      const response = await apiClient.delete(`/history`, { params });
      return response.data; // { deleted: n }
    } catch (error) {
      throw error;
    }
  },

  async deleteHistoryItem(rid) {
    try {
      // rid tipo "query_log:xxxx" -> encode para URL
      const safeRid = encodeURIComponent(rid);
      const response = await apiClient.delete(`/history/${safeRid}`);
      return response.data; // { ok: true }
    } catch (error) {
      throw error;
    }
  },
};
