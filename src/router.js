const routes = {};
let currentView = null;
const beforeEachGuards = [];

/**
 * Registra un middleware global que se ejecuta antes de cada navegación.
 * @param {Function} guard - Función async que recibe (path, params) y puede devolver un nuevo path para redirigir
 */
export function beforeEach(guard) {
	beforeEachGuards.push(guard);
}

export function registerRoute(path, handler) {
	routes[path] = handler;
}

export function navigate(path) {
	window.location.hash = path;
}

export function initRouter(appContainer) {
	async function handleRoute() {
		// Separar hash de query string
		const fullHash = window.location.hash.slice(1) || "/";
		const [hash, queryString] = fullHash.split("?");

		const queryParams = {};
		if (queryString) {
			new URLSearchParams(queryString).forEach((val, key) => {
				queryParams[key] = val;
			});
		}

		let handler = routes[hash];
		const params = { ...queryParams };
		let matchedPath = hash;

		// Soporte para rutas dinámicas (/:param)
		if (!handler) {
			for (const path in routes) {
				if (path.includes(":")) {
					const pathParts = path.split("/");
					const hashParts = hash.split("/");

					if (pathParts.length === hashParts.length) {
						const match = pathParts.every(
							(part, i) => part.startsWith(":") || part === hashParts[i],
						);
						if (match) {
							handler = routes[path];
							matchedPath = path;
							pathParts.forEach((part, i) => {
								if (part.startsWith(":")) {
									params[part.slice(1)] = hashParts[i];
								}
							});
							break;
						}
					}
				}
			}
		}

		// Ejecutar guards
		for (const guard of beforeEachGuards) {
			const redirect = await guard(matchedPath, hash, params);
			if (redirect) {
				if (redirect === false) return; // Cancelar navegación
				if (typeof redirect === "string") {
					navigate(redirect);
					return;
				}
			}
		}

		if (handler) {
			if (currentView?.destroy) currentView.destroy();
			appContainer.innerHTML = "";
			currentView = await handler(appContainer, params);
		}
	}

	window.addEventListener("hashchange", handleRoute);
	handleRoute();
}
