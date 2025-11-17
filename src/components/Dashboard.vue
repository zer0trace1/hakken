<template>
  <div class="dashboard-container">
    <!-- Header/Navbar -->
    <header class="dashboard-header">
      <div class="header-content">
        <div class="back-button-wrapper">
          <button class="back-btn" @click="goBack">
            <span class="icon">←</span>
            Volver
          </button>
        </div>
        <div class="logo-section">
          <img src="@/assets/hakken-logo-no-bg-blanco.png" alt="Hakken" class="header-logo" />
        </div>
        <nav class="nav-section">
          <button 
            :class="['nav-btn', { active: currentView === 'search' }]" 
            @click="currentView = 'search'"
          >
            <span class="icon">
              <img src="@/assets/hakken-logo-busqueda.png" alt="hakken-logo-busqueda" class="card-icon-header">
            </span>
            Búsqueda
          </button>
          <button 
            :class="['nav-btn', { active: currentView === 'history' }]" 
            @click="currentView = 'history'"
          >
            <span class="icon">
              <img src="@/assets/hakken-logo-historial.png" alt="hakken-logo-historial" class="card-icon-header">
            </span>
            Historial
          </button>
          <button 
            :class="['nav-btn', { active: currentView === 'settings' }]" 
            @click="currentView = 'settings'"
          >
            <span class="icon">
              <img src="@/assets/hakken-logo-ajustes.png" alt="hakken-logo-ajustes" class="card-icon-header">
            </span>
            Ajustes
          </button>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="dashboard-main">
      <!-- Search Section -->
      <section v-if="currentView === 'search'" class="search-section">
        <h1 class="section-title">
          Panel <span class="highlight">OSINT</span>
        </h1>
        <p class="section-subtitle">Selecciona el tipo de búsqueda que deseas realizar</p>

        <!-- Search Cards Grid -->
        <div class="search-cards-grid">
          <!-- Username Card -->
          <div class="search-card" @click="selectSearchType('username')">
            <img src="@/assets/hakken-logo-usuario.png" alt="Username-logo" class="card-icon"/>
            <h3 class="card-title">Nombre de usuario</h3>
            <p class="card-description">Busca información por nombre de usuario en redes sociales</p>
            <div class="card-badge">Redes Sociales</div>
          </div>

          <!-- Email Card -->
          <div class="search-card" @click="selectSearchType('email')">
            <img src="@/assets/hakken-logo-email.png" alt="Username-logo" class="card-icon"/>
            <h3 class="card-title">Email</h3>
            <p class="card-description">Investiga cuentas asociadas a direcciones de correo</p>
            <div class="card-badge">Correo Electrónico</div>
          </div>

          <!-- Phone Card -->
          <div class="search-card" @click="selectSearchType('phone')">
            <img src="@/assets/hakken-logo-movil.png" alt="Username-logo" class="card-icon"/>
            <h3 class="card-title">Teléfono</h3>
            <p class="card-description">Busca información vinculada a números telefónicos</p>
            <div class="card-badge">Número de Teléfono</div>
          </div>

          <!-- IP Card -->
          <div class="search-card" @click="selectSearchType('ip')">
            <img src="@/assets/hakken-logo-ip.png" alt="Username-logo" class="card-icon"/>
            <h3 class="card-title">Dirección IP</h3>
            <p class="card-description">Obtén geolocalización y detalles de direcciones IP</p>
            <div class="card-badge">Dirección IP</div>
          </div>

          <!-- Domain Card -->
          <div class="search-card" @click="selectSearchType('domain')">
            <img src="@/assets/hakken-logo-dominio.png" alt="Username-logo" class="card-icon"/>
            <h3 class="card-title">Dominio</h3>
            <p class="card-description">Analiza información de dominios y DNS</p>
            <div class="card-badge">Dominio/DNS</div>
          </div>

          <!-- Google Dorks Card -->
          <div class="search-card special-card" @click="openGoogleDorks">
            <img src="@/assets/hakken-logo-dorks.png" alt="Dorks-logo" class="card-icon"/>
            <h3 class="card-title">Google Dorks</h3>
            <p class="card-description">Accede a consultas avanzadas de Google para OSINT</p>
            <div class="card-badge special">Búsquedas Avanzadas</div>
          </div>
        </div>
      </section>

      <!-- History Section -->
      <section v-else-if="currentView === 'history'" class="history-section">
        <h1 class="section-title">
          Historial de <span class="highlight">Búsquedas</span>
        </h1>
        <p class="section-subtitle">Revisa tus búsquedas anteriores</p>
        
        <div class="history-content">
          <!-- Filters -->
          <div class="history-filters">
            <select v-model="historyFilter" class="filter-select">
              <option value="all">Todas las búsquedas</option>
              <option value="username">Nombre de usuario</option>
              <option value="username">Email</option>
              <option value="username">Teléfono</option>
              <option value="ip">Dirección IP</option>
              <option value="domain">Dominio</option>
            </select>
            
            <button class="filter-btn" @click="clearHistory" :disabled="searchHistory.length === 0">
              <span class="icon">
                <img src="@/assets/hakken-logo-papelera.png" alt="hakken-logo-papelera" class="card-icon-history-section">
              </span>
              Limpiar Historial
            </button>
          </div>

          <!-- History List -->
          <div v-if="filteredHistory.length > 0" class="history-list">
            <div 
              v-for="item in filteredHistory" 
              :key="item.id" 
              class="history-item"
            >
              <div class="history-icon">
                <!-- icono -->
              </div>
              <div class="history-info" @click="viewHistoryItem(item)">
                <div class="history-query">{{ item.query }}</div>
                <div class="history-meta">
                  <span class="history-type">{{ getTypeLabel(item.type) }}</span>
                  <span class="history-date">{{ formatDate(item.timestamp) }}</span>
                </div>
              </div>
              <div class="history-actions">
                <button class="icon-btn" @click="repeatSearch(item)" title="Repetir búsqueda">
                  <img src="@/assets/hakken-logo-repeat.png" alt="hakken-logo-papelera" class="card-icon-history-section">
                </button>
                <button class="icon-btn delete-btn" @click="deleteHistoryItem(item.id)" title="Eliminar">
                  ✕
                </button>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="empty-history">
            <div class="empty-icon">
              <img src="@/assets/hakken-logo-clipboard.png" alt="hakken-logo-clipboard" class="card-icon-history-section-clipboard">
            </div>
            <p>No hay búsquedas en el historial</p>
            <small>Realiza una búsqueda para ver tu historial aquí</small>
          </div>
        </div>
      </section>

      <!-- Settings Section -->
      <section v-else-if="currentView === 'settings'" class="settings-section">
        <h1 class="section-title">
          <span class="highlight">Configuración</span>
        </h1>
        <p class="section-subtitle">Personaliza tu experiencia HAKKEN</p>
        
        <div class="settings-content">
          <!-- Apariencia -->
          <div class="settings-group">
            <h3 class="settings-group-title">
              <span class="icon">
                <img src="@/assets/hakken-logo-paleta.png" alt="hakken-logo-paleta" class="card-icon-paleta">
              </span>
              Apariencia
            </h3>
            
            <!-- Tema -->
            <div class="setting-item">
              <div class="setting-header">
                <label class="setting-label">Tema</label>
                <span class="setting-description">Cambia entre modo oscuro y claro</span>
              </div>
              <div class="theme-selector">
                <button 
                  :class="['theme-btn', { active: theme === 'dark' }]" 
                  @click="theme = 'dark'"
                >
                  <span class="theme-icon">
                    <img src="@/assets/hakken-logo-dark.png" alt="dark-theme-icon" class="card-icon">
                  </span>
                  <span class="theme-name">Oscuro</span>
                </button>
                <button 
                  :class="['theme-btn', { active: theme === 'light' }]" 
                  @click="theme = 'light'"
                >
                  <span class="theme-icon">
                    <img src="@/assets/hakken-logo-light.png" alt="light-theme-icon" class="card-icon">
                  </span>
                  <span class="theme-name">Claro</span>
                </button>
              </div>
            </div>

            <!-- Idioma -->
            <!--<div class="setting-item">
              <div class="setting-header">
                <label class="setting-label">Idioma</label>
                <span class="setting-description">Selecciona el idioma de la interfaz</span>
              </div>
              <select v-model="language" class="setting-select">
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>

            <div class="setting-item">
              <div class="setting-header">
                <label class="setting-label">Animaciones</label>
                <span class="setting-description">Activa o desactiva las animaciones visuales</span>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="animations" />
                <span class="toggle-slider"></span>
              </label>
            </div>-->
          </div>
        </div>
      </section>

      <!-- Google Dorks Section - NUEVA -->
      <section v-else="currentView === 'dorks'" class="dorks-section">
        <div v-if="!selectedDorkCategory" class="dorks-categories-view">
          <h1 class="section-title">
            <span class="highlight">Google Dorks</span> OSINT
          </h1>
          <p class="section-subtitle">Selecciona una categoría para ver las consultas avanzadas</p>

          <div class="dorks-categories-grid">
            <!-- Username Category -->
            <div class="dork-category-card" @click="selectDorkCategory('username')">
              <img src="@/assets/hakken-logo-usuario.png" alt="Username" class="category-icon-large"/>
              <h3 class="category-title">Username</h3>
              <p class="category-desc">Dorks para buscar usuarios en redes sociales y plataformas</p>
              <div class="category-count">5 dorks disponibles</div>
            </div>

            <!-- Email Category -->
            <div class="dork-category-card" @click="selectDorkCategory('email')">
              <img src="@/assets/hakken-logo-email.png" alt="Email" class="category-icon-large"/>
              <h3 class="category-title">Email</h3>
              <p class="category-desc">Encuentra emails en documentos, redes y bases de datos</p>
              <div class="category-count">10 dorks disponibles</div>
            </div>

            <!-- Phone Category -->
            <div class="dork-category-card" @click="selectDorkCategory('phone')">
              <img src="@/assets/hakken-logo-movil.png" alt="Phone" class="category-icon-large"/>
              <h3 class="category-title">Teléfono</h3>
              <p class="category-desc">Busca números telefónicos en directorios y anuncios</p>
              <div class="category-count">5 dorks disponibles</div>
            </div>

            <!-- IP Category -->
            <div class="dork-category-card" @click="selectDorkCategory('ip')">
              <img src="@/assets/hakken-logo-ip.png" alt="IP" class="category-icon-large"/>
              <h3 class="category-title">Dirección IP</h3>
              <p class="category-desc">Información sobre IPs, servicios y vulnerabilidades</p>
              <div class="category-count">5 dorks disponibles</div>
            </div>

            <!-- Domain Category -->
            <div class="dork-category-card" @click="selectDorkCategory('domain')">
              <img src="@/assets/hakken-logo-dominio.png" alt="Domain" class="category-icon-large"/>
              <h3 class="category-title">Dominio</h3>
              <p class="category-desc">Analiza subdominios, archivos y tecnologías</p>
              <div class="category-count">5 dorks disponibles</div>
            </div>

            <!-- Files Category -->
            <div class="dork-category-card" @click="selectDorkCategory('files')">
              <img src="@/assets/hakken-logo-clipboard.png" alt="Files" class="category-icon-large"/>
              <h3 class="category-title">Archivos</h3>
              <p class="category-desc">Encuentra documentos, configs y backups expuestos</p>
              <div class="category-count">5 dorks disponibles</div>
            </div>

            <!-- Social Category -->
            <div class="dork-category-card" @click="selectDorkCategory('social')">
              <img src="@/assets/hakken-logo-busqueda.png" alt="Social" class="category-icon-large"/>
              <h3 class="category-title">Redes Sociales</h3>
              <p class="category-desc">Busca perfiles y contenido en plataformas sociales</p>
              <div class="category-count">5 dorks disponibles</div>
            </div>

            <!-- Vulnerabilities Category -->
            <div class="dork-category-card" @click="selectDorkCategory('vulnerabilities')">
              <img src="@/assets/hakken-logo-advertencia.png" alt="Vulnerabilities" class="category-icon-large"/>
              <h3 class="category-title">Vulnerabilidades</h3>
              <p class="category-desc">Detecta paneles, bases de datos y credenciales</p>
              <div class="category-count">5 dorks disponibles</div>
            </div>
          </div>
        </div>

        <!-- Vista de dorks de la categoría seleccionada -->
        <div v-else class="dorks-list-view">
          <div class="dorks-header">
            <button class="back-btn-dorks" @click="selectedDorkCategory = null">
              <span class="icon">←</span>
              Volver a categorías
            </button>
            <h1 class="section-title">
              {{ getCategoryTitle(selectedDorkCategory) }}
            </h1>
            <p class="section-subtitle">{{ getCategoryDescription(selectedDorkCategory) }}</p>
          </div>

          <!-- Input para personalizar -->
          <div class="dorks-input-section">
            <input
              v-model="dorkSearchTerm"
              type="text"
              :placeholder="getCategoryPlaceholder(selectedDorkCategory)"
              class="dorks-input"
            />
            <small class="input-hint">
              <img src="@/assets/hakken-logo-bombilla.png" alt="hint" class="hint-icon"/>
              Introduce un término para personalizar los dorks (opcional)
            </small>
          </div>

          <!-- Lista de dorks -->
          <div class="dorks-list">
            <div 
              v-for="dork in getFilteredDorks(selectedDorkCategory)" 
              :key="dork.id"
              class="dork-item"
            >
              <div class="dork-content">
                <h4 class="dork-title">{{ dork.title }}</h4>
                <div class="dork-query">
                  <code>{{ getDorkWithTerm(dork.query) }}</code>
                </div>
                <p class="dork-description">{{ dork.description }}</p>
              </div>
              <div class="dork-actions">
                <button class="dork-btn copy-btn" @click="copyDork(dork.query)">
                  <img src="@/assets/hakken-logo-papelera.png" alt="copy" class="btn-icon"/>
                  Copiar
                </button>
                <button class="dork-btn search-btn-dork" @click="searchWithDork(dork.query)">
                  <img src="@/assets/hakken-logo-busqueda.png" alt="search" class="btn-icon"/>
                  Buscar
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Notificación Toast -->
      <div v-if="notification.show" class="notification-toast" :class="{ 'error': !notification.isSuccess }">
        <span class="notification-icon">{{ notification.isSuccess ? '✓' : '✕' }}</span>
        {{ notification.message }}
      </div>

      <!-- Search Modal/Panel -->
      <div v-if="selectedType" class="search-modal" @click.self="closeModal">
        <div class="modal-content">
          <button class="close-btn" @click="closeModal">✕</button>
          
          <div class="modal-header">
            <h2 class="modal-title">
              Buscar por <span class="highlight">{{ getTypeLabel(selectedType) }}</span>
            </h2>
          </div>

          <div class="modal-body">
            <div class="search-input-wrapper">
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="getPlaceholder(selectedType)"
                class="search-input"
                @keyup.enter="performSearch"
              />
              <button class="search-btn" @click="performSearch">
                <span v-if="!isSearching">Buscar</span>
                <span v-else class="loading-spinner">
                  <img src="@/assets/hakken-logo-ajustes.png" alt="hakken-logo-ajustes" class="card-icon-loading">
                </span>
              </button>
            </div>

            <!-- Mensaje de error -->
            <div v-if="searchError" class="error-message">
              <span class="error-icon">
                <img src="@/assets/hakken-logo-advertencia.png" alt="haken-logo-error" class="card-icon-warning">
              </span>
              <span class="error-text">{{ searchError }}</span>
              <button class="error-close" @click="searchError = null">✕</button>
            </div>

            <!-- Results Area -->
            <div v-if="searchResults" class="results-area">
              <h3 class="results-title">Resultados de búsqueda</h3>
              <div class="results-content">
                <pre>{{ searchResults }}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Background Effects -->
    <div class="grid-overlay"></div>
    <div class="ambient-glow glow-1"></div>
    <div class="ambient-glow glow-2"></div>
  </div>
</template>

<script setup>
/*
**************************************************************************
****************************** GLOBAL IMPORTS ****************************
**************************************************************************
*/
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

/*
**************************************************************************
****************************** GLOBAL VARIABLES ****************************
**************************************************************************
*/

const selectedType = ref(null)
const searchQuery = ref('')
const searchResults = ref(null)
const isSearching = ref(false)
const searchError = ref(null)

const router = useRouter()

/*
**************************************************************************
****************************** CUSTOM UX *********************************
**************************************************************************
*/

import { onMounted } from 'vue'
import { computed } from "vue";
import { watch } from 'vue'

const currentView = ref('search')
const theme = ref('dark')
//const language = ref('es')
//const animations = ref(true)

const applyTheme = (selectedTheme) => {
  const root = document.documentElement
  
  if (selectedTheme === 'light') {
    root.style.setProperty('--bg-primary', '#ffffff')
    root.style.setProperty('--bg-secondary', '#f8f9fa')
    root.style.setProperty('--bg-card', '#ffffff')
    root.style.setProperty('--text-primary', '#1a1a1a')
    root.style.setProperty('--text-secondary', '#495057')
    root.style.setProperty('--border-color', 'rgba(0, 255, 153, 0.3)')
    
    // Aplicar clase al body
    document.body.classList.remove('dark-theme')
    document.body.classList.add('light-theme')
    
    // Cambiar logo
    changeLogo('light')
  } else {
    root.style.setProperty('--bg-primary', '#0d0d0d')
    root.style.setProperty('--bg-secondary', '#1a1a1a')
    root.style.setProperty('--bg-card', '#151515')
    root.style.setProperty('--text-primary', '#ffffff')
    root.style.setProperty('--text-secondary', '#999999')
    root.style.setProperty('--border-color', 'rgba(0, 255, 153, 0.2)')
    
    // Aplicar clase al body
    document.body.classList.remove('light-theme')
    document.body.classList.add('dark-theme')
    
    // Cambiar logo
    changeLogo('dark')
  }
}

// Nueva función para cambiar el logo
const changeLogo = (theme) => {
  const logoElement = document.querySelector('.header-logo')
  if (logoElement) {
    if (theme === 'light') {
      logoElement.src = new URL('@/assets/hakken-logo-no-bg-negro.png', import.meta.url).href
    } else {
      logoElement.src = new URL('@/assets/hakken-logo-no-bg-blanco.png', import.meta.url).href
    }
  }
}

onMounted(() => {
  // Cargar configuración guardada
  const savedTheme = localStorage.getItem('hakken_theme')
  //const savedLanguage = localStorage.getItem('hakken_language')
  //const savedAnimations = localStorage.getItem('hakken_animations')
  
  if (savedTheme) theme.value = savedTheme
  //if (savedLanguage) language.value = savedLanguage
  //if (savedAnimations) animations.value = savedAnimations === 'true'
  
  applyTheme(theme.value)

  const savedHistory = localStorage.getItem('hakken_history')
  if (savedHistory) {
    searchHistory.value = JSON.parse(savedHistory)
  }
})

// Watch para cambiar tema en tiempo real
watch(theme, (newTheme) => {
  applyTheme(newTheme)
  localStorage.setItem('hakken_theme', newTheme)
})

/*watch(language, (newLang) => {
  localStorage.setItem('hakken_language', newLang)
  // Aquí aplicarías el cambio de idioma cuando lo implementes
})

watch(animations, (newValue) => {
  localStorage.setItem('hakken_animations', newValue)
  // Aplicar o desactivar animaciones
  if (newValue) {
    document.body.classList.add('animations-enabled')
  } else {
    document.body.classList.remove('animations-enabled')
  }
})*/

/*
**************************************************************************
****************************** CUSTOM UX *********************************
**************************************************************************
*/

/*
**************************************************************************
****************************** HISTORY ***********************************
**************************************************************************
*/

const historyFilter = ref('all')
const searchHistory = ref([])

// Computed para filtrar historial
const filteredHistory = computed(() => {
  if (historyFilter.value === 'all') {
    return searchHistory.value
  }
  return searchHistory.value.filter(item => item.type === historyFilter.value)
})

// Funciones del historial
const addToHistory = (query, type, results) => {
  const historyItem = {
    id: Date.now(),
    query: query,
    type: type,
    timestamp: new Date().toISOString(),
    results: results
  }
  
  // Añadir al inicio del array
  searchHistory.value.unshift(historyItem)
  
  // Limitar a 50 búsquedas máximo
  if (searchHistory.value.length > 50) {
    searchHistory.value = searchHistory.value.slice(0, 50)
  }
  
  // Guardar en localStorage
  localStorage.setItem('hakken_history', JSON.stringify(searchHistory.value))
}

const viewHistoryItem = (item) => {
  selectedType.value = item.type
  searchQuery.value = item.query
  searchResults.value = item.results
}

const repeatSearch = async (item) => {
  selectedType.value = item.type
  searchQuery.value = item.query
  searchResults.value = null
  await performSearch()
}

const deleteHistoryItem = (id) => {
  searchHistory.value = searchHistory.value.filter(item => item.id !== id)
  localStorage.setItem('hakken_history', JSON.stringify(searchHistory.value))
}

const clearHistory = () => {
  if (confirm('¿Estás seguro de que quieres eliminar todo el historial?')) {
    searchHistory.value = []
    localStorage.removeItem('hakken_history')
  }
}

/*
**************************************************************************
****************************** HISTORY ***********************************
**************************************************************************
*/


/*
**************************************************************************
*************************** FRONTED LOGIC ********************************
**************************************************************************
*/

const goBack = () => {
  router.push('/')
}

const selectSearchType = (type) => {
  selectedType.value = type
  searchQuery.value = ''
  searchResults.value = null
  searchError.value = null
  isSearching.value = false
}

const closeModal = () => {
  selectedType.value = null
  searchQuery.value = ''
  searchResults.value = null
}

const getTypeLabel = (type) => {
  const labels = {
    username: 'Nombre de usuario',
    email: 'Email',
    phone: 'Teléfono',
    ip: 'Dirección IP',
    domain: 'Dominio'
  }
  return labels[type] || type
}

const getPlaceholder = (type) => {
  const placeholders = {
    username: 'Ej: john_doe, @usuario',
    email: 'Ej: usuario@ejemplo.com',
    phone: 'Ej: +34 600 000 000',
    ip: 'Ej: 192.168.1.1',
    domain: 'Ej: ejemplo.com'
  }
  return placeholders[type] || 'Introduce tu búsqueda...'
}

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const performSearch = async () => {
  if (!searchQuery.value.trim()) return
  
  isSearching.value = true
  searchError.value = null
  
  try {
    let results = null
    
    switch(selectedType.value) {
      case 'username':
        const [githubData, sherlockData] = await Promise.all([
          api.searchGitHubUser(searchQuery.value),
          api.searchSherlockUsername(searchQuery.value)
        ])
        searchResults.value = formatUsernameResults(githubData, sherlockData)
        break
        
      case 'ip':
        results = await api.searchIP(searchQuery.value)
        searchResults.value = formatIPResults(results)
        break
        
      case 'domain':
        results = await api.searchDomain(searchQuery.value)
        searchResults.value = formatDomainResults(results)
        break
        
      case 'email':
      case 'phone':
        // Por implementar
        searchResults.value = generateMockResults(selectedType.value, searchQuery.value)
        break
        
      default:
        searchResults.value = generateMockResults(selectedType.value, searchQuery.value)
    }

    if (searchResults.value) {
      addToHistory(searchQuery.value, selectedType.value, searchResults.value)
    }
    
  } catch (error) {
    console.error('Error en la búsqueda:', error)
    searchError.value = error.response?.data?.detail || 'Error al realizar la búsqueda'
    searchResults.value = null
  } finally {
    isSearching.value = false
  }
}

// Función para formatear resultados de GitHub
const formatGitHubResults = (githubData) => {
  if (!githubData.exists) {
    return {
      query: searchQuery.value,
      type: 'username',
      timestamp: new Date().toISOString(),
      socialMedia: [
        { 
          platform: 'GitHub', 
          icon: '💻', 
          url: `https://github.com/${searchQuery.value}`, 
          found: false 
        }
      ]
    }
  }
  
  return {
    query: searchQuery.value,
    type: 'username',
    timestamp: new Date().toISOString(),
    socialMedia: [
      { 
        platform: 'GitHub', 
        icon: '💻', 
        url: githubData.profile_url, 
        found: true,
        details: {
          nombre: githubData.name || 'N/A',
          bio: githubData.bio || 'Sin biografía',
          repositorios: githubData.public_repos,
          seguidores: githubData.followers,
          siguiendo: githubData.following,
          empresa: githubData.company || 'N/A',
          ubicacion: githubData.location || 'N/A',
          blog: githubData.blog || 'N/A',
          twitter: githubData.twitter_username || 'N/A',
          creado: githubData.created_at ? new Date(githubData.created_at).toLocaleDateString('es-ES') : 'N/A'
        }
      }
    ]
  }
}

// Función para combinar GitHub + Sherlock en una sola respuesta de "username"
const formatUsernameResults = (githubData, sherlockData) => {
  // Partimos del formato actual de GitHub
  const base = formatGitHubResults(githubData)

  const socialMedia = base.socialMedia ? [...base.socialMedia] : []

  // Sherlock: asumimos respuesta { username, found: [{ site, url }], ... }
  const sherlockSites = Array.isArray(sherlockData?.found) ? sherlockData.found : []

  if (sherlockSites.length === 0) {
    // No se encontró nada con Sherlock
    socialMedia.push({
      platform: 'Sherlock',
      icon: '🕵️',
      url: null,
      found: false
    })
  } else {
    sherlockSites.forEach(site => {
      socialMedia.push({
        platform: site.site || 'Cuenta encontrada',
        icon: '🕵️',
        url: site.url,
        found: true
      })
    })
  }

  return {
    ...base,
    socialMedia,
    sherlock: {
      username: sherlockData?.username || searchQuery.value,
      total_sites: sherlockSites.length,
      sites: sherlockSites
    }
  }
}

// Función para formatear resultados de IP
const formatIPResults = (ipData) => {
  return {
    query: searchQuery.value,
    type: 'ip',
    timestamp: new Date().toISOString(),
    ipInfo: {
      country: ipData.country || 'N/A',
      city: ipData.city || 'N/A',
      region: ipData.region || 'N/A',
      isp: ipData.isp || 'N/A',
      org: ipData.organization || 'N/A',
      timezone: ipData.timezone || 'N/A',
      lat: ipData.latitude,
      lon: ipData.longitude,
      zip: ipData.zip_code || 'N/A',
      as: ipData.as_info || 'N/A'
    }
  }
}

// Función para formatear resultados de Dominio
const formatDomainResults = (domainData) => {
  return {
    query: searchQuery.value,
    type: 'domain',
    timestamp: new Date().toISOString(),
    domainInfo: {
      registered: domainData.exists,
      created: 'N/A',
      expires: 'N/A',
      registrar: 'N/A',
      dns: domainData.dns_records.map(record => ({
        type: record.type_name,
        value: record.value
      }))
    }
  }
}

/*
**************************************************************************
*************************** FRONTED LOGIC ********************************
**************************************************************************
*/

/*
**************************************************************************
*************************** GOOGLE DORKS *********************************
**************************************************************************
*/

// Google Dorks
const selectedDorkCategory = ref(null)
const dorkSearchTerm = ref('')
const notification = ref({ show: false, message: '' })

// Base de datos de Google Dorks (ACTUALIZADA con tus ejemplos de Email)
const googleDorks = ref([
  // EMAIL DORKS (Actualizados según tu imagen)
  {
    id: 1,
    category: 'email',
    title: 'Búsqueda general de email',
    query: '"[TERM]" AND intext:"[TERM]" -site:gmail.com',
    description: 'Busca el email en toda la web excluyendo Gmail'
  },
  {
    id: 2,
    category: 'email',
    title: 'Email en LinkedIn',
    query: 'site:linkedin.com "[TERM]"',
    description: 'Busca perfiles de LinkedIn asociados al email'
  },
  {
    id: 3,
    category: 'email',
    title: 'Email en Twitter/X',
    query: 'site:x.com "[TERM]"',
    description: 'Busca el email en la red social X (antes Twitter)'
  },
  {
    id: 4,
    category: 'email',
    title: 'Email en Reddit',
    query: 'site:reddit.com "[TERM]" ...',
    description: 'Encuentra menciones del email en Reddit'
  },
  {
    id: 5,
    category: 'email',
    title: 'Email en GitHub',
    query: 'site:github.com "[TERM]"',
    description: 'Busca el email en repositorios y perfiles de GitHub'
  },
  {
    id: 6,
    category: 'email',
    title: 'Email en Pastebin',
    query: 'site:pastebin.com "[TERM]"',
    description: 'Busca si el email aparece en pastes (posibles brechas)'
  },
  {
    id: 7,
    category: 'email',
    title: 'Documentos PDF con email',
    query: 'filetype:pdf "[TERM]"',
    description: 'Encuentra documentos PDF que contengan el email'
  },
  {
    id: 8,
    category: 'email',
    title: 'Hojas de cálculo con email',
    query: 'filetype:xls OR filetype:xlsx "[TERM]"',
    description: 'Busca hojas de cálculo con el email expuesto'
  },
  {
    id: 9,
    category: 'email',
    title: 'Username reutilizado',
    query: '"[TERM]" site:github.com',
    description: 'Busca si el username del email se usa en GitHub'
  },
  {
    id: 10,
    category: 'email',
    title: 'Username en Twitter',
    query: '"[TERM]" site:twitter.com',
    description: 'Busca si el username del email está en Twitter'
  },

  // USERNAME DORKS
  {
    id: 11,
    category: 'username',
    title: 'Buscar usuario en redes sociales',
    query: 'site:twitter.com OR site:facebook.com OR site:instagram.com OR site:linkedin.com "[TERM]"',
    description: 'Busca perfiles de usuario en las principales redes sociales'
  },
  {
    id: 12,
    category: 'username',
    title: 'Buscar usuario en foros',
    query: 'inurl:profile "[TERM]" OR inurl:user "[TERM]"',
    description: 'Encuentra perfiles en foros y comunidades online'
  },
  {
    id: 13,
    category: 'username',
    title: 'Buscar menciones del usuario',
    query: '"[TERM]" -site:facebook.com -site:twitter.com',
    description: 'Busca menciones del usuario excluyendo redes sociales principales'
  },
  {
    id: 14,
    category: 'username',
    title: 'Buscar usuario en GitHub',
    query: 'site:github.com "[TERM]"',
    description: 'Encuentra repositorios y actividad en GitHub'
  },
  {
    id: 15,
    category: 'username',
    title: 'Buscar usuario en Reddit',
    query: 'site:reddit.com/user "[TERM]"',
    description: 'Busca perfiles y posts en Reddit'
  },

  // PHONE DORKS
  {
    id: 16,
    category: 'phone',
    title: 'Buscar número de teléfono',
    query: '"[TERM]" OR "+[TERM]"',
    description: 'Busca apariciones del número en diferentes formatos'
  },
  {
    id: 17,
    category: 'phone',
    title: 'Buscar teléfono en directorios',
    query: 'inurl:phonebook "[TERM]" OR inurl:directory "[TERM]"',
    description: 'Busca el número en directorios telefónicos online'
  },
  {
    id: 18,
    category: 'phone',
    title: 'Buscar teléfono en anuncios',
    query: 'site:craigslist.org OR site:olx.com "[TERM]"',
    description: 'Encuentra el teléfono en sitios de anuncios clasificados'
  },
  {
    id: 19,
    category: 'phone',
    title: 'Buscar teléfono en documentos',
    query: '"[TERM]" filetype:pdf OR filetype:doc OR filetype:xls',
    description: 'Busca el número en documentos públicos'
  },
  {
    id: 20,
    category: 'phone',
    title: 'Buscar teléfono en redes sociales',
    query: 'site:facebook.com OR site:twitter.com "[TERM]"',
    description: 'Busca el número en perfiles de redes sociales'
  },

  // IP DORKS
  {
    id: 21,
    category: 'ip',
    title: 'Buscar información de IP',
    query: '"[TERM]" inurl:ip OR inurl:ipaddress',
    description: 'Busca información pública sobre la dirección IP'
  },
  {
    id: 22,
    category: 'ip',
    title: 'Buscar IP en logs públicos',
    query: 'site:pastebin.com "[TERM]"',
    description: 'Busca la IP en logs o pastes públicos'
  },
  {
    id: 23,
    category: 'ip',
    title: 'Buscar servicios en IP',
    query: '"[TERM]" intitle:"index of" OR intitle:"welcome to"',
    description: 'Busca servicios web expuestos en la IP'
  },
  {
    id: 24,
    category: 'ip',
    title: 'Buscar cámaras IP',
    query: 'inurl:view/view.shtml "[TERM]"',
    description: 'Busca cámaras de seguridad asociadas a la IP'
  },
  {
    id: 25,
    category: 'ip',
    title: 'Buscar servidores vulnerables',
    query: '"[TERM]" intitle:"Apache" OR intitle:"IIS" OR intitle:"nginx"',
    description: 'Busca información de servidores web en la IP'
  },

  // DOMAIN DORKS
  {
    id: 26,
    category: 'domain',
    title: 'Buscar subdominios',
    query: 'site:*.[TERM]',
    description: 'Encuentra todos los subdominios indexados del dominio'
  },
  {
    id: 27,
    category: 'domain',
    title: 'Buscar información WHOIS',
    query: '"[TERM]" inurl:whois',
    description: 'Busca registros WHOIS del dominio'
  },
  {
    id: 28,
    category: 'domain',
    title: 'Buscar páginas de login',
    query: 'site:[TERM] inurl:login OR inurl:admin OR inurl:administrator',
    description: 'Encuentra páginas de inicio de sesión en el dominio'
  },
  {
    id: 29,
    category: 'domain',
    title: 'Buscar archivos expuestos',
    query: 'site:[TERM] intitle:"index of"',
    description: 'Busca directorios abiertos con listado de archivos'
  },
  {
    id: 30,
    category: 'domain',
    title: 'Buscar tecnologías usadas',
    query: 'site:[TERM] "powered by" OR "built with"',
    description: 'Identifica las tecnologías utilizadas en el sitio'
  },

  // FILES DORKS
  {
    id: 31,
    category: 'files',
    title: 'Buscar PDFs sensibles',
    query: 'site:[TERM] filetype:pdf confidential OR private OR secret',
    description: 'Busca documentos PDF con información sensible'
  },
  {
    id: 32,
    category: 'files',
    title: 'Buscar documentos Word',
    query: 'filetype:doc OR filetype:docx "[TERM]"',
    description: 'Encuentra documentos de Word relacionados'
  },
  {
    id: 33,
    category: 'files',
    title: 'Buscar hojas de cálculo',
    query: 'filetype:xls OR filetype:xlsx "[TERM]"',
    description: 'Busca hojas de cálculo expuestas'
  },
  {
    id: 34,
    category: 'files',
    title: 'Buscar presentaciones',
    query: 'filetype:ppt OR filetype:pptx "[TERM]"',
    description: 'Encuentra presentaciones públicas'
  },
  {
    id: 35,
    category: 'files',
    title: 'Buscar archivos de configuración',
    query: 'filetype:conf OR filetype:config OR filetype:ini "[TERM]"',
    description: 'Busca archivos de configuración expuestos'
  },

  // SOCIAL DORKS
  {
    id: 36,
    category: 'social',
    title: 'Buscar en Twitter',
    query: 'site:twitter.com "[TERM]"',
    description: 'Busca tweets y perfiles en Twitter'
  },
  {
    id: 37,
    category: 'social',
    title: 'Buscar en Facebook',
    query: 'site:facebook.com "[TERM]"',
    description: 'Encuentra publicaciones y perfiles en Facebook'
  },
  {
    id: 38,
    category: 'social',
    title: 'Buscar en Instagram',
    query: 'site:instagram.com "[TERM]"',
    description: 'Busca perfiles y hashtags en Instagram'
  },
  {
    id: 39,
    category: 'social',
    title: 'Buscar en TikTok',
    query: 'site:tiktok.com "[TERM]"',
    description: 'Encuentra videos y usuarios en TikTok'
  },
  {
    id: 40,
    category: 'social',
    title: 'Buscar en YouTube',
    query: 'site:youtube.com "[TERM]"',
    description: 'Busca videos y canales en YouTube'
  },

  // VULNERABILITIES DORKS
  {
    id: 41,
    category: 'vulnerabilities',
    title: 'Buscar paneles de administración',
    query: 'intitle:"admin panel" OR intitle:"control panel"',
    description: 'Encuentra paneles de administración expuestos'
  },
  {
    id: 42,
    category: 'vulnerabilities',
    title: 'Buscar bases de datos expuestas',
    query: 'intitle:"phpMyAdmin" OR intitle:"MySQL"',
    description: 'Busca interfaces de bases de datos accesibles'
  },
  {
    id: 43,
    category: 'vulnerabilities',
    title: 'Buscar cámaras sin contraseña',
    query: 'inurl:"view/view.shtml" OR inurl:"ViewerFrame?Mode="',
    description: 'Encuentra cámaras de seguridad vulnerables'
  },
  {
    id: 44,
    category: 'vulnerabilities',
    title: 'Buscar archivos de backup',
    query: 'filetype:bak OR filetype:old OR filetype:backup',
    description: 'Busca archivos de respaldo expuestos'
  },
  {
    id: 45,
    category: 'vulnerabilities',
    title: 'Buscar credenciales expuestas',
    query: 'filetype:env "DB_PASSWORD" OR filetype:config "password"',
    description: 'Busca archivos con posibles credenciales'
  }
])

// Funciones para Google Dorks
const openGoogleDorks = () => {
  currentView.value = 'dorks'
  selectedDorkCategory.value = null
  dorkSearchTerm.value = ''
}

const selectDorkCategory = (category) => {
  selectedDorkCategory.value = category
  dorkSearchTerm.value = ''
}

const getFilteredDorks = (category) => {
  return googleDorks.value.filter(dork => dork.category === category)
}

const getDorkWithTerm = (query) => {
  if (dorkSearchTerm.value.trim()) {
    // Extraer solo el username si es email (parte antes del @)
    let term = dorkSearchTerm.value.trim()
    if (term.includes('@') && selectedDorkCategory.value === 'email') {
      const username = term.split('@')[0]
      // Reemplazar [TERM] con el username cuando el dork lo requiera
      if (query.includes('Username reutilizado') || query.includes('Username en Twitter')) {
        return query.replace(/\[TERM\]/g, username)
      }
    }
    return query.replace(/\[TERM\]/g, term)
  }
  return query
}

const copyDork = async (dorkQuery) => {
  const finalQuery = getDorkWithTerm(dorkQuery)
  try {
    await navigator.clipboard.writeText(finalQuery)
    showNotification('Dork copiado al portapapeles', true)
  } catch (err) {
    console.error('Error al copiar:', err)
    showNotification('Error al copiar el dork', false)
  }
}

const searchWithDork = (dorkQuery) => {
  const finalQuery = getDorkWithTerm(dorkQuery)
  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(finalQuery)}`
  window.open(googleSearchUrl, '_blank')
}

const showNotification = (message, isSuccess = true) => {
  notification.value = { 
    show: true, 
    message: message,
    isSuccess: isSuccess
  }
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

const getCategoryTitle = (category) => {
  const titles = {
    username: 'Google Dorks para Username',
    email: 'Google Dorks para Email',
    phone: 'Google Dorks para Teléfono',
    ip: 'Google Dorks para Dirección IP',
    domain: 'Google Dorks para Dominio',
    files: 'Google Dorks para Archivos',
    social: 'Google Dorks para Redes Sociales',
    vulnerabilities: 'Google Dorks para Vulnerabilidades'
  }
  return titles[category] || category
}

const getCategoryDescription = (category) => {
  const descriptions = {
    username: 'Consultas avanzadas para encontrar usuarios en múltiples plataformas',
    email: 'Busca emails en redes sociales, documentos y bases de datos públicas',
    phone: 'Encuentra números telefónicos en directorios, anuncios y documentos',
    ip: 'Obtén información detallada sobre direcciones IP y servicios',
    domain: 'Analiza dominios, subdominios y tecnologías web',
    files: 'Descubre documentos y archivos sensibles expuestos',
    social: 'Busca perfiles y contenido en redes sociales',
    vulnerabilities: 'Identifica posibles vulnerabilidades y exposiciones'
  }
  return descriptions[category] || ''
}

const getCategoryPlaceholder = (category) => {
  const placeholders = {
    username: 'Ej: john_doe, usuario123',
    email: 'Ej: ejemplo@gmail.com',
    phone: 'Ej: +34600000000, 600000000',
    ip: 'Ej: 8.8.8.8, 192.168.1.1',
    domain: 'Ej: example.com',
    files: 'Ej: confidential, password',
    social: 'Ej: @usuario, #hashtag',
    vulnerabilities: 'Ej: admin, login'
  }
  return placeholders[category] || 'Introduce un término...'
}

/*
**************************************************************************
*************************** GOOGLE DORKS *********************************
**************************************************************************
*/
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap');

.dashboard-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: var(--bg-primary);
  overflow-y: auto;
  font-family: 'Rajdhani', sans-serif;
  color: var(--text-primary);
  transition: all 0.3s ease;
}

/* Header */
.dashboard-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--bg-secondary);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 4px 20px rgba(0, 255, 153, 0.1);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.back-button-wrapper {
  display: flex;
  align-items: center;
}

.back-btn {
  padding: 0.7rem 1.2rem;
  background: transparent;
  color: #00ff99;
  border: 1px solid rgba(0, 255, 153, 0.3);
  border-radius: 6px;
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.back-btn:hover {
  background: rgba(0, 255, 153, 0.1);
  border-color: #00ff99;
  box-shadow: 0 0 15px rgba(0, 255, 153, 0.2);
}

.back-btn .icon {
  font-size: 1.4rem;
}

.header-logo {
  height: 40px;
  filter: drop-shadow(0 0 10px rgba(0, 255, 153, 0.6));
}

.nav-section {
  display: flex;
  gap: 1rem;
}

.nav-btn {
  padding: 0.7rem 1.5rem;
  background: transparent;
  color: #b0b0b0;
  border: 1px solid rgba(0, 255, 153, 0.3);
  border-radius: 6px;
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-btn:hover {
  background: rgba(0, 255, 153, 0.1);
  color: #00ff99;
  border-color: #00ff99;
}

.nav-btn.active {
  background: rgba(0, 255, 153, 0.2);
  color: #00ff99;
  border-color: #00ff99;
  box-shadow: 0 0 15px rgba(0, 255, 153, 0.3);
}

.icon {
  font-size: 1.2rem;
}

/* Main Content */
.dashboard-main {
  position: relative;
  z-index: 2;
  max-width: 1400px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.search-section {
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.section-title {
  font-size: 3rem;
  font-weight: 300;
  color: white;
  margin-bottom: 0.5rem;
  letter-spacing: 1px;
}

.highlight {
  color: #00ff99;
  font-weight: 700;
  font-family: 'Orbitron', sans-serif;
  text-shadow: 
    0 0 15px rgba(0, 255, 153, 0.9),
    0 0 30px rgba(0, 255, 153, 0.5);
}

.section-subtitle {
  font-size: 1.2rem;
  color: #888;
  margin-bottom: 3rem;
}

/* Search Cards Grid */
.search-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

/*.search-card {
  background: rgba(15, 15, 15, 0.8);
  border: 1px solid rgba(0, 255, 153, 0.3);
  border-radius: 12px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}*/

.search-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.search-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 153, 0.1), transparent);
  transition: left 0.5s ease;
}

.search-card:hover::before {
  left: 100%;
}

.search-card:hover {
  border-color: #00ff99;
  background: rgba(20, 20, 20, 0.9);
  box-shadow: 
    0 0 25px rgba(0, 255, 153, 0.3),
    inset 0 0 30px rgba(0, 255, 153, 0.05);
  transform: translateY(-5px);
}

/*.card-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  filter: drop-shadow(0 0 10px rgba(0, 255, 153, 0.5));
}*/

.card-icon{
  height: 5rem;
  width: 5rem;
  margin-bottom: 1rem;
  filter: drop-shadow(0 0 20px rgba(0, 255, 153, 0.5));
}

.card-icon-paleta{
  height: 2rem;
  width: 2rem;
  margin-top: 0.5rem;
  filter: drop-shadow(0 0 20px rgba(0, 255, 153, 0.5));
}

.card-icon-header{
  height: 1.5rem;
  width: 1.5rem;
  margin-top: 0.5rem;
  filter: drop-shadow(0 0 20px rgba(0, 255, 153, 0.5));
}

.card-icon-warning{
  height: 3rem;
  width: 3rem;
  margin-top: 0.5rem;
  filter: drop-shadow(0 0 20px rgba(0, 255, 153, 0.5));
}

.card-icon-history-section{
  height: 2rem;
  width: 2rem;
  filter: drop-shadow(0 0 20px rgba(0, 255, 153, 0.5));
}

.card-icon-history-section-clipboard{
  height: 7rem;
  width: 7rem;
  filter: drop-shadow(0 0 20px rgba(0, 255, 153, 0.5));
}

.card-title {
  font-size: 1.5rem;
  color: white;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.card-description {
  color: #999;
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.card-badge {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  background: rgba(0, 255, 153, 0.1);
  color: #00ff99;
  border: 1px solid rgba(0, 255, 153, 0.3);
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.card-badge.special {
  background: rgba(255, 153, 0, 0.1);
  color: #ff9900;
  border-color: rgba(255, 153, 0, 0.3);
}

.advanced-card {
  border-color: rgba(255, 153, 0, 0.3);
}

.advanced-card:hover {
  border-color: #ff9900;
  box-shadow: 
    0 0 25px rgba(255, 153, 0, 0.3),
    inset 0 0 30px rgba(255, 153, 0, 0.05);
}

/* Search Modal */
.search-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem 2rem 2rem;
  animation: fadeIn 0.3s ease-out;
  overflow-y: auto;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/*.modal-content {
  background: rgba(15, 15, 15, 0.95);
  border: 2px solid #00ff99;
  border-radius: 12px;
  padding: 2.5rem;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 
    0 0 40px rgba(0, 255, 153, 0.4),
    inset 0 0 30px rgba(0, 255, 153, 0.05);
  animation: slideUp 0.3s ease-out;
}*/

.modal-content {
  background: var(--bg-secondary);
  border: 2px solid #00ff99;
  border-radius: 12px;
  padding: 2.5rem;
  max-width: 1000px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 
    0 0 40px rgba(0, 255, 153, 0.4),
    inset 0 0 30px rgba(0, 255, 153, 0.05);
  animation: slideUp 0.3s ease-out;
  margin-top: 2rem;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  color: #00ff99;
  font-size: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  line-height: 1;
  padding: 0;
}

.close-btn:hover {
  background: rgba(0, 255, 153, 0.1);
  transform: rotate(90deg);
}

.modal-header {
  margin-bottom: 2rem;
}

.modal-title {
  font-size: 2rem;
  color: white;
  font-weight: 300;
}

.search-input-wrapper {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-input {
  flex: 1;
  padding: 1rem 1.5rem;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(0, 255, 153, 0.3);
  border-radius: 8px;
  color: white;
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #00ff99;
  box-shadow: 0 0 20px rgba(0, 255, 153, 0.3);
}

.search-input::placeholder {
  color: #666;
}

/* Error Message */
.error-message {
  background: rgba(255, 68, 68, 0.1);
  border: 1px solid rgba(255, 68, 68, 0.3);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  animation: fadeIn 0.3s ease-out;
}

.error-icon {
  font-size: 1.5rem;
}

.error-text {
  flex: 1;
  color: #ff6b6b;
  font-size: 0.95rem;
}

.error-close {
  background: transparent;
  border: none;
  color: #ff6b6b;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.2rem 0.5rem;
  transition: all 0.3s ease;
}

.error-close:hover {
  background: rgba(255, 68, 68, 0.2);
  border-radius: 4px;
}

.search-btn {
  padding: 1rem 2.5rem;
  background: rgba(0, 255, 153, 0.2);
  border: 2px solid #00ff99;
  border-radius: 8px;
  color: #00ff99;
  font-family: 'Orbitron', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.search-btn:hover {
  background: #00ff99;
  color: #000;
  box-shadow: 0 0 25px rgba(0, 255, 153, 0.5);
}

.loading-spinner {
  display: inline-block;
  animation: spin 1s linear infinite;
}

.card-icon-loading{
  height: 2rem;
  width: 2rem;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.results-area {
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 255, 153, 0.2);
  border-radius: 8px;
}

.results-title {
  color: #00ff99;
  font-size: 1.3rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.results-content {
  color: #b0b0b0;
  font-family: 'Courier New', monospace;
  font-size: 0.95rem;
}

.results-content pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* Background Effects */
.grid-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(0, 255, 153, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 153, 0.02) 1px, transparent 1px);
  background-size: 60px 60px;
  z-index: 0;
  pointer-events: none;
  opacity: 0.5;
}

.ambient-glow {
  position: fixed;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.1;
  pointer-events: none;
  z-index: 0;
}

.glow-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(0, 255, 153, 0.3) 0%, transparent 70%);
  top: -200px;
  right: -200px;
  animation: floatGlow1 20s ease-in-out infinite;
}

.glow-2 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(0, 204, 122, 0.25) 0%, transparent 70%);
  bottom: -150px;
  left: -150px;
  animation: floatGlow2 25s ease-in-out infinite;
}

@keyframes floatGlow1 {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-100px, 100px);
  }
}

@keyframes floatGlow2 {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(100px, -80px);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .nav-section {
    width: 100%;
    justify-content: center;
  }

  .nav-btn {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .search-cards-grid {
    grid-template-columns: 1fr;
  }

  .search-input-wrapper {
    flex-direction: column;
  }

  .modal-content {
    padding: 1.5rem;
  }
}

/*
**************************************************************************
****************************** CUSTOM UX *********************************
**************************************************************************
*/

.settings-section {
  animation: fadeInUp 0.8s ease-out;
}

.settings-content {
  margin-top: 2rem;
}

/*.settings-group {
  background: rgba(15, 15, 15, 0.8);
  border: 1px solid rgba(0, 255, 153, 0.2);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
}*/

.settings-group {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
}

.settings-group-title {
  color: white;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 255, 153, 0.2);
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-header {
  flex: 1;
}

.setting-label {
  display: block;
  color: #00ff99;
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 0.3rem;
}

.setting-description {
  color: #999;
  font-size: 0.9rem;
}

/* Theme Selector */
.theme-selector {
  display: flex;
  gap: 1rem;
}

.theme-btn {
  padding: 1rem 1.5rem;
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(0, 255, 153, 0.2);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-width: 100px;
}

.theme-btn:hover {
  border-color: #00ff99;
  background: rgba(0, 255, 153, 0.1);
}

.theme-btn.active {
  background: rgba(0, 255, 153, 0.2);
  border-color: #00ff99;
  box-shadow: 0 0 20px rgba(0, 255, 153, 0.3);
}

.theme-icon {
  font-size: 2rem;
}

.theme-name {
  font-size: 0.9rem;
  font-weight: 500;
}

/* Select */
.setting-select {
  padding: 0.8rem 1rem;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(0, 255, 153, 0.3);
  border-radius: 6px;
  color: white;
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 200px;
}

.setting-select:focus {
  outline: none;
  border-color: #00ff99;
  box-shadow: 0 0 15px rgba(0, 255, 153, 0.2);
}

.setting-select option {
  background: #1a1a1a;
  color: white;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(0, 255, 153, 0.3);
  transition: 0.4s;
  border-radius: 34px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 4px;
  bottom: 4px;
  background-color: #999;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: rgba(0, 255, 153, 0.2);
  border-color: #00ff99;
}

input:checked + .toggle-slider:before {
  background-color: #00ff99;
  transform: translateX(26px);
  box-shadow: 0 0 10px rgba(0, 255, 153, 0.8);
}

/* Ajustes para modo claro */
body.light-theme .search-modal {
  background: rgba(255, 255, 255, 0.95);
}

body.light-theme .dashboard-container {
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
}

body.light-theme .dashboard-header {
  background: rgba(255, 255, 255, 0.95);
  border-bottom: 1px solid rgba(0, 255, 153, 0.3);
}

body.light-theme .search-card,
body.light-theme .settings-group,
body.light-theme .modal-content {
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

body.light-theme .card-title,
body.light-theme .section-title,
body.light-theme .modal-title,
body.light-theme .settings-group-title,
body.light-theme .social-platform {
  color: #1a1a1a;
}

body.light-theme .card-description,
body.light-theme .section-subtitle,
body.light-theme .setting-description,
body.light-theme .detail-label,
body.light-theme .nav-btn {
  color: #495057;
}

body.light-theme .results-area,
body.light-theme .results-content,
body.light-theme .modal-body > div {
  background: transparent !important;
}

body.light-theme pre {
  background: #f8f9fa;
  color: #1a1a1a;
}

body.light-theme .search-input,
body.light-theme .setting-select {
  background: rgba(0, 0, 0, 0.05);
  color: #1a1a1a;
  border-color: rgba(0, 255, 153, 0.3);
}

body.light-theme .search-input::placeholder {
  color: #6c757d;
}

body.light-theme .theme-btn {
  background: rgba(0, 0, 0, 0.05);
  color: #1a1a1a;
}

body.light-theme .grid-overlay {
  opacity: 0.2;
}

body.light-theme .ambient-glow {
  opacity: 0.05;
}

/* Responsive */
@media (max-width: 768px) {
  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .theme-selector {
    width: 100%;
  }

  .theme-btn {
    flex: 1;
  }
}

/*
**************************************************************************
****************************** HISTORY ***********************************
**************************************************************************
*/

/* History Section */
.history-section {
  animation: fadeInUp 0.8s ease-out;
}

.history-content {
  margin-top: 2rem;
}

/* History Filters */
.history-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.filter-select {
  flex: 1;
  min-width: 200px;
  padding: 0.8rem 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-primary);
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #00ff99;
  box-shadow: 0 0 15px rgba(0, 255, 153, 0.2);
}

.filter-select option {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.filter-btn {
  padding: 0.8rem 1.5rem;
  background: rgba(255, 68, 68, 0.1);
  border: 1px solid rgba(255, 68, 68, 0.3);
  border-radius: 6px;
  color: #ff4444;
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-btn:hover:not(:disabled) {
  background: rgba(255, 68, 68, 0.2);
  border-color: #ff4444;
}

.filter-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* History List */
.history-list {
  display: grid;
  gap: 1rem;
}

.history-item {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.history-item:hover {
  border-color: #00ff99;
  box-shadow: 0 0 20px rgba(0, 255, 153, 0.2);
  transform: translateY(-2px);
}

.history-icon {
  font-size: 2rem;
  min-width: 50px;
  text-align: center;
}

.history-info {
  flex: 1;
  cursor: pointer;
}

.history-query {
  color: var(--text-primary);
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.3rem;
}

.history-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.history-type {
  color: #00ff99;
  font-weight: 500;
}

.history-date {
  color: var(--text-secondary);
}

.history-actions {
  display: flex;
  gap: 0.5rem;
}

.icon-btn {
  width: 36px;
  height: 36px;
  background: rgba(0, 255, 153, 0.1);
  border: 1px solid rgba(0, 255, 153, 0.3);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: var(--text-primary);
}

.icon-btn:hover {
  background: rgba(0, 255, 153, 0.2);
  border-color: #00ff99;
  transform: scale(1.1);
}

.icon-btn.delete-btn:hover {
  background: rgba(255, 68, 68, 0.2);
  border-color: #ff4444;
  color: #ff4444;
}

/* Empty History */
.empty-history {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-history .empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.3;
}

.empty-history p {
  color: var(--text-primary);
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.empty-history small {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 768px) {
  .history-filters {
    flex-direction: column;
  }

  .filter-select {
    width: 100%;
  }

  .history-item {
    flex-wrap: wrap;
  }

  .history-actions {
    width: 100%;
    justify-content: flex-end;
  }
}

/*
**************************************************************************
************************** GOOGLE DORKS SECTION **************************
**************************************************************************
*/

.dorks-section {
  animation: fadeInUp 0.8s ease-out;
}

/* Vista de categorías */
.dorks-categories-view {
  width: 100%;
}

.dorks-categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.dork-category-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.dork-category-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 153, 0.1), transparent);
  transition: left 0.5s ease;
}

.dork-category-card:hover::before {
  left: 100%;
}

.dork-category-card:hover {
  border-color: #00ff99;
  transform: translateY(-5px);
  box-shadow: 0 0 25px rgba(0, 255, 153, 0.3);
}

.category-icon-large {
  font-size: 4rem;
  margin-bottom: 1rem;
  filter: drop-shadow(0 0 20px rgba(0, 255, 153, 0.5));
}

.category-title {
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.8rem;
}

.category-desc {
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.category-count {
  display: inline-block;
  padding: 0.4rem 1rem;
  background: rgba(0, 255, 153, 0.1);
  color: #00ff99;
  border: 1px solid rgba(0, 255, 153, 0.3);
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

/* Vista de lista de dorks */
.dorks-list-view {
  width: 100%;
}

.dorks-header {
  margin-bottom: 2rem;
}

.back-btn-dorks {
  padding: 0.7rem 1.2rem;
  background: transparent;
  color: #00ff99;
  border: 1px solid rgba(0, 255, 153, 0.3);
  border-radius: 6px;
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.back-btn-dorks:hover {
  background: rgba(0, 255, 153, 0.1);
  border-color: #00ff99;
  box-shadow: 0 0 15px rgba(0, 255, 153, 0.2);
}

.dorks-input-section {
  margin-bottom: 2rem;
}

.dorks-input {
  width: 100%;
  padding: 1rem 1.5rem;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid rgba(0, 255, 153, 0.3);
  border-radius: 8px;
  color: white;
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;
}

.dorks-input:focus {
  outline: none;
  border-color: #00ff99;
  box-shadow: 0 0 20px rgba(0, 255, 153, 0.3);
}

.dorks-input::placeholder {
  color: #666;
}

.input-hint {
  color: #888;
  font-size: 0.85rem;
  font-style: italic;
}

.dorks-list {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.dork-item {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
}

.dork-item:hover {
  border-color: #00ff99;
  box-shadow: 0 0 20px rgba(0, 255, 153, 0.2);
  transform: translateX(5px);
}

.dork-content {
  flex: 1;
}

.dork-title {
  color: var(--text-primary);
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.8rem;
}

.dork-query {
  background: rgba(0, 0, 0, 0.6);
  border-left: 3px solid #00ff99;
  padding: 0.8rem 1rem;
  margin-bottom: 0.8rem;
  border-radius: 4px;
  overflow-x: auto;
}

.dork-query code {
  color: #00ff99;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  word-break: break-all;
}

.dork-description {
  color: var(--text-secondary);
  font-size: 0.95rem;
  line-height: 1.5;
}

.dork-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 120px;
}

.dork-btn {
  padding: 0.7rem 1.2rem;
  background: rgba(0, 255, 153, 0.1);
  border: 1px solid rgba(0, 255, 153, 0.3);
  border-radius: 6px;
  color: #00ff99;
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.dork-btn:hover {
  background: rgba(0, 255, 153, 0.2);
  border-color: #00ff99;
  box-shadow: 0 0 10px rgba(0, 255, 153, 0.3);
}

.copy-btn:active {
  transform: scale(0.95);
}

/* Notification Toast */
.notification-toast {
  display: flex;
  align-items: center;
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: rgba(0, 255, 153, 0.95);
  color: #000;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 255, 153, 0.4);
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  z-index: 10000;
  animation: slideInRight 0.3s ease-out;
}

.notification-toast.error {
  background: rgba(255, 68, 68, 0.95);
  box-shadow: 0 4px 20px rgba(255, 68, 68, 0.4);
}

.notification-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 0.5rem;
  font-weight: bold;
  font-size: 1.2rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 50%;
}

@keyframes slideInRight {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Light theme */
body.light-theme .dorks-input {
  background: rgba(0, 0, 0, 0.05);
  color: #1a1a1a;
}

body.light-theme .dork-query {
  background: rgba(0, 0, 0, 0.05);
}

/* Responsive */
@media (max-width: 768px) {
  .dorks-categories-grid {
    grid-template-columns: 1fr;
  }

  .dork-item {
    flex-direction: column;
  }

  .dork-actions {
    width: 100%;
    flex-direction: row;
  }

  .dork-btn {
    flex: 1;
  }
}

/* Iconos en categorías */
.category-icon-large {
  height: 5rem;
  width: 5rem;
  margin-bottom: 1rem;
  filter: drop-shadow(0 0 20px rgba(0, 255, 153, 0.5));
}

/* Icono en hint */
.hint-icon {
  height: 1rem;
  width: 1rem;
  vertical-align: middle;
  margin-right: 0.3rem;
  filter: drop-shadow(0 0 5px rgba(0, 255, 153, 0.5));
}

.input-hint {
  display: flex;
  align-items: center;
  color: #888;
  font-size: 0.85rem;
  font-style: italic;
}

/* Iconos en botones */
.btn-icon {
  height: 1.2rem;
  width: 1.2rem;
  filter: drop-shadow(0 0 5px rgba(0, 255, 153, 0.5));
}

.dork-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
</style>