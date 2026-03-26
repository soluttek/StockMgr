<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const name = ref('')
const email = ref('')
const subject = ref('')
const message = ref('')
const isSent = ref(false)

const isMessageEnabled = computed(() => {
  return subject.value === 'Problemas Técnicos.' || subject.value === 'Otros...'
})

function handleSubmit() {
  if (!subject.value) return
  isSent.value = true
  setTimeout(() => {
    router.push('/login')
  }, 3000)
}
</script>

<template>
  <div class="support-view">
    <div class="support-card">
      <template v-if="!isSent">
        <h2>Soporte Técnico</h2>
        <p>Envía tu consulta y nos pondremos en contacto contigo.</p>
        
        <form @submit.prevent="handleSubmit" class="support-form">
          <div class="form-group">
            <label>NOMBRE COMPLETO</label>
            <input v-model="name" type="text" required placeholder="Tu nombre">
          </div>
          <div class="form-group">
            <label>EMAIL DE CONTACTO</label>
            <input v-model="email" type="email" required placeholder="tu@email.com">
          </div>
          <div class="form-group">
            <label>ASUNTO</label>
            <select v-model="subject" required class="support-select">
              <option value="" disabled>-- Selecciona una Opción --</option>
              <option>Olvidó Contraseña.</option>
              <option>Solicitud de Desbloqueo de Cuenta.</option>
              <option>Problemas Técnicos.</option>
              <option>Otros...</option>
            </select>
          </div>
          <div class="form-group">
            <label>MENSAJE ({{ message.length }}/500)</label>
            <textarea 
              v-model="message" 
              rows="4" 
              maxlength="500"
              :disabled="!isMessageEnabled"
              :placeholder="isMessageEnabled ? 'Explica tu problema...' : 'Este asunto no requiere mensaje adicional.'"
              :class="{ 'disabled-area': !isMessageEnabled }"
            ></textarea>
          </div>
          <button type="submit" class="btn-send" :disabled="!subject">Enviar Solicitud</button>
        </form>
      </template>
      
      <div v-else class="sent-message">
        <div class="success-icon">✅</div>
        <h3>Solicitud Enviada</h3>
        <p>Tu mensaje ha sido recibido. Te redirigiremos al inicio en unos segundos...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.support-view {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 90vh;
  padding: 2rem;
}
.support-card {
  background: var(--bg-secondary);
  padding: 2.5rem;
  border-radius: 12px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}
h2 { margin-bottom: 0.5rem; color: white; }
p { color: rgba(255,255,255,0.6); margin-bottom: 2rem; font-size: 0.9rem; }

.form-group { margin-bottom: 1.5rem; }
label { display: block; font-size: 0.75rem; font-weight: 700; color: rgba(255,255,255,0.5); margin-bottom: 0.5rem; }
input, select, textarea {
  width: 100%;
  padding: 0.8rem;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  color: white;
  font-family: inherit;
}
select option {
  background: #1a1f26;
  color: white;
}
.disabled-area {
  opacity: 0.5;
  cursor: not-allowed;
  background: rgba(0,0,0,0.2);
}
.btn-send {
  width: 100%;
  padding: 1rem;
  background: var(--accent);
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
}
.sent-message { text-align: center; }
.success-icon { font-size: 3rem; margin-bottom: 1rem; }
</style>
