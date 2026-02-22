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
