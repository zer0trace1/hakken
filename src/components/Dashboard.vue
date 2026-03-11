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
          <div>
            <div v-if="userEmail" class="auth-box">
              <p class="auth-text">
                <span class="auth-label">Logueado como:</span>
                <span class="auth-email">{{ userEmail }}</span>
              </p>

              <button class="auth-logout" @click="logout">Cerrar sesión</button>
            </div>
          </div>
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
          <div class="search-card" @click="selectSearchType('person')">
            <img src="@/assets/hakken-logo-persona.png" alt="Name-logo" class="card-icon"/>
            <h3 class="card-title">Nombre y apellidos</h3>
            <p class="card-description">Busca información de personas a partir de sus nombres y apellidos</p>
            <div class="card-badge">Identidades</div>
          </div>
          
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
              <option value="person">Nombre y apellidos</option>
              <option value="username">Nombre de usuario</option>
              <option value="email">Email</option>
              <option value="phone">Teléfono</option>
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

          <div v-if="historyLoading" class="empty-history">
            <p>Cargando historial...</p>
          </div>

          <div v-else-if="historyError" class="empty-history">
            <p>{{ historyError }}</p>
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
                <button class="icon-btn" @click.stop="repeatSearch(item)" title="Repetir búsqueda">
                  <img src="@/assets/hakken-logo-repeat.png" alt="hakken-logo-papelera" class="card-icon-history-section">
                </button>
                <button class="icon-btn delete-btn" @click.stop="deleteHistoryItem(item.id)" title="Eliminar">
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
            <!-- Name Category -->
            <!--<div class="dork-category-card" @click="selectDorkCategory('name')">
              <img src="@/assets/hakken-logo-usuario.png" alt="Username" class="category-icon-large"/>
              <h3 class="category-title">Nombre</h3>
              <p class="category-desc">Dorks para buscar personas en redes sociales y plataformas</p>
              <div class="category-count">5 dorks disponibles</div>
            </div>-->
            
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
              <div v-if="selectedType === 'person'" style="margin-top:10px;">
                <button type="button" class="ip-link-btn" @click="showPersonContext = !showPersonContext">
                  + Añadir contexto: ciudad, trabajo, etc.
                </button>

                <input
                  v-if="showPersonContext"
                  v-model="personContext"
                  type="text"
                  placeholder="Ej: Valencia, ciberseguridad, UPV, Orange..."
                  class="username-filter-input"
                  style="margin-top:10px;"
                />
              </div>
              <button :disabled="isSearching_progress" class="search-btn" @click="performSearch">
                <span v-if="!isSearching">Buscar</span>
                <span v-else class="loading-spinner">
                  <img src="@/assets/hakken-logo-ajustes.png" alt="hakken-logo-ajustes" class="card-icon-loading">
                </span>
              </button>
            </div>

            <div v-if="isSearching_progress" class="progress-wrap">
              <div class="progress-top">
                <span>Buscando…</span>
                <span>{{ progress }}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: progress + '%' }"></div>
              </div>
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
                
                <!-- Name section -->
                <template v-if="selectedType === 'person' && searchResults">
                  <div class="domain-scroll">
                    <div class="domain-section">
                      <div class="domain-section-title">Búsqueda por nombre (asistida)</div>
                      <div class="domain-muted">
                        Posibles coincidencias. Verifica identidad manualmente abriendo las fuentes.
                      </div>

                      <div v-if="searchResults.context" class="domain-muted" style="margin-top:6px;">
                        Contexto: <span class="mono">{{ searchResults.context }}</span>
                      </div>

                      <div class="phone-evidence-grid" style="margin-top:12px;">
                        <div
                          v-for="c in (searchResults.checks || [])"
                          :key="c.url"
                          class="phone-evidence-card"
                        >
                          <div class="phone-evidence-card-top">
                            <div class="phone-evidence-card-name">{{ c.label }}</div>
                            <span class="phone-evidence-badge">{{ c.category }}</span>
                          </div>

                          <div class="phone-evidence-card-desc">{{ c.hint }}</div>

                          <button class="phone-evidence-btn" type="button" @click="openExternal(c.url)">
                            Abrir
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>

                <template v-else-if="selectedType === 'username' && searchResults">
                  <div class="username-legend">
                    <div class="legend-item">
                      <span class="legend-icon">✅</span>
                      <span class="legend-text">Confirmado</span>
                    </div>
                    <div class="legend-item">
                      <span class="legend-icon">⚠️</span>
                      <span class="legend-text">Posible coincidencia</span>
                    </div>
                    <div class="legend-item">
                      <span class="legend-icon">❓</span>
                      <span class="legend-text">No concluyente (abre el enlace)</span>
                    </div>
                    <div class="legend-item">
                      <span class="legend-icon">❌</span>
                      <span class="legend-text">No encontrado</span>
                    </div>
                  </div>
                  <div class="username-filter">
                    <input
                      v-model="usernameFilter"
                      type="text"
                      placeholder="Filtrar fuentes (ej: github, reddit, .io...)"
                      class="username-filter-input"
                    />
                    <span class="username-filter-count">
                      {{ filteredUsernameResults.length }} / {{ (searchResults?.results || []).length }}
                    </span>
                  </div>
                  <div v-if="searchResults.results && searchResults.results.length" class="username-results" :class="`status-${(item && item.status) ? item.status : 'unknown'}`">
                    <div v-for="item in filteredUsernameResults" :key="item.platform + ':' + item.url" class="username-result">
                      <span
                        class="username-indicator"
                        tabindex="0"
                        @mouseenter="(e) => showTooltip(e, item)"
                        @mouseleave="hideTooltip"
                        @focus="(e) => showTooltip(e, item)"
                        @blur="hideTooltip"
                        aria-label="Indicador de confianza"
                      >
                        {{ item.indicator }}
                      </span>
                      <span class="username-platform">{{ item.platform }}:</span>
                      <a class="username-link" :href="item.url" target="_blank" rel="noopener noreferrer">{{ item.url }}</a>
                    </div>
                  </div>
                  <div v-else class="empty-results">No se encontraron perfiles públicos para este username.</div>

                  <!-- Floating tooltip (fixed) -->
                  <div
                    v-if="tooltip.show"
                    class="floating-tooltip"
                    :style="{ top: tooltip.y + 'px', left: tooltip.x + 'px' }"
                  >
                    {{ tooltip.text }}
                  </div>
                </template>
                <template v-else-if="selectedType === 'phone' && searchResults">
                  <div class="phone-scroll">
                    <div class="phone-cards">
                      <div class="phone-card">
                        <div class="phone-card-title">Número</div>
                        <div class="phone-card-main">{{ (searchResults.normalized && searchResults.normalized.national) || searchResults.query }}</div>
                        <div class="phone-card-sub">{{ (searchResults.normalized && searchResults.normalized.e164) || '' }}</div>
                      </div>

                      <div class="phone-card">
                        <div class="phone-card-title">País / Zona</div>
                        <div class="phone-card-main">{{ (searchResults.metadata && searchResults.metadata.location) || (searchResults.normalized && searchResults.normalized.region) || '—' }}</div>
                        <div class="phone-card-sub">Zona horaria: {{ ((searchResults.metadata && searchResults.metadata.timezones) || []).join(', ') || '—' }}</div>
                      </div>

                      <div class="phone-card">
                        <div class="phone-card-title">Tipo de línea</div>
                        <div class="phone-card-main">{{ formatLineType(searchResults.metadata && searchResults.metadata.line_type) }}</div>
                        <div class="phone-card-sub">Operador: {{ (searchResults.metadata && searchResults.metadata.carrier) || '—' }}</div>
                      </div>

                      <div class="phone-card">
                        <div class="phone-card-title">Validación</div>

                        <div class="phone-card-main">
                          <!-- reputación comunitaria -->
                          <span
                            :class="phoneReputationClass(searchResults?.community_reports?.total)"
                          >
                            {{ phoneReputationLabel(searchResults?.community_reports?.total) }}
                          </span>
                        </div>

                        <div class="phone-card-sub" style="opacity:.75;">
                          Nota: La reputación se calcula en base a reportes comunitarios (no es verificación oficial).
                        </div>
                      </div>
                    </div>
                    <div class="phone-evidence">
                      <div class="phone-evidence-header">
                        <div class="phone-evidence-title">Fuentes para comprobar el número</div>
                        <div class="phone-evidence-subtitle">
                          Abre estas páginas desde tu navegador para ver denuncias, comentarios o información pública.
                        </div>
                      </div>

                      <div class="phone-evidence-grid">
                        <div
                          v-for="c in getPhoneEvidenceCards(searchQuery, searchResults?.normalized)"
                          :key="c.url"
                          class="phone-evidence-card"
                        >
                          <div class="phone-evidence-card-top">
                            <div class="phone-evidence-card-name">{{ c.title }}</div>
                            <span class="phone-evidence-badge">{{ c.badge }}</span>
                          </div>

                          <div class="phone-evidence-card-desc">{{ c.subtitle }}</div>

                          <button class="phone-evidence-btn" type="button" @click="openExternal(c.url)">
                            Abrir
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="phone-report-box">
                      <div class="phone-report-title">Reportar este número</div>
                      <div class="phone-report-sub">
                        Esto lo reporta la comunidad de HAKKEN. No es verificación oficial.
                      </div>

                      <div class="phone-report-form">
                        <label class="pr-label">Motivo</label>
                        <select v-model="reportCategory" class="pr-select">
                          <option value="spam">Spam</option>
                          <option value="fraude">Fraude / estafa</option>
                          <option value="telemarketing">Telemarketing</option>
                          <option value="otro">Otro</option>
                        </select>

                        <label class="pr-label">Comentario (opcional)</label>
                        <textarea
                          v-model="reportComment"
                          class="pr-textarea"
                          placeholder="Ej: llamada insistente, suplantación, etc."
                          maxlength="200"
                        />

                        <button class="pr-btn" type="button" :disabled="isReporting" @click="submitPhoneReport">
                          {{ isReporting ? "Enviando..." : "Enviar reporte" }}
                        </button>

                        <div v-if="reportMsg" class="pr-ok">{{ reportMsg }}</div>
                        <div v-if="reportErr" class="pr-err">{{ reportErr }}</div>
                      </div>
                      <div v-if="searchResults?.community_reports" class="community-box">
                        <div class="community-title">Reportes de la comunidad para ESTE número</div>

                        <div class="community-stats">
                          <div class="cs-pill">Total: {{ searchResults.community_reports.total || 0 }}</div>
                          <div class="cs-pill">Spam: {{ searchResults.community_reports.spam || 0 }}</div>
                          <div class="cs-pill">Fraude: {{ searchResults.community_reports.fraude || 0 }}</div>
                          <div class="cs-pill">Telemarketing: {{ searchResults.community_reports.telemarketing || 0 }}</div>
                          <div class="cs-pill">Otro: {{ searchResults.community_reports.otro || 0 }}</div>
                        </div>

                        <details class="community-latest" v-if="(searchResults.community_reports.latest || []).length">
                          <summary>Ver últimos reportes</summary>
                          <div class="community-item" v-for="r in searchResults.community_reports.latest" :key="r.created_at + r.category">
                            <div class="ci-top">
                              <span class="ci-cat">{{ r.category }}</span>
                              <span class="ci-date">{{ r.created_at }}</span>
                            </div>
                            <div class="ci-comment" v-if="r.comment">{{ r.comment }}</div>
                          </div>
                        </details>
                      </div>
                    </div>
                  </div>
                </template>

                <template v-else-if="selectedType === 'domain' && searchResults">
                  <div class="domain-scroll">
                    <!-- Resumen -->
                    <div class="domain-cards">
                      <div class="domain-card">
                        <div class="domain-card-title">Dominio</div>
                        <div class="domain-card-main">{{ searchResults.domain }}</div>
                        <div class="domain-card-sub">
                          <span :class="searchResults.exists ? 'pill ok' : 'pill bad'">
                            {{ searchResults.exists ? 'Existe (DNS)' : 'No resuelve' }}
                          </span>
                        </div>
                      </div>

                      <div class="domain-card">
                        <div class="domain-card-title">Web</div>
                        <div class="domain-card-main">
                          <span :class="searchResults.web?.ok ? 'pill ok' : 'pill warn'">
                            {{ searchResults.web?.ok ? (searchResults.web.status_code + ' OK') : 'No accesible' }}
                          </span>
                        </div>
                        <div class="domain-card-sub">
                          <span v-if="searchResults.web?.ok">
                            {{ searchResults.web.final_url }}
                          </span>
                          <span v-else>
                            {{ searchResults.web?.error || 'Sin respuesta HTTP' }}
                          </span>
                        </div>
                        <!-- Badges de security headers -->
                        <div class="sec-badges" v-if="searchResults?.web?.ok">
                          <span :class="(searchResults.web.security_headers?.['strict-transport-security'] ? 'sec-badge ok' : 'sec-badge warn')">
                            HSTS
                          </span>
                          <span :class="(searchResults.web.security_headers?.['content-security-policy'] ? 'sec-badge ok' : 'sec-badge warn')">
                            CSP
                          </span>
                          <span :class="(searchResults.web.security_headers?.['x-frame-options'] ? 'sec-badge ok' : 'sec-badge warn')">
                            XFO
                          </span>
                          <span :class="(searchResults.web.security_headers?.['x-content-type-options'] ? 'sec-badge ok' : 'sec-badge warn')">
                            XCTO
                          </span>
                          <span :class="(searchResults.web.security_headers?.['referrer-policy'] ? 'sec-badge ok' : 'sec-badge warn')">
                            Referrer
                          </span>
                          <span :class="(searchResults.web.security_headers?.['permissions-policy'] ? 'sec-badge ok' : 'sec-badge warn')">
                            Permissions
                          </span>
                        </div>

                        <!-- Tooltip simple / detalles (opcional) -->
                        <details class="advanced" v-if="searchResults?.web?.ok && searchResults?.web?.security_headers">
                          <summary>Ver headers</summary>
                          <div class="table">
                            <div class="tr head" style="grid-template-columns: 1.2fr 2.8fr;">
                              <div>Header</div><div>Valor</div>
                            </div>
                            <div class="tr" v-for="(v, k) in searchResults.web.security_headers" :key="k" style="grid-template-columns: 1.2fr 2.8fr;">
                              <div class="mono">{{ k }}</div>
                              <div class="mono">{{ v }}</div>
                            </div>
                          </div>
                        </details>
                      </div>

                      <div class="domain-card">
                        <div class="domain-card-title">Email security</div>
                        <div class="domain-card-main">
                          <span :class="searchResults.email_security?.spf?.present ? 'pill ok' : 'pill warn'">
                            SPF {{ searchResults.email_security?.spf?.present ? '✅' : '—' }}
                          </span>
                          <span :class="searchResults.email_security?.dmarc?.present ? 'pill ok' : 'pill warn'">
                            DMARC {{ searchResults.email_security?.dmarc?.present ? '✅' : '—' }}
                          </span>
                        </div>
                        <div class="domain-card-sub">
                          <span v-if="searchResults.email_security?.dmarc?.present">
                            Policy: {{ searchResults.email_security.dmarc.policy || '—' }}
                          </span>
                          <span v-else>
                            Sin DMARC/SPF detectados (puede ser normal si no envías correo desde este dominio)
                          </span>
                        </div>
                      </div>

                      <div class="domain-card">
                        <div class="domain-card-title">Timestamp</div>
                        <div class="domain-card-main">{{ searchResults.checked_at }}</div>
                        <div class="domain-card-sub">Última comprobación</div>
                      </div>

                      <!-- TLS -->
                      <div class="domain-card">
                        <div class="domain-card-title">TLS (certificado)</div>
                        <div class="domain-card-main">
                          <span :class="domainPill(searchResults?.tls?.ok)">
                            {{ searchResults?.tls?.ok ? "OK" : "No disponible" }}
                          </span>
                        </div>
                        <div class="domain-card-sub" v-if="searchResults?.tls?.ok">
                          <div><b>Issuer:</b> {{ fmtMaybe(searchResults.tls.issuer) }}</div>
                          <div><b>Válido hasta:</b> {{ fmtDateLoose(searchResults.tls.not_after) }}</div>
                          <div><b>SAN:</b> {{ (searchResults.tls.san || []).length }} entradas</div>
                        </div>
                        <div class="domain-card-sub" v-else>
                          {{ fmtMaybe(searchResults?.tls?.error) }}
                        </div>
                      </div>

                      <!-- Extras -->
                      <div class="domain-card">
                        <div class="domain-card-title">Extras</div>
                        <div class="domain-card-main">
                          <span :class="domainPill(searchResults?.extras?.robots?.ok)">robots.txt</span>
                          <span :class="domainPill(searchResults?.extras?.sitemap?.ok)">sitemap</span>
                          <span :class="domainPill(searchResults?.extras?.security_txt?.ok)">security.txt</span>
                        </div>
                        <div class="domain-card-sub">
                          Abre detalles abajo para ver snippets.
                        </div>
                      </div>

                      <!-- Certificate Transparency -->
                      <div class="domain-card">
                        <div class="domain-card-title">Subdominios (CT)</div>
                        <div class="domain-card-main">
                          <span :class="domainPill(searchResults?.ct_subdomains?.ok)">
                            {{ searchResults?.ct_subdomains?.ok ? "Disponible" : "No disponible" }}
                          </span>
                        </div>
                        <div class="domain-card-sub" v-if="searchResults?.ct_subdomains?.ok">
                          <b>Count:</b> {{ searchResults.ct_subdomains.count }}
                          <span v-if="searchResults.ct_subdomains.truncated"> · (truncado)</span>
                        </div>
                        <div class="domain-card-sub" v-else>
                          {{ fmtMaybe(searchResults?.ct_subdomains?.error) }}
                        </div>
                      </div>
                    </div>

                    <!-- DNS -->
                    <div class="domain-section">
                      <div class="domain-section-title">DNS</div>

                      <div v-for="(values, rtype) in (searchResults.dns_by_type || {})" :key="rtype" class="dns-block">
                        <div class="dns-type">{{ rtype }}</div>
                        <div class="dns-values">
                          <div v-for="v in values" :key="v" class="dns-value">{{ v }}</div>
                        </div>
                      </div>

                      <div v-if="!Object.keys(searchResults.dns_by_type || {}).length" class="domain-muted">
                        No se encontraron registros DNS.
                      </div>
                    </div>
                    <div class="domain-section">
                      <div class="domain-section-title">Resumen DNS (útil)</div>
                      <div class="kv-grid">
                        <div class="kv">
                          <div class="kv-k">IPs</div>
                          <div class="kv-v">{{ (searchResults?.dns_parsed?.ips || []).length }}</div>
                        </div>
                        <div class="kv">
                          <div class="kv-k">MX</div>
                          <div class="kv-v">{{ (searchResults?.dns_parsed?.mx || []).length }}</div>
                        </div>
                        <div class="kv">
                          <div class="kv-k">CAA</div>
                          <div class="kv-v">{{ (searchResults?.dns_parsed?.caa || []).length }}</div>
                        </div>
                        <div class="kv">
                          <div class="kv-k">TXT</div>
                          <div class="kv-v">{{ fmtMaybe(searchResults?.dns_parsed?.txt_count, 0) }}</div>
                        </div>
                      </div>

                      <details class="advanced" v-if="(searchResults?.dns_parsed?.mx || []).length">
                        <summary>Ver MX</summary>
                        <div class="table">
                          <div class="tr head">
                            <div>Prioridad</div><div>Host</div>
                          </div>
                          <div class="tr" v-for="m in searchResults.dns_parsed.mx" :key="String(m.priority)+m.host">
                            <div>{{ fmtMaybe(m.priority) }}</div><div class="mono">{{ m.host }}</div>
                          </div>
                        </div>
                      </details>

                      <details class="advanced" v-if="(searchResults?.dns_parsed?.caa || []).length">
                        <summary>Ver CAA</summary>
                        <div class="table">
                          <div class="tr head">
                            <div>Flag</div><div>Tag</div><div>Value</div>
                          </div>
                          <div class="tr" v-for="(c, idx) in searchResults.dns_parsed.caa" :key="idx">
                            <div>{{ fmtMaybe(c.flag) }}</div><div>{{ fmtMaybe(c.tag) }}</div><div class="mono">{{ fmtMaybe(c.value, c.raw) }}</div>
                          </div>
                        </div>
                      </details>
                    </div>

                    <div class="domain-section">
                      <div class="domain-section-title">Extras (snippets)</div>

                      <details class="advanced">
                        <summary>robots.txt</summary>
                        <div v-if="searchResults?.extras?.robots?.ok">
                          <div class="domain-muted mono">{{ searchResults.extras.robots.url }}</div>
                          <pre class="snippet">{{ searchResults.extras.robots.snippet }}</pre>
                        </div>
                        <div v-else class="domain-muted">{{ fmtMaybe(searchResults?.extras?.robots?.status_code, "No disponible") }}</div>
                      </details>

                      <details class="advanced">
                        <summary>sitemap.xml</summary>
                        <div v-if="searchResults?.extras?.sitemap?.ok">
                          <div class="domain-muted mono">{{ searchResults.extras.sitemap.url }}</div>
                          <pre class="snippet">{{ searchResults.extras.sitemap.snippet }}</pre>
                        </div>
                        <div v-else class="domain-muted">{{ fmtMaybe(searchResults?.extras?.sitemap?.status_code, "No disponible") }}</div>
                      </details>

                      <details class="advanced">
                        <summary>security.txt</summary>
                        <div v-if="searchResults?.extras?.security_txt?.ok">
                          <div class="domain-muted mono">{{ searchResults.extras.security_txt.url }}</div>
                          <pre class="snippet">{{ searchResults.extras.security_txt.snippet }}</pre>
                        </div>
                        <div v-else class="domain-muted">{{ fmtMaybe(searchResults?.extras?.security_txt?.status_code, "No disponible") }}</div>
                      </details>
                    </div>

                    <div class="domain-section" v-if="(searchResults?.ip_info || []).length">
                      <div class="domain-section-title">IP info (PTR / ASN)</div>
                      <div class="table">
                        <div class="tr head">
                          <div>IP</div><div>PTR</div><div>ASN</div><div>ORG</div>
                        </div>
                        <div class="tr" v-for="row in searchResults.ip_info" :key="row.ip">
                          <div class="mono">{{ row.ip }}</div>
                          <div class="mono">{{ fmtMaybe(row.ptr) }}</div>
                          <div>{{ fmtMaybe(row.asn) }}</div>
                          <div>{{ fmtMaybe(row.org) }}</div>
                        </div>
                      </div>
                    </div>

                    <div class="domain-section">
                      <div class="domain-section-title">Subdominios (Certificate Transparency)</div>

                      <div v-if="!searchResults?.ct_subdomains?.ok" class="domain-muted">
                        No disponible ahora mismo: {{ fmtMaybe(searchResults?.ct_subdomains?.error) }}
                      </div>

                      <div v-else>
                        <div class="domain-muted">
                          Total: {{ searchResults.ct_subdomains.count }}
                          <span v-if="searchResults.ct_subdomains.truncated"> · (mostrando solo una parte)</span>
                        </div>

                        <div class="domain-filter">
                          <input v-model="ctFilter" class="domain-filter-input" placeholder="Filtrar subdominios..." />
                          <span class="domain-filter-count">{{ ctItemsFiltered.length }}</span>
                        </div>

                        <div class="subdomain-list">
                          <div class="subdomain-item mono" v-for="s in ctItemsFiltered.slice(0, 200)" :key="s">
                            {{ s }}
                          </div>
                        </div>
                      </div>
                    </div>

                    <details class="advanced" v-if="searchResults?.tls?.ok">
                      <summary>Ver SAN (primeras 15)</summary>
                      <div class="subdomain-list">
                        <div class="subdomain-item mono" v-for="s in tlsSanPreview" :key="s">{{ s }}</div>
                      </div>
                      <div class="domain-muted" v-if="(searchResults.tls.san || []).length > 15">
                        Hay más SAN ({{ (searchResults.tls.san || []).length }} total).
                      </div>
                    </details>

                    <!-- Modo técnico opcional -->
                    <details class="advanced">
                      <summary>Modo técnico</summary>
                      <pre class="advanced-json">{{ JSON.stringify(searchResults, null, 2) }}</pre>
                    </details>
                  </div>
                </template>

                <template v-else-if="selectedType === 'ip' && searchResults">
                  <div class="ip-scroll">
                    <!-- Cards resumen -->
                    <div class="ip-cards">
                      <div class="ip-card">
                        <div class="ip-card-title">IP</div>
                        <div class="ip-card-main mono">{{ searchResults.ip }}</div>
                        <div class="ip-card-sub">
                          <span class="pill ok">IPv{{ searchResults.normalized?.version }}</span>
                          <span :class="searchResults.normalized?.is_global ? 'pill ok' : 'pill warn'">
                            {{ searchResults.normalized?.scope }}
                          </span>
                        </div>
                      </div>

                      <div class="ip-card">
                        <div class="ip-card-title">ASN / Org</div>
                        <div class="ip-card-main">{{ fmtMaybe(searchResults.geo?.asn_number) }}</div>
                        <div class="ip-card-sub">
                          {{ fmtMaybe(searchResults.geo?.asn_name) }} · {{ fmtMaybe(searchResults.geo?.org) }}
                        </div>
                      </div>

                      <div class="ip-card">
                        <div class="ip-card-title">Ubicación</div>
                        <div class="ip-card-main">
                          {{ fmtMaybe(searchResults.geo?.city) }}, {{ fmtMaybe(searchResults.geo?.regionName || searchResults.region) }}
                        </div>
                        <div class="ip-card-sub">
                          {{ fmtMaybe(searchResults.geo?.country) }} · {{ fmtMaybe(searchResults.geo?.timezone) }}
                        </div>
                      </div>

                      <div class="ip-card">
                        <div class="ip-card-title">Reverse DNS</div>
                        <div class="ip-card-main mono">{{ fmtMaybe(searchResults.rdns?.ptr) }}</div>
                        <div class="ip-card-sub">
                          {{ searchResults.rdns?.ok ? "PTR encontrado" : "Sin PTR" }}
                        </div>
                      </div>
                    </div>

                    <div class="ip-section" v-if="searchResults?.geo?.lat != null && searchResults?.geo?.lon != null">
                      <div class="ip-section-title">Mapa (aproximado)</div>

                      <div class="map-wrap">
                        <iframe
                          class="map-iframe"
                          :src="osmEmbedUrl(searchResults.geo.lat, searchResults.geo.lon)"
                          loading="lazy"
                          referrerpolicy="no-referrer-when-downgrade"
                        />
                      </div>

                      <div class="ip-muted" style="margin-top:8px;">
                        Nota: la geolocalización por IP es aproximada (normalmente ciudad/region, no dirección exacta).
                      </div>
                    </div>

                    <!-- Badges señales -->
                    <div class="ip-section">
                      <div class="ip-section-title">Señales</div>
                      <div class="sec-badges">
                        <span :class="ipFlagClass(searchResults.geo?.proxy)">Proxy: {{ ipFlagText(searchResults.geo?.proxy) }}</span>
                        <span :class="ipFlagClass(searchResults.geo?.hosting)">Hosting: {{ ipFlagText(searchResults.geo?.hosting) }}</span>
                        <span :class="ipFlagClass(searchResults.geo?.mobile)">Mobile: {{ ipFlagText(searchResults.geo?.mobile) }}</span>
                      </div>
                      <div class="ip-muted" style="margin-top:8px;">
                        Fuente: ip-api (indicadores aproximados).
                      </div>
                    </div>

                    <!-- RDAP -->
                    <div class="ip-section" v-if="searchResults.rdap">
                      <div class="ip-section-title">RDAP (propiedad / rango)</div>
                      <div class="table">
                        <div class="tr head" style="grid-template-columns: 1.2fr 2.8fr;">
                          <div>Campo</div><div>Valor</div>
                        </div>
                        <div class="tr" style="grid-template-columns: 1.2fr 2.8fr;">
                          <div>CIDR</div><div class="mono">{{ fmtMaybe(searchResults.rdap?.cidr) }}</div>
                        </div>
                        <div class="tr" style="grid-template-columns: 1.2fr 2.8fr;">
                          <div>ASN</div><div>{{ fmtMaybe(searchResults.rdap?.asn) }} · {{ fmtMaybe(searchResults.rdap?.asn_description) }}</div>
                        </div>
                        <div class="tr" style="grid-template-columns: 1.2fr 2.8fr;">
                          <div>Owner</div><div>{{ fmtMaybe(searchResults.rdap?.name) }}</div>
                        </div>
                      </div>
                    </div>

                    <!-- Links (assisted) -->
                    <div class="ip-section">
                      <div class="ip-section-title">Comprobación en navegador</div>
                      <div class="ip-links-grid">
                        <button
                          v-for="l in (searchResults.links || [])"
                          :key="l.url"
                          type="button"
                          class="ip-link-btn"
                          @click="openExternal(l.url)"
                        >
                          {{ l.label }}
                        </button>
                      </div>
                    </div>

                    <!-- Modo técnico opcional -->
                    <details class="advanced">
                      <summary>Modo técnico</summary>
                      <pre class="advanced-json">{{ JSON.stringify(searchResults, null, 2) }}</pre>
                    </details>
                  </div>
                </template>

                <template v-else>
                  <pre>{{ searchResults }}</pre>
                </template>
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
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import { signOut, getUser } from "@/auth/oidc";

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

const userEmail = ref(null);

/*
**************************************************************************
****************************** CUSTOM UX *********************************
**************************************************************************
*/

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

onMounted(async () => {
  // UI/theme
  const savedTheme = localStorage.getItem('hakken_theme');
  if (savedTheme) theme.value = savedTheme;
  applyTheme(theme.value);

  // user
  try {
    const user = await getUser();
    userEmail.value = user?.profile?.email || null;
  } catch {
    userEmail.value = null;
  }

  // si quieres precargar historial al entrar:
  // await fetchHistory()


  // Tooltip: hide on scroll/resize to avoid stale position
  window.addEventListener('scroll', _hideTooltipOnWindowEvent, true)
  window.addEventListener('resize', _hideTooltipOnWindowEvent)
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', _hideTooltipOnWindowEvent, true)
  window.removeEventListener('resize', _hideTooltipOnWindowEvent)
})

async function logout() {
  await signOut();
}

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

// --- HISTORY (pon esto ANTES de cualquier watch que lo use) ---
const historyFilter = ref('all')
const searchHistory = ref([])
const historyLoading = ref(false)
const historyError = ref(null)

const HISTORY_LIMIT = 50
const HISTORY_OFFSET = 0

const filteredHistory = computed(() => {
  if (historyFilter.value === 'all') return searchHistory.value
  return searchHistory.value.filter(item => item.type === historyFilter.value)
})

async function fetchHistory() {
  historyLoading.value = true
  historyError.value = null
  try {
    const typeParam = historyFilter.value === 'all' ? null : historyFilter.value
    const data = await api.getHistory({ type: typeParam, limit: HISTORY_LIMIT, offset: HISTORY_OFFSET })
    searchHistory.value = data?.items || []
  } catch (err) {
    console.error('Error cargando historial:', err)
    historyError.value = err.response?.data?.detail || 'Error al cargar el historial'
    searchHistory.value = []
  } finally {
    historyLoading.value = false
  }
}

const viewHistoryItem = async (item) => {
  selectedType.value = item.type;
  searchQuery.value = item.query;
  searchResults.value = null;
  searchError.value = null;

  // abre el modal (selectedType ya lo abre) y re-lanza búsqueda
  await performSearch({ skipUiHistory: true });
};

const repeatSearch = async (item) => {
  // en la práctica igual que viewHistoryItem
  await viewHistoryItem(item);
};

const deleteHistoryItem = async (rid) => {
  await api.deleteHistoryItem(rid)
  await fetchHistory()
}

const clearHistory = async () => {
  const typeParam = historyFilter.value === 'all' ? null : historyFilter.value
  await api.clearHistory(typeParam)
  await fetchHistory()
}

/*
**************************************************************************
****************************** HISTORY ***********************************
**************************************************************************
*/

/*
**************************************************************************
****************************** WATCHERS ***********************************
**************************************************************************
*/

watch(theme, (newTheme) => {
  applyTheme(newTheme)
  localStorage.setItem('hakken_theme', newTheme)
})

watch(() => currentView.value, async (newView) => {
  if (newView === 'history') {
    await fetchHistory()
  }
})

watch(() => historyFilter.value, async () => {
  if (currentView.value === 'history') {
    await fetchHistory()
  }
})

/*
**************************************************************************
****************************** WATCHERS ***********************************
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
  showPersonContext.value = false;
  personContext.value = "";
}

const closeModal = () => {
  selectedType.value = null
  searchQuery.value = ''
  searchResults.value = null
  usernameFilter.value = "";
  reportMsg.value = "";
  reportErr.value = "";
  reportComment.value = "";
  reportCategory.value = "spam";
  showPersonContext.value = false;
  personContext.value = "";
}

const getTypeLabel = (type) => {
  const labels = {
    person: 'Nombre y apellidos',
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
    person: 'Ej. John Doe',
    username: 'Ej: john_doe, @usuario',
    email: 'Ej: usuario@ejemplo.com',
    phone: 'Ej: +34 600 000 000 o 600000000',
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

const performSearch = async (opts = {}) => {
  
  const { skipUiHistory = false } = opts;

  if (!searchQuery.value.trim()) return
  
  isSearching.value = true
  searchError.value = null
  
  try {
    startProgress();
    let results = null
    
    switch(selectedType.value) {
      case 'person':  
        searchResults.value = await api.searchPerson(searchQuery.value, showPersonContext.value ? personContext.value : "");
        break;

      case 'username':  
        results = await api.searchUsername(searchQuery.value)
        searchResults.value = formatUsernameResults(results)
        break
        
      case 'ip':
        results = await api.searchIP(searchQuery.value)
        searchResults.value = results
        break
        
      case 'domain':
        results = await api.searchDomain(searchQuery.value)
        searchResults.value = results
        break
        
      case 'email':
        break
      case 'phone':
        results = await api.searchPhone(searchQuery.value, 'ES')
        searchResults.value = results
        reportMsg.value = "";
        reportErr.value = "";
        reportComment.value = "";
        reportCategory.value = "spam";
        break
        
      default:
        searchResults.value = generateMockResults(selectedType.value, searchQuery.value)
    }

    if (!skipUiHistory && currentView.value === 'history') {
      // el insert es background en backend, espera un pelín
      await new Promise(r => setTimeout(r, 250))
      await fetchHistory()
    }

    finishProgress();
    
  } catch (error) {
    failProgress();
    console.error('Error en la búsqueda:', error)
    searchError.value = error.response?.data?.detail || 'Error al realizar la búsqueda'
    searchResults.value = null
  } finally {
    isSearching.value = false
  }
}

// Función para formatear resultados de Username (multi-fuente)
const formatUsernameResults = (data) => {
  const rawList = data?.results || data?.socialMedia || []

  const normalized = rawList
    .map((r) => {
      const platform = r.platform || r.name || 'Desconocido'
      const url = r.url || r.profile_url || ''
      const status = r.status || (r.found === true ? 'found' : (r.found === false ? 'not_found' : 'unknown'))
      const confidence = typeof r.confidence === 'number' ? r.confidence : (status === 'found' ? 0.95 : status === 'unknown' ? 0.55 : 0.1)
      const indicator = r.indicator || (status === 'found' ? '✅' : status === 'unknown' ? '⚠️' : status === 'not_found' ? '❌' : '❓')

      return { platform, url, status, confidence, indicator }
    })
    // Por defecto ocultamos not_found para no llenar la UI
    //.filter((r) => r.status !== 'not_found' && r.url)

  const rank = (s) => (s === 'found' ? 0 : s === 'unknown' ? 1 : 2)
  normalized.sort((a, b) => {
    const ra = rank(a.status)
    const rb = rank(b.status)
    if (ra !== rb) return ra - rb
    return (b.confidence || 0) - (a.confidence || 0)
  })

  return {
    query: data?.query || searchQuery.value,
    type: 'username',
    timestamp: data?.timestamp || new Date().toISOString(),
    results: normalized
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

const getIndicatorTooltip = (item) => {
  // Prioriza status si lo tienes, y si no, cae al indicador
  const status = item?.status
  const ind = item?.indicator

  if (status === 'found' || ind === '✅') return 'Confirmado: evidencia sólida de que el username existe en esta plataforma.'
  if (ind === '⚠️') return 'Posible coincidencia: la URL responde, pero la evidencia es débil (podría ser genérica).'
  if (ind === '❓') return 'No concluyente: la plataforma limita el acceso desde el servidor (bloqueo/anti-bot/login). Abre el enlace para comprobarlo desde tu navegador.'
  if (ind === '❌') return 'No encontrado: evidencias claras de que el username no existe en esta plataforma.'
  if (status === 'not_found' || ind === '❌') return 'No encontrado: evidencias claras de que el username no existe aquí.'
  return 'Resultado sin clasificar.'
}

const formatLineType = (t) => {
  const map = {
    MOBILE: 'Móvil',
    FIXED: 'Fijo',
    FIXED_OR_MOBILE: 'Fijo o móvil',
    VOIP: 'VoIP',
    TOLL_FREE: 'Gratuito (800/900)',
    PREMIUM_RATE: 'Tarificación especial',
    SHARED_COST: 'Coste compartido',
    UNKNOWN: 'Desconocido'
  }
  return map[t] || (t || '—')
}

const openExternal = (url) => {
  window.open(url, '_blank', 'noopener,noreferrer')
}

// Floating tooltip state (avoids overflow clipping by using position: fixed)
const tooltip = reactive({ show: false, x: 0, y: 0, text: '' })

const showTooltip = (evt, item) => {
  tooltip.text = getIndicatorTooltip(item)

  const rect = evt?.currentTarget?.getBoundingClientRect?.()
  if (!rect) {
    tooltip.show = false
    return
  }

  const pad = 12
  const maxW = 320

  // default: to the right of the indicator
  let x = rect.right + pad
  let y = rect.top - 6

  // clamp horizontally
  if (x + maxW + 12 > window.innerWidth) {
    x = rect.left - pad - maxW
  }
  x = Math.max(12, Math.min(x, window.innerWidth - maxW - 12))

  // clamp vertically
  if (y < 12) y = rect.bottom + pad
  y = Math.max(12, Math.min(y, window.innerHeight - 80))

  tooltip.x = x
  tooltip.y = y
  tooltip.show = true
}

const hideTooltip = () => {
  tooltip.show = false
}

const _hideTooltipOnWindowEvent = () => hideTooltip()

function getPhoneEvidenceCards(raw, normalized) {
  const digits = String(raw || "").replace(/\D/g, "");
  const e164 = normalized?.e164 || "";
  const e164NoPlus = e164.replace("+", "");
  const nationalDigits = (normalized?.national || "").replace(/\D/g, "") || digits;

  const q = digits || e164NoPlus;
  const qSpam = `"${q}" (spam OR denunciado OR estafa OR fraude OR "cuidado con")`;

  const cards = [
    { title: "Google", badge: "Buscar", subtitle: "Búsqueda general del número", url: `https://www.google.com/search?q=${encodeURIComponent(q)}` },
    { title: "Google (spam/denuncias)", badge: "Buscar", subtitle: "Busca menciones de spam, denuncias o estafas", url: `https://www.google.com/search?q=${encodeURIComponent(qSpam)}` },
    { title: "DuckDuckGo", badge: "Buscar", subtitle: "Búsqueda alternativa (puede mostrar otras fuentes)", url: `https://duckduckgo.com/?q=${encodeURIComponent(q)}` },

    { title: "ListaSpam", badge: "Reportes", subtitle: "Denuncias y reportes de usuarios (España)", url: `https://www.listaspam.com/busca.php?Telefono=${encodeURIComponent(nationalDigits)}` },
    { title: "Tellows", badge: "Reportes", subtitle: "Valoraciones y comentarios sobre el número", url: `https://www.tellows.es/num/${encodeURIComponent(nationalDigits)}` },
    { title: "CleverDialer", badge: "Reportes", subtitle: "Información y posibles reportes del número", url: `https://www.cleverdialer.es/numero/${encodeURIComponent(nationalDigits)}` },
  ];

  if (e164NoPlus) {
    cards.push(
      { title: "Truecaller", badge: "Lookup", subtitle: "Identificación del llamante (puede requerir login)", url: `https://www.truecaller.com/search/es/${encodeURIComponent(e164NoPlus)}` },
      { title: "CallFilter", badge: "Reseñas", subtitle: "Reseñas y reputación comunitaria (si existe ficha)", url: `https://callfilter.app/${encodeURIComponent(e164NoPlus)}` }
    );
  }

  return cards;
}

/*
**************************************************************************
*************************** FRONTED LOGIC ********************************
**************************************************************************
*/

/*
**************************************************************************
*************************** PERSON LOGIC *********************************
**************************************************************************
*/

const showPersonContext = ref(false);
const personContext = ref("");

/*
**************************************************************************
*************************** PERSON LOGIC *********************************
**************************************************************************
*/

/*
**************************************************************************
*************************** LOOKUP PROGRESS ******************************
**************************************************************************
*/

const isSearching_progress = ref(false);
const progress = ref(0);
let progressTimer = null;

function startProgress() {
  isSearching_progress.value = true;
  progress.value = 0;

  if (progressTimer) clearInterval(progressTimer);

  progressTimer = setInterval(() => {
    // Sube rápido al principio, luego más lento, y se queda en 90%
    const p = progress.value;
    const step = p < 60 ? 6 : p < 80 ? 3 : 1;
    progress.value = Math.min(90, p + step);
  }, 250);
}

function finishProgress() {
  if (progressTimer) {
    clearInterval(progressTimer);
    progressTimer = null;
  }
  progress.value = 100;

  // deja que se vea el 100% un momento y ocultamos
  setTimeout(() => {
    isSearching_progress.value = false;
  }, 250);
}

function failProgress() {
  if (progressTimer) {
    clearInterval(progressTimer);
    progressTimer = null;
  }
  isSearching_progress.value = false;
  progress.value = 0;
}

/*
**************************************************************************
*************************** LOOKUP PROGRESS ******************************
**************************************************************************
*/

/*
**************************************************************************
*************************** REPORT PHONE NUMBERS *************************
**************************************************************************
*/

const reportCategory = ref("spam");
const reportComment = ref("");
const isReporting = ref(false);
const reportMsg = ref("");
const reportErr = ref("");

async function submitPhoneReport() {
  try {
    reportMsg.value = "";
    reportErr.value = "";
    isReporting.value = true;

    const phoneToReport = searchQuery.value; // o searchResults.normalized.national si prefieres
    const res = await api.reportPhone(phoneToReport, reportCategory.value, reportComment.value || null);

    reportMsg.value = "¡Gracias! Tu reporte se ha guardado.";
    // si el backend devuelve community_reports, actualizamos la UI al momento:
    if (res?.community_reports && searchResults.value) {
      searchResults.value.community_reports = res.community_reports;
    }
  } catch (e) {
    reportErr.value = e?.response?.data?.detail || "No se pudo guardar el reporte.";
  } finally {
    isReporting.value = false;
  }
}

function phoneReputationLabel(total) {
  const n = Number(total || 0);
  if (n >= 2) return "MALICIOSO";
  if (n >= 1) return "SOSPECHOSO";
  return "VÁLIDO";
}

function phoneReputationClass(total) {
  const n = Number(total || 0);
  if (n >= 2) return "pill bad";      // rojo
  if (n >= 1) return "pill warn";     // amarillo/naranja
  return "pill ok";                   // verde
}

/*
**************************************************************************
*************************** REPORT PHONE NUMEBRS *************************
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

/*
**************************************************************************
*************************** DOMAIN LOGIC *********************************
**************************************************************************
*/

const ctFilter = ref("");

function domainPill(ok) {
  return ok ? "pill ok" : "pill warn";
}

function fmtMaybe(v, fallback = "—") {
  return v === null || v === undefined || v === "" ? fallback : String(v);
}

function fmtDateLoose(s) {
  if (!s) return "—";
  const d = new Date(s);
  if (!isNaN(d.getTime())) return d.toLocaleString();
  // formatos tipo "Apr 27 08:36:37 2026 GMT" suelen parsear, pero por si acaso:
  return String(s);
}

const ctItemsFiltered = computed(() => {
  const items = searchResults.value?.ct_subdomains?.items || [];
  const q = ctFilter.value.trim().toLowerCase();
  if (!q) return items;
  return items.filter((x) => String(x).toLowerCase().includes(q));
});

const tlsSanPreview = computed(() => {
  const san = searchResults.value?.tls?.san || [];
  return san.slice(0, 15);
});

/*
**************************************************************************
*************************** DOMAIN LOGIC *********************************
**************************************************************************
*/

/*
**************************************************************************
*************************** IP LOGIC *********************************
**************************************************************************
*/

function ipFlagClass(v) {
  return v ? "pill warn" : "pill ok";
}

function ipFlagText(v) {
  return v ? "Sí" : "No";
}

function osmEmbedUrl(lat, lon) {
  const z = 10; // zoom (8–12 suele ir bien)
  const delta = 0.12; // tamaño del bbox
  const left = lon - delta;
  const right = lon + delta;
  const top = lat + delta;
  const bottom = lat - delta;

  return `https://www.openstreetmap.org/export/embed.html?bbox=${left}%2C${bottom}%2C${right}%2C${top}&layer=mapnik&marker=${lat}%2C${lon}`;
}

/*
**************************************************************************
*************************** IP LOGIC *********************************
**************************************************************************
*/

/*
**************************************************************************
*************************** FILTER USERNAME ******************************
**************************************************************************
*/

const usernameFilter = ref("");

const filteredUsernameResults = computed(() => {
  const all = searchResults.value?.results || [];   // <-- ajusta si tu array se llama distinto
  const q = usernameFilter.value.trim().toLowerCase();
  if (!q) return all;

  return all.filter((r) => {
    const platform = (r.platform || "").toLowerCase();
    const url = (r.url || "").toLowerCase();
    const status = (r.status || "").toLowerCase(); // por si quieres filtrar "found/unknown/not_found"
    return platform.includes(q) || url.includes(q) || status.includes(q);
  });
});

/*
**************************************************************************
*************************** FILTER USERNAME ******************************
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

.modal-content {
  background: var(--bg-secondary);
  border: 2px solid #00ff99;
  border-radius: 12px;
  padding: 2.5rem;
  max-width: 1000px;
  width: 100%;
  max-height: 85vh;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
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

.modal-body {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
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
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.results-title {
  color: #00ff99;
  font-size: 1.3rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.results-content {
  color: #b0b0b0;
  font-size: 0.95rem;

  flex: 1;
  min-height: 0;

  display: flex;
  flex-direction: column;

  overflow: hidden;
}

.results-content pre {
  flex: 1;
  min-height: 0;
  overflow-y: auto;

  white-space: pre-wrap;
  word-wrap: break-word;
}

/* Username results (listado) */
.username-results {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 6px;
}

.username-result {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  align-items: center;
  padding: 0.6rem 0.8rem;
  background: rgba(0, 255, 153, 0.04);
  border: 1px solid rgba(0, 255, 153, 0.15);
  border-radius: 8px;
}

.status-not_found { opacity: 0.55; }

.username-indicator {
  font-size: 1.1rem;
}

.username-platform {
  color: #00ff99;
  font-family: "Rajdhani", sans-serif;
  font-weight: 700;
}

.username-link {
  color: #b0b0b0;
  text-decoration: underline;
  overflow-wrap: anywhere;
}

.username-link:hover {
  color: #00ff99;
}

/* Floating tooltip (fixed, avoids overflow clipping) */
.floating-tooltip {
  position: fixed;
  z-index: 999999;
  max-width: 320px;
  background: rgba(0, 0, 0, 0.92);
  border: 1px solid rgba(0, 255, 153, 0.7);
  box-shadow: 0 0 14px rgba(0, 255, 153, 0.18);
  color: #eafff6;
  padding: 8px 10px;
  border-radius: 10px;
  font-size: 12px;
  line-height: 1.25;
  pointer-events: none;
}


.username-legend {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
  margin: 10px 0 14px 0;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(0, 255, 153, 0.25);
  box-shadow: 0 0 12px rgba(0, 255, 153, 0.10);
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(0, 255, 153, 0.18);
}

.legend-icon {
  font-size: 14px;
  line-height: 1;
}

.legend-text {
  font-size: 12px;
  opacity: 0.95;
}

.empty-results {
  padding: 0.75rem;
  border: 1px dashed rgba(0, 255, 153, 0.25);
  border-radius: 8px;
  color: #b0b0b0;
  font-family: "Rajdhani", sans-serif;
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

.auth-box{
  display:flex;
  align-items:center;
  gap:12px;
  padding:8px 12px;
  border-radius:10px;
  background: rgba(0,0,0,.45);
  border: 1px solid rgba(0,255,153,.25);
  box-shadow: 0 0 18px rgba(0,255,153,.12), inset 0 0 16px rgba(0,255,153,.04);
  backdrop-filter: blur(6px);
  height: 63px;
}

.auth-text{
  margin:0;
  display:flex;
  align-items:baseline;
  gap:8px;
  line-height:1;
}

.auth-label{
  color: rgba(255,255,255,.75);
  font-weight:500;
  letter-spacing:.5px;
}

.auth-email{
  color:#00ff99;
  font-weight:700;
  letter-spacing:.6px;
  text-shadow: 0 0 10px rgba(0,255,153,.35), 0 0 22px rgba(0,255,153,.18);
  max-width: 280px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.auth-logout{
  padding:8px 14px;
  border-radius:8px;
  border:1px solid rgba(0,255,153,.9);
  background: rgba(0,0,0,.35);
  color:#00ff99;
  font-weight:700;
  letter-spacing:.6px;
  cursor:pointer;
  transition: transform .15s ease, box-shadow .2s ease, background-color .2s ease, color .2s ease;
  box-shadow: 0 0 14px rgba(0,255,153,.22), inset 0 0 18px rgba(0,255,153,.05);
}

.auth-logout:hover{
  background: rgba(0,255,153,.95);
  color:#000;
  box-shadow: 0 0 22px rgba(0,255,153,.55), 0 0 48px rgba(0,255,153,.25);
  transform: translateY(-1px);
}

.auth-logout:active{ transform: translateY(0); }

.auth-logout:focus-visible{
  outline:none;
  box-shadow: 0 0 0 3px rgba(0,255,153,.25), 0 0 26px rgba(0,255,153,.35);
}

/* PHONE CASE CSS */
.phone-scroll {
  max-height: 46vh;
  overflow-y: auto;
  padding-right: 6px;
  min-height: 0;
}

.phone-scroll::-webkit-scrollbar {
  width: 8px;
}
.phone-scroll::-webkit-scrollbar-thumb {
  background: rgba(0, 255, 153, 0.35);
  border-radius: 8px;
}

.phone-cards{
  display:grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap:12px;
  margin-top:10px;
}

@media (max-width: 900px){
  .phone-cards{ grid-template-columns: 1fr; }
}

.phone-card{
  border:1px solid rgba(0,255,153,.25);
  background: rgba(0,0,0,.35);
  border-radius: 14px;
  padding: 12px 14px;
  box-shadow: 0 0 18px rgba(0,255,153,.08);
}

.phone-card-title{
  color:#00ff99;
  font-weight:700;
  letter-spacing:.3px;
  margin-bottom:6px;
  opacity:.95;
}

.phone-card-main{
  color:#e8fff6;
  font-size: 1.05rem;
  display:flex;
  gap:10px;
  align-items:center;
  flex-wrap:wrap;
}

.phone-card-sub{
  margin-top:6px;
  color: rgba(232,255,246,.75);
  font-size: .9rem;
}

.pill{
  display:inline-block;
  padding:4px 10px;
  border-radius:999px;
  font-weight:700;
  font-size:.85rem;
  border:1px solid rgba(0,255,153,.25);
  background: rgba(0,255,153,.08);
}

.pill.warn{ border-color: rgba(255,190,0,.35); background: rgba(255,190,0,.10); color:#ffe7a0; }
.pill.bad{ border-color: rgba(255,60,60,.35); background: rgba(255,60,60,.10); color:#ffb2b2; }

.phone-checks{
  margin-top: 12px;
  border: 1px solid rgba(0,255,153,.18);
  border-radius: 12px;
  padding: 10px 12px;
  background: rgba(0,0,0,.20);
}
.phone-checks-title{
  color:#00ff99;
  font-weight:800;
  margin: 0 0 6px;
}
.phone-checks-hint{
  opacity: .8;
  margin: 0 0 10px;
}
.phone-checks-grid{
  display:flex;
  flex-wrap:wrap;
  gap:8px;
}
.phone-check-btn{
  border: 1px solid rgba(0, 255, 153, 0.35);
  background: rgba(0, 255, 153, 0.08);
  color: #00ff99;
  padding: 8px 12px;
  border-radius: 10px;
  cursor: pointer;
  font-family: 'Rajdhani', sans-serif;
  font-weight: 700;
}
.phone-check-btn:hover{
  background: rgba(0, 255, 153, 0.14);
}

.advanced{
  margin-top: 12px;
  border: 1px solid rgba(0,255,153,.18);
  border-radius: 12px;
  padding: 10px 12px;
  background: rgba(0,0,0,.18);
}

.advanced summary{
  cursor:pointer;
  color:#00ff99;
  font-weight:800;
}

.advanced-json{
  margin-top:10px;
  max-height: 220px;
  overflow:auto;
  background: rgba(0,0,0,.45);
  border:1px solid rgba(0,255,153,.15);
  border-radius: 10px;
  padding: 10px;
  color: rgba(232,255,246,.85);
}

/* PHONE EVIDENCE CSS */
.phone-evidence{
  margin-top: 14px;
  border: 1px solid rgba(0,255,153,.18);
  background: rgba(0,0,0,.22);
  border-radius: 14px;
  padding: 14px;
}

.phone-evidence-title{
  color:#00ff99;
  font-weight:800;
  letter-spacing:.2px;
  font-size: 1.05rem;
}

.phone-evidence-subtitle{
  margin-top: 6px;
  opacity: .8;
  font-size: .92rem;
}

.phone-evidence-grid{
  margin-top: 12px;
  display:grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

@media (max-width: 900px){
  .phone-evidence-grid{ grid-template-columns: 1fr; }
}

.phone-evidence-card{
  border:1px solid rgba(0,255,153,.16);
  background: rgba(0,0,0,.35);
  border-radius: 14px;
  padding: 12px;
  box-shadow: 0 0 18px rgba(0,255,153,.06);
}

.phone-evidence-card-top{
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 10px;
}

.phone-evidence-card-name{
  color:#e8fff6;
  font-weight:800;
}

.phone-evidence-badge{
  border:1px solid rgba(0,255,153,.25);
  background: rgba(0,255,153,.10);
  color:#00ff99;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: .82rem;
  font-weight: 800;
}

.phone-evidence-card-desc{
  margin-top: 8px;
  color: rgba(232,255,246,.78);
  font-size: .92rem;
  line-height: 1.25rem;
}

.phone-evidence-btn{
  margin-top: 12px;
  width: 100%;
  border: 1px solid rgba(0,255,153,.30);
  background: rgba(0,255,153,.08);
  color: #00ff99;
  padding: 10px 12px;
  border-radius: 12px;
  font-weight: 800;
  cursor: pointer;
}

.phone-evidence-btn:hover{
  background: rgba(0,255,153,.14);
}

/* PROGRESS CSS */
.progress-wrap{
  margin-top: 12px;
}

.progress-top{
  display:flex;
  justify-content: space-between;
  align-items:center;
  color: rgba(232,255,246,.85);
  font-size: .9rem;
  margin-bottom: 6px;
}

.progress-bar{
  height: 10px;
  border-radius: 999px;
  border: 1px solid rgba(0,255,153,.28);
  background: rgba(0,0,0,.35);
  overflow: hidden;
}

.progress-fill{
  height: 100%;
  width: 0%;
  background: rgba(0,255,153,.55);
  box-shadow: 0 0 14px rgba(0,255,153,.35);
  transition: width 200ms ease;
}

button:disabled{ opacity:.6; cursor:not-allowed; }

/* filter css */

.username-filter{
  display:flex;
  align-items:center;
  gap:10px;
  margin: 10px 0 12px;
}

.username-filter-input{
  flex: 1;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(0,255,153,.25);
  background: rgba(0,0,0,.35);
  color: rgba(232,255,246,.95);
  outline: none;
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.username-filter-input::placeholder{
  color: rgba(232,255,246,.55);
}

.username-filter-count{
  font-size: .9rem;
  color: rgba(232,255,246,.75);
  border: 1px solid rgba(0,255,153,.18);
  background: rgba(0,0,0,.25);
  padding: 8px 10px;
  border-radius: 10px;
  white-space: nowrap;
}

/* REPORTS */
.phone-report-box, .community-box{
  margin-top: 14px;
  border: 1px solid rgba(0,255,153,.18);
  background: rgba(0,0,0,.22);
  border-radius: 14px;
  padding: 14px;
}

.phone-report-title, .community-title{
  color:#00ff99;
  font-weight:800;
}

.phone-report-sub{
  margin-top:6px;
  opacity:.8;
  font-size:.92rem;
}

.pr-label{ display:block; margin-top:10px; opacity:.85; }
.pr-select, .pr-textarea{
  width:100%;
  margin-top:6px;
  border-radius: 10px;
  border: 1px solid rgba(0,255,153,.18);
  background: rgba(0,0,0,.35);
  color: rgba(232,255,246,.95);
  padding: 10px 12px;
  outline:none;
}
.pr-textarea{ min-height: 80px; resize: vertical; }

.pr-btn{
  margin-top: 12px;
  width: 100%;
  border: 1px solid rgba(0,255,153,.30);
  background: rgba(0,255,153,.08);
  color: #00ff99;
  padding: 10px 12px;
  border-radius: 12px;
  font-weight: 800;
  cursor: pointer;
}
.pr-btn:disabled{ opacity:.6; cursor:not-allowed; }

.pr-ok{ margin-top:10px; color:#00ff99; opacity:.9; }
.pr-err{ margin-top:10px; color:#ff8a8a; opacity:.9; }

.community-stats{ display:flex; flex-wrap:wrap; gap:8px; margin-top:10px; }
.cs-pill{
  border:1px solid rgba(0,255,153,.18);
  background: rgba(0,0,0,.25);
  padding: 6px 10px;
  border-radius: 999px;
  font-size: .9rem;
}

.community-latest{ margin-top:10px; }
.community-latest summary{ cursor:pointer; color:#00ff99; font-weight:800; }

.community-item{
  margin-top:10px;
  padding:10px;
  border-radius: 12px;
  border: 1px solid rgba(0,255,153,.12);
  background: rgba(0,0,0,.30);
}
.ci-top{ display:flex; justify-content:space-between; gap:10px; opacity:.85; }
.ci-cat{ color:#00ff99; font-weight:800; text-transform: uppercase; font-size:.85rem; }
.ci-date{ font-size:.85rem; opacity:.8; }
.ci-comment{ margin-top:6px; opacity:.9; }

/* DOMAIN CSS */
.domain-scroll{
  max-height: 52vh;
  overflow-y: auto;
  padding-right: 6px;
}

.domain-cards{
  display:grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap:12px;
  margin-top:10px;
}

@media (max-width: 900px){
  .domain-cards{ grid-template-columns: 1fr; }
}

.domain-card{
  border:1px solid rgba(0,255,153,.18);
  background: rgba(0,0,0,.28);
  border-radius: 14px;
  padding: 12px 14px;
  box-shadow: 0 0 18px rgba(0,255,153,.06);
}

.domain-card-title{
  color:#00ff99;
  font-weight:800;
  margin-bottom:6px;
}

.domain-card-main{
  color:#e8fff6;
  font-size: 1.05rem;
  display:flex;
  gap:10px;
  flex-wrap:wrap;
  align-items:center;
}

.domain-card-sub{
  margin-top:6px;
  color: rgba(232,255,246,.75);
  font-size: .9rem;
}

.domain-section{
  margin-top: 14px;
  border: 1px solid rgba(0,255,153,.18);
  background: rgba(0,0,0,.22);
  border-radius: 14px;
  padding: 14px;
}

.domain-section-title{
  color:#00ff99;
  font-weight:800;
  margin-bottom: 10px;
}

.dns-block{
  border:1px solid rgba(0,255,153,.12);
  background: rgba(0,0,0,.25);
  border-radius: 12px;
  padding: 10px 12px;
  margin-bottom: 10px;
}

.dns-type{
  font-weight:900;
  color:#00ff99;
  margin-bottom: 6px;
}

.dns-values{
  display:flex;
  flex-direction:column;
  gap:6px;
}

.dns-value{
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: .92rem;
  color: rgba(232,255,246,.9);
}

.domain-muted{
  opacity:.75;
}

.kv-grid{
  display:grid;
  grid-template-columns: repeat(4, minmax(0,1fr));
  gap:10px;
  margin-top:10px;
}
@media (max-width: 900px){
  .kv-grid{ grid-template-columns: repeat(2, minmax(0,1fr)); }
}
.kv{
  border:1px solid rgba(0,255,153,.12);
  background: rgba(0,0,0,.25);
  border-radius: 12px;
  padding: 10px 12px;
}
.kv-k{ color:#00ff99; font-weight:900; font-size:.85rem; }
.kv-v{ margin-top:4px; color: rgba(232,255,246,.9); font-size:1rem; }

.table{
  width:100%;
  border:1px solid rgba(0,255,153,.12);
  border-radius: 12px;
  overflow:hidden;
  margin-top:10px;
  overflow-x: scroll;
}
.tr{
  display:grid;
  grid-template-columns: 1.2fr 2.4fr .8fr 1.2fr;
  gap:10px;
  padding:10px 12px;
  border-bottom:1px solid rgba(0,255,153,.08);
  background: rgba(0,0,0,.22);
}
.tr.head{
  background: rgba(0,0,0,.35);
  color:#00ff99;
  font-weight:900;
}
.tr:last-child{ border-bottom:none; }
.mono{
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

.snippet{
  margin-top:8px;
  padding:10px 12px;
  border-radius: 12px;
  border:1px solid rgba(0,255,153,.12);
  background: rgba(0,0,0,.35);
  color: rgba(232,255,246,.9);
  overflow:auto;
  max-height: 180px;
}

.domain-filter{
  display:flex;
  gap:10px;
  align-items:center;
  margin-top:10px;
}
.domain-filter-input{
  flex:1;
  padding:10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(0,255,153,.18);
  background: rgba(0,0,0,.35);
  color: rgba(232,255,246,.95);
  outline:none;
}
.domain-filter-count{
  border:1px solid rgba(0,255,153,.18);
  background: rgba(0,0,0,.25);
  padding: 8px 10px;
  border-radius: 10px;
  color: rgba(232,255,246,.85);
}

.subdomain-list{
  margin-top:10px;
  border:1px solid rgba(0,255,153,.12);
  background: rgba(0,0,0,.22);
  border-radius: 12px;
  padding: 10px;
  max-height: 220px;
  overflow:auto;
}
.subdomain-item{
  padding: 6px 8px;
  border-radius: 10px;
  border:1px solid rgba(0,255,153,.06);
  background: rgba(0,0,0,.20);
  margin-bottom:8px;
}
.subdomain-item:last-child{ margin-bottom:0; }

.sec-badges{
  display:flex;
  flex-wrap:wrap;
  gap:8px;
  margin-top:10px;
}

.sec-badge{
  border: 1px solid rgba(0,255,153,.18);
  background: rgba(0,0,0,.25);
  padding: 6px 10px;
  border-radius: 999px;
  font-size: .85rem;
  font-weight: 900;
  letter-spacing: .2px;
  user-select:none;
}

.sec-badge.ok{
  color:#00ff99;
  border-color: rgba(0,255,153,.28);
  background: rgba(0,255,153,.08);
}

.sec-badge.warn{
  color:#ffd36a;
  border-color: rgba(255, 211, 106, .25);
  background: rgba(255, 211, 106, .08);
}

/* IP CSS */
.ip-scroll{
  max-height: 52vh;
  overflow-y: auto;
  padding-right: 6px;
}

.ip-cards{
  display:grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap:12px;
  margin-top:10px;
}
@media (max-width: 900px){
  .ip-cards{ grid-template-columns: 1fr; }
}

.ip-card{
  border:1px solid rgba(0,255,153,.18);
  background: rgba(0,0,0,.28);
  border-radius: 14px;
  padding: 12px 14px;
  box-shadow: 0 0 18px rgba(0,255,153,.06);
}
.ip-card-title{
  color:#00ff99;
  font-weight:800;
  margin-bottom:6px;
}
.ip-card-main{
  color:#e8fff6;
  font-size: 1.05rem;
  display:flex;
  gap:10px;
  flex-wrap:wrap;
  align-items:center;
}
.ip-card-sub{
  margin-top:6px;
  color: rgba(232,255,246,.75);
  font-size: .9rem;
}

.ip-section{
  margin-top: 14px;
  border: 1px solid rgba(0,255,153,.18);
  background: rgba(0,0,0,.22);
  border-radius: 14px;
  padding: 14px;
}
.ip-section-title{
  color:#00ff99;
  font-weight:800;
  margin-bottom: 10px;
}
.ip-muted{ opacity:.75; }

.ip-links-grid{
  display:flex;
  flex-wrap:wrap;
  gap:10px;
  margin-top: 10px;
}
.ip-link-btn{
  border: 1px solid rgba(0,255,153,.30);
  background: rgba(0,255,153,.08);
  color: #00ff99;
  padding: 10px 12px;
  border-radius: 12px;
  font-weight: 800;
  cursor: pointer;
}
.ip-link-btn:hover{ background: rgba(0,255,153,.14); }

.mono{
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

.map-wrap{
  border:1px solid rgba(0,255,153,.18);
  background: rgba(0,0,0,.22);
  border-radius: 14px;
  overflow:hidden;
  height: 260px;
}

.map-iframe{
  width:100%;
  height:100%;
  border:0;
}
</style>