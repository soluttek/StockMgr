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
        const handler = routes[hash];

        if (handler) {
            if (currentView?.destroy) currentView.destroy();
            appContainer.innerHTML = '';
            currentView = await handler(appContainer);
        }
    }

    window.addEventListener('hashchange', handleRoute);
    handleRoute();
}
