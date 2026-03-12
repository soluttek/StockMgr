<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const router = useRouter()

async function handleLogin() {
  isLoading.value = true
  errorMessage.value = ''
  
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })

  if (error) {
    errorMessage.value = error.message
  } else {
    router.push('/')
  }
  isLoading.value = false
}
</script>

<template>
  <div class="login-view">
    <div class="login-card">
      <h2>Bienvenido</h2>
      <p>Ingresa a StockMgr</p>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label>Email</label>
          <input v-model="email" type="email" required placeholder="admin@soluttek.com">
        </div>
        <div class="form-group">
          <label>Contraseña</label>
          <input v-model="password" type="password" required placeholder="••••••••">
        </div>
        <p v-if="errorMessage" class="error-text">{{ errorMessage }}</p>
        <button type="submit" :disabled="isLoading" class="btn-login">
          {{ isLoading ? 'Entrando...' : 'Iniciar Sesión' }}
        </button>
      </form>
    </div>
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
  font-size: 0.9rem;
}
.form-group input {
  width: 100%;
  padding: 0.8rem;
  border-radius: 6px;
  background: var(--bg-primary);
  border: 1px solid rgba(255,255,255,0.1);
  color: white;
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
.error-text {
  color: #ff4444;
  font-size: 0.8rem;
}
</style>
