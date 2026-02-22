export function $(selector, parent = document) {
    return parent.querySelector(selector);
}

export function $$(selector, parent = document) {
    return [...parent.querySelectorAll(selector)];
}

export function createElement(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    for (const [key, val] of Object.entries(attrs)) {
        if (key === 'className') el.className = val;
        else if (key === 'textContent') el.textContent = val;
        else if (key === 'innerHTML') el.innerHTML = val;
        else if (key.startsWith('on')) el.addEventListener(key.slice(2).toLowerCase(), val);
        else el.setAttribute(key, val);
    }
    for (const child of children) {
        if (typeof child === 'string') el.appendChild(document.createTextNode(child));
        else if (child) el.appendChild(child);
    }
    return el;
}

export function showToast(message, type = 'info', duration = 3000) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = createElement('div', {
        className: `toast toast--${type}`,
        textContent: message
    });
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('toast--visible'));

    setTimeout(() => {
        toast.classList.remove('toast--visible');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/**
 * Muestra un modal de confirmación o alerta asíncrono.
 * @returns {Promise<boolean>}
 */
export function showCustomModal({ title = 'Confirmar', message = '', confirmText = 'Aceptar', cancelText = 'Cancelar', type = 'confirm' }) {
    return new Promise((resolve) => {
        const overlay = createElement('div', { className: 'modal-overlay' });
        const card = createElement('div', { className: 'modal-card' });

        const body = createElement('div', { className: 'modal-body' }, [
            createElement('h3', { className: 'modal-title', textContent: title }),
            createElement('p', { className: 'modal-text', textContent: message })
        ]);

        const footer = createElement('div', { className: 'modal-footer' });

        const btnConfirm = createElement('button', {
            className: 'modal-btn modal-btn--confirm',
            textContent: confirmText,
            onclick: () => {
                close(true);
            }
        });

        if (type === 'confirm') {
            const btnCancel = createElement('button', {
                className: 'modal-btn modal-btn--cancel',
                textContent: cancelText,
                onclick: () => {
                    close(false);
                }
            });
            footer.appendChild(btnCancel);
        } else {
            // Si es tipo alerta, el footer solo tiene un botón y centrado
            footer.style.gridTemplateColumns = '1fr';
        }

        footer.appendChild(btnConfirm);
        card.appendChild(body);
        card.appendChild(footer);
        overlay.appendChild(card);
        document.body.appendChild(overlay);

        // Forzar reflow para animación
        requestAnimationFrame(() => overlay.classList.add('modal-overlay--visible'));

        function close(result) {
            overlay.classList.remove('modal-overlay--visible');
            setTimeout(() => {
                overlay.remove();
                resolve(result);
            }, 300);
        }
    });
}

/**
 * Habilita el desplazamiento por arrastre (drag-to-scroll) para escritorio.
 * @param {HTMLElement} el 
 */
export function setupDragScroll(el) {
    let isDown = false;
    let startX;
    let scrollLeft;

    el.style.cursor = 'grab';
    el.style.userSelect = 'none';

    el.addEventListener('mousedown', (e) => {
        isDown = true;
        el.style.cursor = 'grabbing';
        startX = e.pageX - el.offsetLeft;
        scrollLeft = el.scrollLeft;
    });

    el.addEventListener('mouseleave', () => {
        isDown = false;
        el.style.cursor = 'grab';
    });

    el.addEventListener('mouseup', () => {
        isDown = false;
        el.style.cursor = 'grab';
    });

    el.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - el.offsetLeft;
        const walk = (x - startX) * 2; // Velocidad de scroll
        el.scrollLeft = scrollLeft - walk;
    });
}
