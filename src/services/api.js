import axios from 'axios'

const API_BASE_URL = 'https://api.hakken.cloud:8000/api/v1'

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Interceptor para manejar errores globalmente
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

// Exportar todas las funciones de búsqueda
export default {
  // ==================== USERNAME ====================
  
  /**
   * Busca un usuario en GitHub
   * @param {string} username - Nombre de usuario a buscar
   * @returns {Promise} Datos del usuario de GitHub
   */
  async searchGitHubUser(username) {
    try {
      const response = await apiClient.get(`/search/github/user/${username}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Busca un usuario en Reddit (cuando esté implementado)
   * @param {string} username - Nombre de usuario a buscar
   * @returns {Promise} Datos del usuario de Reddit
   */
  async searchRedditUser(username) {
    try {
      const response = await apiClient.get(`/search/reddit/user/${username}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // ==================== IP ====================
  
  /**
   * Busca información de geolocalización de una IP
   * @param {string} ip - Dirección IP a buscar (ej: 8.8.8.8)
   * @returns {Promise} Datos de geolocalización de la IP
   */
  async searchIP(ip) {
    try {
      const response = await apiClient.get(`/search/ip/${ip}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // ==================== DOMINIO ====================
  
  /**
   * Busca información DNS de un dominio
   * @param {string} domain - Dominio a buscar (ej: google.com)
   * @returns {Promise} Datos DNS del dominio
   */
  async searchDomain(domain) {
    try {
      const response = await apiClient.get(`/search/domain/${domain}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // ==================== EMAIL (Para futuro) ====================
  
  /**
   * Busca información de un email
   * @param {string} email - Email a buscar
   * @returns {Promise} Datos del email
   */
  async searchEmail(email) {
    try {
      const response = await apiClient.get(`/search/email/${email}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // ==================== TELÉFONO (Para futuro) ====================
  
  /**
   * Busca información de un teléfono
   * @param {string} phone - Teléfono a buscar
   * @returns {Promise} Datos del teléfono
   */
  async searchPhone(phone) {
    try {
      const response = await apiClient.get(`/search/phone/${phone}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // ==================== UTILIDADES ====================
  
  /**
   * Verifica el estado del backend
   * @returns {Promise} Estado del servicio
   */
  async healthCheck() {
    try {
      const response = await apiClient.get('/health', {
        baseURL: API_BASE_URL.replace('/api/v1', '')
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Obtiene información general de la API
   * @returns {Promise} Info de la API
   */
  async getApiInfo() {
    try {
      const response = await apiClient.get('/', {
        baseURL: API_BASE_URL.replace('/api/v1', '')
      })
      return response.data
    } catch (error) {
      throw error
    }
  }
}