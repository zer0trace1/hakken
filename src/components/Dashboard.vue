<template>
  <div class="dashboard-container">
    <!-- Header/Navbar -->
    <header class="dashboard-header">
      <div class="header-content">
        <div class="logo-section">
          <img src="@/assets/hakken-logo-no-bg.png" alt="Hakken" class="header-logo" />
        </div>
        <nav class="nav-section">
          <button class="nav-btn active">
            <span class="icon">🔍</span>
            Búsqueda
          </button>
          <button class="nav-btn">
            <span class="icon">📊</span>
            Historial
          </button>
          <button class="nav-btn">
            <span class="icon">⚙️</span>
            Ajustes
          </button>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="dashboard-main">
      <!-- Search Section -->
      <section class="search-section">
        <h1 class="section-title">
          Dashboard <span class="highlight">OSINT</span>
        </h1>
        <p class="section-subtitle">Selecciona el tipo de búsqueda que deseas realizar</p>

        <!-- Search Cards Grid -->
        <div class="search-cards-grid">
          <!-- Username Card -->
          <div class="search-card" @click="selectSearchType('username')">
            <div class="card-icon">👤</div>
            <h3 class="card-title">Username</h3>
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
import { ref } from 'vue'

const selectedType = ref(null)
const searchQuery = ref('')
const searchResults = ref(null)
const isSearching = ref(false)

const selectSearchType = (type) => {
  selectedType.value = type
  searchQuery.value = ''
  searchResults.value = null
}

const closeModal = () => {
  selectedType.value = null
  searchQuery.value = ''
  searchResults.value = null
}

const getTypeLabel = (type) => {
  const labels = {
    username: 'Username',
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
  
  // Simular búsqueda (aquí conectarás con tu backend)
  setTimeout(() => {
    searchResults.value = {
      query: searchQuery.value,
      type: selectedType.value,
      timestamp: new Date().toISOString(),
      // Aquí irán los resultados reales de tu API
      message: 'Búsqueda simulada - Conecta con tu backend AWS aquí'
    }
    isSearching.value = false
  }, 1500)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap');

.dashboard-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(ellipse at center, #0d0d0d 0%, #000000 100%);
  overflow-y: auto;
  font-family: 'Rajdhani', sans-serif;
}

/* Header */
.dashboard-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 255, 153, 0.2);
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

.search-card {
  background: rgba(15, 15, 15, 0.8);
  border: 1px solid rgba(0, 255, 153, 0.3);
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
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
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
</style>