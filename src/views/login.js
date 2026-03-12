import { getUser, signIn } from "../modules/auth.js";
import { generateSecurePassword } from "../modules/crypto.js";
import { showToast } from "../utils/dom.js";

/**
 * Renderiza la vista de inicio de sesión
 */
export default async function renderLogin(container) {
	// Verificar si ya está logueado
	const user = await getUser();
	if (user) {
		window.location.hash = "/";
		return;
	}

	container.innerHTML = `
		<div style="display: flex; flex-direction: column; justify-content: center; min-height: 80dvh; padding: var(--sp-4);">
			<div style="text-align: center; margin-bottom: var(--sp-10);">
				<h1 class="header-logo" style="font-size: var(--fs-3xl); font-weight: 800; letter-spacing: -2px; margin-bottom: var(--sp-2);">
					STOCK<span class="accent">MGR</span>
				</h1>
				<p style="color: var(--text-muted); font-size: var(--fs-base);">Acceso Seguro</p>
			</div>

			<form id="loginForm" class="card" style="padding: var(--sp-6);">
				<div class="form-group">
					<label for="emailInput">Correo Electrónico</label>
					<input 
						type="email" 
						id="emailInput" 
						placeholder="ej: admin@stockmgr.com" 
						required 
						autocomplete="username"
					/>
				</div>

				<div class="form-group">
					<label for="passwordInput">Contraseña</label>
					<div style="position: relative; display: flex; align-items: center;">
						<input 
							type="password" 
							id="passwordInput" 
							placeholder="Tu contraseña" 
							required 
							autocomplete="current-password"
							style="padding-right: 56px;"
						/>
						<button 
							type="button" 
							id="btnGeneratePwd" 
							title="Generar contraseña segura"
							style="position: absolute; right: 8px; background: transparent; border: none; font-size: var(--fs-xl); cursor: pointer; color: var(--text-muted); padding: 4px; transition: color var(--duration);"
						>
							🎲
						</button>
					</div>
				</div>

				<button type="submit" class="btn btn-action--entrada" style="width: 100%; margin-top: var(--sp-4); height: 56px;" id="btnSubmit">
					Entrar al Sistema
				</button>
			</form>
		</div>
	`;

	const loginForm = container.querySelector("#loginForm");
	const emailInput = container.querySelector("#emailInput");
	const passwordInput = container.querySelector("#passwordInput");
	const btnSubmit = container.querySelector("#btnSubmit");
	const btnGeneratePwd = container.querySelector("#btnGeneratePwd");

	// Generador de contraseñas
	btnGeneratePwd.addEventListener("click", () => {
		const newPwd = generateSecurePassword(16);
		passwordInput.value = newPwd;

		// Cambiar momentáneamente a "text" para que el usuario pueda verla y copiarla
		passwordInput.type = "text";

		// Copiar al portapapeles
		navigator.clipboard
			.writeText(newPwd)
			.then(() => {
				showToast("Contraseña generada y copiada al portapapeles", "success");
			})
			.catch(() => {
				showToast("Contraseña generada. Cópiala manualmente.", "success");
			});

		// Devolver a "password" después de 5 segundos
		setTimeout(() => {
			passwordInput.type = "password";
		}, 5000);
	});

	// Envío del formulario
	loginForm.addEventListener("submit", async (e) => {
		e.preventDefault();

		const email = emailInput.value.trim();
		const password = passwordInput.value.trim();

		if (!email || !password) {
			showToast("Por favor, completa todos los campos", "error");
			return;
		}

		// Estado de carga
		const originalText = btnSubmit.textContent;
		btnSubmit.textContent = "Autenticando...";
		btnSubmit.disabled = true;
		btnSubmit.style.opacity = "0.7";

		try {
			await signIn(email, password);
			showToast("Bienvenido a StockMgr", "success");
			window.location.hash = "/"; // Redirigir al dashboard
		} catch (error) {
			console.error("Error en login:", error);
			showToast(error.message || "Credenciales incorrectas", "error");

			// Restaurar botón
			btnSubmit.textContent = originalText;
			btnSubmit.disabled = false;
			btnSubmit.style.opacity = "1";
		}
	});

	// Ocultar la barra inferior durante el login
	const bottomNav = document.querySelector(".bottom-nav");
	const fabScan = document.querySelector(".fab-scan");
	if (bottomNav) bottomNav.style.display = "none";
	if (fabScan) fabScan.style.display = "none";

	// Crear función cleanup para restaurar la interfaz cuando se salga de esta vista
	container.destroy = () => {
		if (bottomNav) bottomNav.style.display = "flex";
		if (fabScan) fabScan.style.display = "flex";
	};
}
