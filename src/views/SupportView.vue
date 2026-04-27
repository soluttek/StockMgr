<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const name = ref('')
const email = ref('')
const subject = ref('')
const message = ref('')
const isSubmitting = ref(false)
const isSent = ref(false)

// FAQ Accordion State
const activeFaqIndex = ref<number | null>(0)
const searchQuery = ref('')

const faqs = [
  {
    question: '¿Qué hago si no hay internet?',
    answer: 'Sigue escaneando normalmente. StockMgr guardará los movimientos de forma local (Offline) y se sincronizará automáticamente en cuanto recupere la conexión.'
  },
  {
    question: 'La cámara se ve negra o no enfoca',
    answer: 'Asegúrate de haber otorgado permisos de cámara en tu navegador. Si el problema persiste, limpia el lente trasero del dispositivo o reinicia la aplicación.'
  },
  {
    question: '¿Cómo recupero mi contraseña?',
    answer: 'Debes enviar una "Solicitud de Desbloqueo" a través del formulario de esta página. El administrador revisará tu identidad y reseteará tus credenciales.'
  },
  {
    question: 'Error: "Movimiento ya procesado"',
    answer: 'Este aviso aparece cuando intentas sincronizar un movimiento que el servidor ya recibió. No requiere acción adicional, el sistema evita duplicados automáticamente.'
  }
]

const filteredFaqs = computed(() => {
  if (!searchQuery.value) return faqs
  const query = searchQuery.value.toLowerCase()
  return faqs.filter(f => 
    f.question.toLowerCase().includes(query) || 
    f.answer.toLowerCase().includes(query)
  )
})

const toggleFaq = (index: number) => {
  activeFaqIndex.value = activeFaqIndex.value === index ? null : index
}

const clearSearch = () => {
  searchQuery.value = ''
}

// Watch search to auto-expand first item when cleared
watch(searchQuery, (newVal) => {
  if (!newVal) {
    activeFaqIndex.value = 0
  }
})

const isMessageEnabled = computed(() => {
  return subject.value === 'Problemas Técnicos.' || subject.value === 'Otros...'
})

async function handleSubmit() {
  if (!subject.value) return
  isSubmitting.value = true
  
  // Simulated API Call
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  isSubmitting.value = false
  isSent.value = true
  setTimeout(() => {
    router.push('/login')
  }, 4000)
}

function handleBack() {
  router.push('/login')
}
</script>

<template>
  <div class="support-view">
    <header class="app-header">
      <div class="header-title">
        <button class="btn-back" @click="handleBack">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <h1>Centro de <span class="accent">Soporte</span></h1>
      </div>
    </header>

    <div class="view-container">
      
      <!-- Quick Contact Actions -->
      <section class="quick-contact">
        <a href="tel:+1234567890" class="contact-card urgent">
          <div class="contact-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          </div>
          <div class="contact-info">
            <h3>Emergencias</h3>
            <p>Llamar al administrador</p>
          </div>
        </a>

        <a href="https://wa.me/1234567890" target="_blank" class="contact-card whatsapp">
          <div class="contact-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
          </div>
          <div class="contact-info">
            <h3>Chat Soporte</h3>
            <p>Atención vía WhatsApp</p>
          </div>
        </a>
      </section>

      <!-- Ticket Form -->
      <section class="ticket-section">
        <div class="section-header">
          <h2>Reportar Problema</h2>
          <p>Envíanos un detalle de tu problema para poder ayudarte.</p>
        </div>

        <div class="card form-container">
          <template v-if="!isSent">
            <form @submit.prevent="handleSubmit" class="ticket-form" novalidate>
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
                <select v-model="subject" required>
                  <option value="" disabled>-- Selecciona una Opción --</option>
                  <option>Olvidó Contraseña.</option>
                  <option>Solicitud de Desbloqueo de Cuenta.</option>
                  <option>Problemas Técnicos.</option>
                  <option>Otros...</option>
                </select>
              </div>

              <div class="form-group" :class="{ 'disabled-group': !isMessageEnabled }">
                <label>MENSAJE ({{ message.length }}/500)</label>
                <textarea 
                  v-model="message" 
                  rows="4" 
                  maxlength="500"
                  :disabled="!isMessageEnabled"
                  :placeholder="isMessageEnabled ? 'Explica tu problema detalladamente...' : 'Este asunto no requiere mensaje adicional.'"
                ></textarea>
              </div>

              <button type="submit" class="btn btn-primary w-full" :disabled="isSubmitting || !subject">
                <span v-if="isSubmitting" class="spinner"></span>
                <span v-else>Enviar Solicitud</span>
              </button>
            </form>
          </template>
          
          <!-- Success Message -->
          <div v-else class="sent-message">
            <div class="success-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="accent"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <h3>Solicitud Enviada</h3>
            <p>Tu mensaje ha sido recibido. Te redirigiremos al inicio en unos segundos...</p>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section class="faq-section">
        <div class="faq-header">
          <h3>Preguntas Frecuentes</h3>
          <div class="search-mini">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input v-model="searchQuery" type="text" placeholder="Buscar ayuda...">
            <button v-if="searchQuery" class="btn-clear" @click="clearSearch" aria-label="Limpiar búsqueda">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        </div>
        
        <div class="faq-list">
          <div 
            v-for="(faq, index) in filteredFaqs" 
            :key="index"
            class="faq-item-accordion"
            :class="{ 'active': activeFaqIndex === index }"
          >
            <button class="faq-question" @click="toggleFaq(index)">
              <span>{{ faq.question }}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="18" height="18" 
                viewBox="0 0 24 24" fill="none" 
                stroke="currentColor" stroke-width="2" 
                stroke-linecap="round" stroke-linejoin="round"
                class="chevron"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <div class="faq-answer">
              <div class="answer-content">
                {{ faq.answer }}
              </div>
            </div>
          </div>
          
          <div v-if="filteredFaqs.length === 0" class="no-results">
            No encontramos respuestas para "{{ searchQuery }}". Prueba con otra palabra.
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<style scoped>
.support-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.btn-back {
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -8px;
  transition: color var(--duration);
}

.btn-back:hover {
  color: var(--accent);
}

.quick-contact {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sp-3);
  margin-bottom: var(--sp-6);
}

.contact-card {
  background: var(--bg-card);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-md);
  padding: var(--sp-4);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  text-decoration: none;
  color: inherit;
  transition: transform var(--duration), border-color var(--duration);
}

.contact-card:active {
  transform: scale(0.96);
}

.contact-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--sp-3);
}

.urgent {
  border-color: rgba(239, 68, 68, 0.3);
}
.urgent .contact-icon {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.whatsapp {
  border-color: rgba(34, 197, 94, 0.3);
}
.whatsapp .contact-icon {
  background: rgba(34, 197, 94, 0.15);
  color: #22c55e;
}

.contact-info h3 {
  font-size: var(--fs-base);
  font-weight: 600;
  margin-bottom: 2px;
}

.contact-info p {
  font-size: var(--fs-xs);
  color: var(--text-muted);
}

.section-header {
  margin-bottom: var(--sp-4);
}

.section-header h2 {
  font-size: var(--fs-lg);
  font-weight: 600;
  color: var(--text-primary);
}

.section-header p {
  font-size: var(--fs-sm);
  color: var(--text-secondary);
}

.form-container {
  margin-bottom: var(--sp-8);
}

.disabled-group label {
  color: rgba(255, 255, 255, 0.2) !important;
}

textarea {
  width: 100%;
  padding: var(--sp-3) var(--sp-4);
  background: var(--bg-input);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-family: inherit;
  font-size: var(--fs-base);
  resize: vertical;
  min-height: 100px;
  outline: none;
  transition: border-color var(--duration);
}

textarea:focus {
  border-color: var(--accent);
}

textarea:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: rgba(0,0,0,0.2);
}

.btn-primary {
  background: var(--accent);
  color: var(--bg-primary);
  border: none;
  width: 100%;
  margin-top: var(--sp-2);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  border-top-color: var(--bg-primary);
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.sent-message {
  text-align: center;
  padding: var(--sp-6) 0;
}

.success-icon {
  margin-bottom: var(--sp-4);
  display: flex;
  justify-content: center;
}

.sent-message h3 {
  font-size: var(--fs-xl);
  font-weight: 600;
  margin-bottom: var(--sp-2);
}

.sent-message p {
  font-size: var(--fs-sm);
  color: var(--text-muted);
}

/* FAQ Styles Refactored */
.faq-section {
  margin-bottom: var(--sp-12);
}

.faq-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--sp-4);
  flex-wrap: wrap;
  gap: var(--sp-3);
}

.faq-header h3 {
  font-size: var(--fs-lg);
  font-weight: 600;
  margin: 0;
}

.search-mini {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 6px 12px;
  border-radius: var(--radius-full);
  min-width: 180px;
}

.search-mini input {
  background: none;
  border: none;
  font-size: var(--fs-xs);
  color: var(--text-primary);
  outline: none;
  width: 100%;
  padding-right: 24px;
}

.search-icon {
  color: var(--text-muted);
}

.btn-clear {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s;
}

.btn-clear:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--accent);
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
}

.faq-item-accordion {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: all 0.3s var(--ease-out);
}

.faq-item-accordion.active {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(6, 182, 212, 0.3);
}

.faq-question {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--sp-4);
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  color: var(--text-primary);
  font-weight: 600;
  font-size: var(--fs-base);
}

.chevron {
  transition: transform 0.3s var(--ease-out);
  color: var(--text-muted);
}

.active .chevron {
  transform: rotate(180deg);
  color: var(--accent);
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s var(--ease-out);
}

.active .faq-answer {
  max-height: 200px; /* Suficiente para el contenido */
}

.answer-content {
  padding: 0 var(--sp-4) var(--sp-4);
  font-size: var(--fs-sm);
  color: var(--text-secondary);
  line-height: 1.6;
}

.no-results {
  text-align: center;
  padding: var(--sp-6);
  color: var(--text-muted);
  font-size: var(--fs-sm);
  font-style: italic;
}
</style>
