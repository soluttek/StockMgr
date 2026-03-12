/**
 * Genera una contraseña segura de forma aleatoria.
 * Utiliza Web Crypto API para mayor seguridad.
 * @param {number} length Longitud de la contraseña a generar
 * @returns {string} Contraseña segura generada
 */
export function generateSecurePassword(length = 16) {
	const charset =
		"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
	let password = "";

	// Validamos que el navegador soporte crypto
	if (window.crypto?.getRandomValues) {
		const values = new Uint32Array(length);
		window.crypto.getRandomValues(values);
		for (let i = 0; i < length; i++) {
			password += charset[values[i] % charset.length];
		}
	} else {
		// Fallback por si la API no está disponible (no recomendable, pero útil por si acaso)
		for (let i = 0, n = charset.length; i < length; ++i) {
			password += charset.charAt(Math.floor(Math.random() * n));
		}
	}

	return password;
}
