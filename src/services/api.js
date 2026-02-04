import axios from "axios";
import { getAccessToken, userManager } from "@/auth/oidc"; // <-- añade esto

const API_BASE_URL = "https://api.hakken.cloud/api/v1";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
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
  // ==================== USERNAME ====================
  async searchGitHubUser(username) {
    try {
      const response = await apiClient.get(`/search/github/user/${username}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async searchRedditUser(username) {
    try {
      const response = await apiClient.get(`/search/reddit/user/${username}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ==================== IP ====================
  async searchIP(ip) {
    try {
      const response = await apiClient.get(`/search/ip/${ip}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ==================== DOMINIO ====================
  async searchDomain(domain) {
    try {
      const response = await apiClient.get(`/search/domain/${domain}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ==================== EMAIL (Para futuro) ====================
  async searchEmail(email) {
    try {
      const response = await apiClient.get(`/search/email/${email}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // ==================== TELÉFONO (Para futuro) ====================
  async searchPhone(phone) {
    try {
      const response = await apiClient.get(`/search/phone/${phone}`);
      return response.data;
    } catch (error) {
      throw error;
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
};
