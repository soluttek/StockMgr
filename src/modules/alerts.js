const THRESHOLD_RED = 1;
const THRESHOLD_YELLOW = 2;

export function getStockLevel(stock) {
    if (stock <= THRESHOLD_RED) return 'critical';
    if (stock <= THRESHOLD_YELLOW) return 'low';
    return 'ok';
}

export function getStockBadgeClass(stock) {
    const level = getStockLevel(stock);
    return `stock-badge--${level}`;
}

export function getStockEmoji(stock) {
    const level = getStockLevel(stock);
    if (level === 'critical') return '🔴';
    if (level === 'low') return '🟡';
    return '🟢';
}

export function filterCriticalProducts(products) {
    return products.filter(p => p.stock <= THRESHOLD_YELLOW);
}
