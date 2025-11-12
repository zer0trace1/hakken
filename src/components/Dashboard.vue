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
            <span class="icon">🔍</span>
            Búsqueda
          </button>
          <button class="nav-btn">
            <span class="icon">📊</span>
            Historial
          </button>
          <button 
            :class="['nav-btn', { active: currentView === 'settings' }]" 
            @click="currentView = 'settings'"
          >
            <span class="icon">⚙️</span>
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
            <div class="card-icon">👤</div>
            <h3 class="card-title">Nombre de usuario</h3>
            <p class="card-description">Busca información por nombre de usuario en redes sociales</p>
            <div class="card-badge">Redes Sociales</div>
          </div>

          <!-- Email Card -->
          <div class="search-card" @click="selectSearchType('email')">
            <div class="card-icon">📧</div>
            <h3 class="card-title">Email</h3>
            <p class="card-description">Investiga cuentas asociadas a direcciones de correo</p>
            <div class="card-badge">Correo Electrónico</div>
          </div>

          <!-- Phone Card -->
          <div class="search-card" @click="selectSearchType('phone')">
            <div class="card-icon">📱</div>
            <h3 class="card-title">Teléfono</h3>
            <p class="card-description">Busca información vinculada a números telefónicos</p>
            <div class="card-badge">Número de Teléfono</div>
          </div>

          <!-- IP Card -->
          <div class="search-card" @click="selectSearchType('ip')">
            <div class="card-icon">🌐</div>
            <h3 class="card-title">Dirección IP</h3>
            <p class="card-description">Obtén geolocalización y detalles de direcciones IP</p>
            <div class="card-badge">Dirección IP</div>
          </div>

          <!-- Domain Card -->
          <div class="search-card" @click="selectSearchType('domain')">
            <div class="card-icon">🔗</div>
            <h3 class="card-title">Dominio</h3>
            <p class="card-description">Analiza información de dominios y DNS</p>
            <div class="card-badge">Dominio/DNS</div>
          </div>

          <!-- Advanced Card -->
          <div class="search-card advanced-card">
            <div class="card-icon">⚡</div>
            <h3 class="card-title">Búsqueda Avanzada</h3>
            <p class="card-description">Combina múltiples parámetros de búsqueda</p>
            <div class="card-badge special">Próximamente</div>
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
              <span class="icon">🎨</span>
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
                  <span class="theme-icon">🌙</span>
                  <span class="theme-name">Oscuro</span>
                </button>
                <button 
                  :class="['theme-btn', { active: theme === 'light' }]" 
                  @click="theme = 'light'"
                >
                  <span class="theme-icon">☀️</span>
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
                <span v-else class="loading-spinner">⚙️</span>
              </button>
            </div>

            <!-- Mensaje de error -->
            <div v-if="searchError" class="error-message">
              <span class="error-icon">⚠️</span>
              <span class="error-text">{{ searchError }}</span>
              <button class="error-close" @click="searchError = null">✕</button>
            </div>

            <!-- Results Area -->
            <div v-if="searchResults" class="results-area">
              <h3 class="results-title">Resultados de búsqueda</h3>
              <div class="results-content">
                <!--<pre>{{ searchResults }}</pre>-->
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

const performSearch = async () => {
  if (!searchQuery.value.trim()) return
  
  isSearching.value = true
  searchError.value = null
  
  try {
    let results = null
    
    switch(selectedType.value) {
      case 'username':
        results = await api.searchGitHubUser(searchQuery.value)
        searchResults.value = formatGitHubResults(results)
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

.card-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  filter: drop-shadow(0 0 10px rgba(0, 255, 153, 0.5));
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

body.light-theme .results-container {
  color: #1a1a1a;
  background: rgba(255, 255, 255, 0.9);
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
</style>