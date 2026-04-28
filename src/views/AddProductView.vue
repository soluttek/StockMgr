<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { supabase } from "@/lib/supabase";
import { useCatalogStore } from "@/stores/useCatalogStore";
import type { QualityGrade } from "@/types";
import { generatePrefix, generateSku } from "@/utils/skuEngine";

const router = useRouter();
const catalog = useCatalogStore();

const isSaving = ref(false);
const errorMsg = ref<string | null>(null);

// Form State
const form = ref({
	name: "",
	categoryId: "",
	brandId: "",
	state: "01", // 01=Nuevo, 02=Usado
	condition: "OEM" as QualityGrade,
	correlative: "00001", // Se auto calculará
});

const states = [
	{ code: "01", name: "Nuevo" },
	{ code: "02", name: "Usado" },
];

const conditions = [
	{ value: "OEM", code: "OEM" },
	{ value: "Service Pack", code: "SVP" },
	{ value: "Aftermarket", code: "AFT" },
	{ value: "Ori", code: "ORI" },
	{ value: "Refurbished", code: "REF" },
];

const selectedCategory = computed(() =>
	catalog.categories.find((c) => c.id === form.value.categoryId),
);
const selectedBrand = computed(() =>
	catalog.brands.find((b) => b.id === form.value.brandId),
);

const generatedSku = computed(() => {
	if (!selectedCategory.value || !selectedBrand.value)
		return "XXX-XXX-XX-XXX-XXXXX";

	const catPrefix = generatePrefix(selectedCategory.value.name);
	const brandPrefix = generatePrefix(selectedBrand.value.name);
	const condCode =
		conditions.find((c) => c.value === form.value.condition)?.code || "XXX";

	try {
		return generateSku({
			category: catPrefix,
			brand: brandPrefix,
			state: form.value.state,
			condition: condCode,
			correlative: form.value.correlative,
		});
	} catch (err) {
		return "XXX-XXX-XX-XXX-XXXXX";
	}
});

// Auto calculador de correlativo
const calculateCorrelative = () => {
	if (!selectedCategory.value || !selectedBrand.value) return "00001";
	const catPrefix = generatePrefix(selectedCategory.value.name);
	const brandPrefix = generatePrefix(selectedBrand.value.name);

	// Contar cuántos productos existen con el mismo prefijo
	const matching = catalog.products.filter((p) =>
		p.sku.startsWith(`${catPrefix}-${brandPrefix}`),
	);
	const nextNumber = matching.length + 1;
	return String(nextNumber).padStart(5, "0");
};

// Al cambiar categoría o marca reseteamos correlativo
const handleCatBrandChange = () => {
	form.value.correlative = calculateCorrelative();
};

const saveProduct = async () => {
	if (!form.value.name || !form.value.categoryId || !form.value.brandId) {
		errorMsg.value = "Por favor, completa todos los campos requeridos.";
		return;
	}

	errorMsg.value = null;
	isSaving.value = true;

	try {
		const { error } = await supabase
			.from("products")
			.insert({
				name: form.value.name,
				sku: generatedSku.value,
				category_id: form.value.categoryId,
				brand_id: form.value.brandId,
				quality_grade: form.value.condition,
			} as any)
			.select()
			.single();

		if (error) throw error;

		// Refrescar el catálogo para incluir el nuevo producto
		await catalog.fetchCatalog(true);

		// Ir a la vista de inventario
		router.push("/inventario");
	} catch (err: any) {
		console.error("Error guardando producto:", err);
		errorMsg.value = err.message || "Error al guardar el producto.";
	} finally {
		isSaving.value = false;
	}
};

onMounted(async () => {
	if (catalog.categories.length === 0) {
		await catalog.fetchCatalog();
	}
});
</script>

<template>
  <div class="add-product page-container">
    <header class="page-header">
      <button @click="router.back()" class="btn-back">
        <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>
      <h2 class="text-gradient">Alta de Producto</h2>
    </header>

    <div class="form-container">
      <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
      
      <!-- Previsualización del SKU -->
      <div class="sku-preview-card">
        <label>SKU Generado</label>
        <div class="sku-preview">{{ generatedSku }}</div>
      </div>

      <div class="form-group">
        <label>Nombre del Producto</label>
        <input v-model="form.name" type="text" placeholder="Ej: Samsung Galaxy A51 - Pantalla" />
      </div>

      <div class="form-grid">
        <div class="form-group">
          <label>Categoría</label>
          <select v-model="form.categoryId" @change="handleCatBrandChange">
            <option value="" disabled>Selecciona...</option>
            <option v-for="cat in catalog.categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
          </select>
        </div>

        <div class="form-group">
          <label>Marca</label>
          <select v-model="form.brandId" @change="handleCatBrandChange">
            <option value="" disabled>Selecciona...</option>
            <option v-for="brand in catalog.brands" :key="brand.id" :value="brand.id">{{ brand.name }}</option>
          </select>
        </div>

        <div class="form-group">
          <label>Estado</label>
          <select v-model="form.state">
            <option v-for="state in states" :key="state.code" :value="state.code">{{ state.name }} ({{ state.code }})</option>
          </select>
        </div>

        <div class="form-group">
          <label>Calidad / Condición</label>
          <select v-model="form.condition">
            <option v-for="cond in conditions" :key="cond.value" :value="cond.value">{{ cond.value }} ({{ cond.code }})</option>
          </select>
        </div>
      </div>

      <button @click="saveProduct" :disabled="isSaving" class="btn btn-save">
        <span v-if="isSaving">Guardando...</span>
        <span v-else>Guardar Producto</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.btn-back {
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  padding: 0;
  margin-right: 1rem;
  display: flex;
  align-items: center;
}

.form-container {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sku-preview-card {
  background: var(--bg-card);
  padding: 1.5rem;
  border-radius: var(--radius-md);
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.sku-preview-card label {
  display: block;
  font-size: var(--fs-xs);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.5rem;
}

.sku-preview {
  font-family: var(--font-mono);
  font-size: var(--fs-xl);
  color: var(--accent);
  font-weight: 700;
  letter-spacing: 0.05em;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: var(--fs-xs);
  color: var(--text-secondary);
}

input, select {
  width: 100%;
  padding: 0.8rem 1rem;
  background: var(--bg-elevated);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-family: inherit;
  font-size: var(--fs-sm);
  outline: none;
  transition: border-color 0.2s;
}

input:focus, select:focus {
  border-color: var(--accent);
}

.btn-save {
  margin-top: 1rem;
  height: 56px;
  background: var(--accent);
  color: var(--bg-primary);
  border: none;
  border-radius: var(--radius-md);
  font-weight: 700;
  font-size: var(--fs-base);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-save:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-msg {
  background: var(--stock-critical-bg);
  color: var(--stock-critical);
  padding: 1rem;
  border-radius: var(--radius-sm);
  font-size: var(--fs-sm);
  border-left: 3px solid var(--stock-critical);
}
</style>
