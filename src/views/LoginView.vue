<script setup lang="ts">
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const showPassword = ref(false)
const passwordInputType = ref<'password' | 'text'>('password')
const router = useRouter()

// Custom Modal State
const showModal = ref(false)
const modalMessage = ref('')

// Progressive Rate Limiting Logic
const attempts = ref(0)
const cooldownSeconds = ref(0)
const isPermanentlyLocked = ref(false)
let cooldownTimer: number | null = null

// Escala Ajustada: 
// Fallos 1-3: 0s
// Fallo 4: 30s
// Fallo 5: 60s (1m)
// Fallo 6: 180s (3m) + Bloqueo
function startCooldown() {
  let waitTime = 0
  if (attempts.value === 4) waitTime = 30
  else if (attempts.value === 5) waitTime = 60
  else if (attempts.value >= 6) waitTime = 180

  if (waitTime === 0) return

  cooldownSeconds.value = waitTime
  
  if (cooldownTimer) clearInterval(cooldownTimer)
  
  cooldownTimer = window.setInterval(() => {
    cooldownSeconds.value--
    if (cooldownSeconds.value <= 0) {
      if (cooldownTimer) clearInterval(cooldownTimer)
    }
  }, 1000)
}

function openModal(msg: string) {
  modalMessage.value = msg
  showModal.value = true
}

function togglePasswordVisibility() {
  passwordInputType.value = 'text'
  showPassword.value = true
  
  setTimeout(() => {
    passwordInputType.value = 'password'
    showPassword.value = false
  }, 5000)
}

async function handleLogin() {
  // Manual Validation
  if (!email.value) {
    openModal('Por favor, introduce tu email corporativo.')
    return
  }
  if (!password.value) {
    openModal('La contraseña es obligatoria para acceder.')
    return
  }

  if (isPermanentlyLocked.value || cooldownSeconds.value > 0) return

  isLoading.value = true
  errorMessage.value = ''
  
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })

  if (error) {
    attempts.value++
    
    if (attempts.value >= 6) {
      isPermanentlyLocked.value = true
      errorMessage.value = 'Cuenta bloqueada por seguridad.'
    } else {
      errorMessage.value = error.message === 'Invalid login credentials' 
        ? 'Credenciales incorrectas.' 
        : error.message
      startCooldown()
    }
  } else {
    attempts.value = 0
    router.push('/')
  }
  isLoading.value = false
}
</script>

<template>
  <div class="login-view">
    <div class="login-card" :class="{ 'shake': errorMessage && !isLoading }">
      <h2 @click="router.push('/')" style="cursor: help">Bienvenido</h2>
      <p>Ingresa a StockMgr</p>

      <form @submit.prevent="handleLogin" class="login-form" novalidate>
        <div class="form-group">
          <label>EMAIL</label>
          <input 
            v-model="email" 
            type="email" 
            placeholder="admin@stockmgr.com"
          >
        </div>
        
        <div class="form-group">
          <div class="label-row">
            <label>CONTRASEÑA</label>
            <router-link to="/soporte" class="forgot-link">¿Olvidaste tu contraseña?</router-link>
          </div>
          <div class="password-wrapper">
            <input 
              v-model="password" 
              :type="passwordInputType" 
              placeholder="••••••••"
            >
            <button 
              type="button" 
              class="eye-btn" 
              @click="togglePasswordVisibility"
            >
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
            </button>
          </div>
        </div>

        <div v-if="errorMessage" class="error-container">
          <p class="error-text">
            {{ errorMessage }} 
            <router-link v-if="!isPermanentlyLocked" to="/soporte" class="support-link-error">Contacta con soporte</router-link>
            <router-link v-else to="/soporte" class="support-link-error block">DESBLOQUEAR CUENTA</router-link>
          </p>
        </div>
        
        <button 
          type="submit" 
          :disabled="isLoading || cooldownSeconds > 0 || isPermanentlyLocked" 
          class="btn-login"
        >
          <template v-if="isPermanentlyLocked">BLOQUEADO</template>
          <template v-else-if="cooldownSeconds > 0">Espera {{ cooldownSeconds }}s</template>
          <template v-else>{{ isLoading ? 'Entrando...' : 'Iniciar Sesión' }}</template>
        </button>
      </form>
    </div>

    <!-- Custom Modal -->
    <Transition name="fade">
      <div v-if="showModal" class="modal-overlay" @click="showModal = false">
        <div class="modal-content" @click.stop>
          <div class="modal-icon">⚠️</div>
          <h3>Atención</h3>
          <p>{{ modalMessage }}</p>
          <button class="btn-modal" @click="showModal = false">Entendido</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.login-view {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80vh;
}
.login-card {
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: var(--radius-md);
  width: 100%;
  max-width: 350px;
  transition: transform 0.3s;
}

/* Shake Animation */
.shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}
@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}

.login-form {
  margin-top: 1.5rem;
}
.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: rgba(255,255,255,0.6);
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forgot-link {
  font-size: 0.75rem;
  color: #0dcae6;
  text-decoration: none;
}

.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-wrapper input {
  padding-right: 3rem !important;
}

.eye-btn {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  color: rgba(255,255,255,0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.eye-btn:hover {
  color: white;
}

.form-group input {
  width: 100%;
  padding: 1rem;
  border-radius: 8px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: white;
  font-size: 1rem;
}
.btn-login {
  width: 100%;
  padding: 1rem;
  background: var(--accent);
  border: none;
  border-radius: 6px;
  font-weight: 700;
  margin-top: 1rem;
  cursor: pointer;
}
.btn-login:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #333;
}

.error-container {
  margin-top: 1rem;
  padding: 0.8rem;
  background: rgba(255, 68, 68, 0.1);
  border-radius: 6px;
  border-left: 3px solid #ff4444;
}
.error-text {
  color: #ff4444;
  font-size: 0.85rem;
  line-height: 1.4;
}
.support-link-error {
  color: #fff;
  text-decoration: underline;
  font-weight: 700;
  display: inline-block;
  margin-top: 0.2rem;
}
.support-link-error.block {
  display: block;
  text-align: center;
  background: #ff4444;
  color: white;
  padding: 0.5rem;
  text-decoration: none;
  border-radius: 4px;
  margin-top: 0.5rem;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  max-width: 300px;
  border: 1px solid rgba(255,255,255,0.1);
}
.modal-icon { font-size: 2.5rem; margin-bottom: 1rem; }
.btn-modal {
  margin-top: 1.5rem;
  padding: 0.7rem 2rem;
  background: var(--accent);
  border: none;
  border-radius: 6px;
  color: black;
  font-weight: 700;
  cursor: pointer;
}

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
