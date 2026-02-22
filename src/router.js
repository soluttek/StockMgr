const routes = {};
let currentView = null;

export function registerRoute(path, handler) {
    routes[path] = handler;
}

export function navigate(path) {
    window.location.hash = path;
}

export function initRouter(appContainer) {
    async function handleRoute() {
        const hash = window.location.hash.slice(1) || '/';

        let handler = routes[hash];
        let params = {};

        // Soporte básico para rutas con parámetros (ej: /marcas/:codigo/modelos)
        if (!handler) {
            for (const path in routes) {
                if (path.includes(':')) {
                    const pathParts = path.split('/');
                    const hashParts = hash.split('/');

                    if (pathParts.length === hashParts.length) {
                        const match = pathParts.every((part, i) => part.startsWith(':') || part === hashParts[i]);
                        if (match) {
                            handler = routes[path];
                            pathParts.forEach((part, i) => {
                                if (part.startsWith(':')) {
                                    params[part.slice(1)] = hashParts[i];
                                }
                            });
                            break;
                        }
                    }
                }
            }
        }

        if (handler) {
            if (currentView?.destroy) currentView.destroy();
            appContainer.innerHTML = '';
            currentView = await handler(appContainer, params);
        }
    }

    window.addEventListener('hashchange', handleRoute);
    handleRoute();
}
