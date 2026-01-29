<template>
  <div class="landing-container">
    <vue-particles
      id="tsparticles"
      :options="particlesOptions"
      class="particles-bg"
    />

    <div class="content">
      <div class="logo-wrapper">
        <img src="@/assets/hakken-logo-no-bg-blanco.png" alt="Hakken Logo" class="logo" />
      </div>
      <p class="tagline">
        Un nuevo enfoque para el análisis <span class="highlight">OSINT</span>
      </p>

      <!-- SOLO un botón -->
      <button class="enter-btn" @click="handleLogin">
        <span class="btn-text">Iniciar sesión</span>
        <span class="btn-icon">→</span>
      </button>
    </div>

    <div class="grid-overlay"></div>
    <div class="ambient-glow glow-1"></div>
    <div class="ambient-glow glow-2"></div>
    <div class="ambient-glow glow-3"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUser, signIn } from "@/auth/oidc"

const router = useRouter()

const handleLogin = async () => {
  const user = await getUser()
  if (user && !user.expired) {
    router.push('/dashboard')
    return
  }
  await signIn('/dashboard')
}

// Actualizar logo según tema guardado
onMounted(() => {
  const savedTheme = localStorage.getItem('hakken_theme')
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme')
    const logoElement = document.querySelector('.logo')
    if (logoElement) {
      logoElement.src = new URL('@/assets/hakken-logo-no-bg-negro.png', import.meta.url).href
    }
  }
})

const particlesOptions = ref({
  background: { color: 'transparent' },
  fullScreen: { enable: false, zIndex: 1 },
  particles: {
    number: { value: 100, density: { enable: true, area: 800 } },
    color: { value: ['#00ff99', '#00cc7a', '#00ffcc', '#00ff66'] },
    shape: { type: ['circle', 'triangle'] },
    opacity: { value: { min: 0.1, max: 0.4 }, animation: { enable: true, speed: 0.3, sync: false } },
    size: { value: { min: 0.5, max: 2.5 } },
    links: {
      enable: true,
      distance: 120,
      color: '#00ff99',
      opacity: 0.15,
      width: 0.8,
      triangles: { enable: true, opacity: 0.02 }
    },
    move: { enable: true, speed: 0.5, direction: 'none', random: true, straight: false, outModes: 'bounce' }
  },
  interactivity: {
    detectsOn: 'canvas',
    events: {
      onHover: { enable: true, mode: ['grab', 'bubble'] },
      onClick: { enable: true, mode: 'repulse' }
    },
    modes: {
      grab: { distance: 200, links: { opacity: 0.4 } },
      bubble: { distance: 200, size: 6, duration: 0.3, opacity: 0.8 },
      repulse: { distance: 150, duration: 0.4 }
    }
  },
  detectRetina: true
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap');

/*.landing-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  background: radial-gradient(ellipse at center, #0d0d0d 0%, #000000 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Rajdhani', sans-serif;
}*/

.landing-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  /*background: radial-gradient(ellipse at center, #0d0d0d 0%, #000000 100%);*/
  background: var(--bg-primary);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Rajdhani', sans-serif;
}

/* Efectos de glow ambiental */
.ambient-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.15;
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

.glow-3 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(0, 255, 204, 0.2) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: floatGlow3 30s ease-in-out infinite;
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

@keyframes floatGlow3 {
  0%, 100% {
    transform: translate(-50%, -50%);
  }
  33% {
    transform: translate(-40%, -60%);
  }
  66% {
    transform: translate(-60%, -40%);
  }
}

/* Efecto de rejilla */
.grid-overlay {
  position: absolute;
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

.particles-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
}

/* Logo sin caja - fade in grande */
.logo-wrapper {
  margin-bottom: 50px;
  animation: logoFadeIn 1.5s ease-out;
}

@keyframes logoFadeIn {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.logo {
  width: 400px;
  height: auto;
  display: block;
  margin: 0 auto;
  filter: drop-shadow(0 0 30px rgba(0, 255, 153, 0.8))
          drop-shadow(0 0 60px rgba(0, 255, 153, 0.4));
  transition: all 0.3s ease;
}

.logo:hover {
  filter: drop-shadow(0 0 40px rgba(0, 255, 153, 1))
          drop-shadow(0 0 80px rgba(0, 255, 153, 0.6));
  transform: scale(1.03);
}

.tagline {
  font-size: 1.8rem;
  font-weight: 300;
  margin: 0 0 40px 0;
  letter-spacing: 2px;
  color: #b0b0b0;
  animation: fadeInUp 1.5s ease-out 0.8s both;
  text-shadow: 0 0 10px rgba(0, 255, 153, 0.1);
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

.highlight {
  color: #00ff99;
  font-weight: 700;
  font-family: 'Orbitron', sans-serif;
  text-shadow: 
    0 0 15px rgba(0, 255, 153, 0.9),
    0 0 30px rgba(0, 255, 153, 0.6),
    0 0 45px rgba(0, 255, 153, 0.3);
  letter-spacing: 3px;
}

.enter-btn {
  position: relative;
  padding: 15px 45px;
  background: rgba(0, 0, 0, 0.5);
  color: #00ff99;
  border: 2px solid #00ff99;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 2px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.4s ease;
  animation: fadeInUp 1.5s ease-out 1.3s both;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  box-shadow: 
    0 0 15px rgba(0, 255, 153, 0.3),
    inset 0 0 20px rgba(0, 255, 153, 0.05);
}

.enter-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 153, 0.4), transparent);
  transition: left 0.5s ease;
}

.enter-btn:hover::before {
  left: 100%;
}

.enter-btn:hover {
  background-color: #00ff99;
  color: #000000;
  box-shadow: 
    0 0 25px rgba(0, 255, 153, 0.7),
    0 0 50px rgba(0, 255, 153, 0.5),
    inset 0 0 30px rgba(0, 255, 153, 0.3);
  transform: translateY(-2px);
}

.btn-text {
  position: relative;
  z-index: 1;
}

.btn-icon {
  position: relative;
  z-index: 1;
  transition: transform 0.3s ease;
  font-size: 1.3rem;
}

.enter-btn:hover .btn-icon {
  transform: translateX(5px);
}

.enter-btn:active {
  transform: translateY(0);
}

/* Responsive */
@media (max-width: 768px) {
  .logo {
    width: 280px;
  }
  
  .tagline {
    font-size: 1.3rem;
    padding: 0 20px;
  }
  
  .enter-btn {
    padding: 12px 35px;
    font-size: 1rem;
  }
  
  .ambient-glow {
    filter: blur(80px);
  }
}

/*
**************************************************************************
****************************** CUSTOM UX *********************************
**************************************************************************
*/
body.light-theme .landing-container {
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
}

body.light-theme .logo-container {
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

body.light-theme .tagline {
  color: #495057;
}

body.light-theme .enter-btn {
  background: rgba(0, 255, 153, 0.2);
  color: #00ff99;
  border-color: #00ff99;
}

body.light-theme .enter-btn:hover {
  background: #00ff99;
  color: #000;
}

body.light-theme .grid-overlay,
body.light-theme .ambient-glow {
  opacity: 0.1;
}
</style>