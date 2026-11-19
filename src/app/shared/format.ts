import { PaymentMethod } from '../payment/payment.model';

export const METHOD_LABELS: Record<PaymentMethod, string> = {
    ach: 'ACH',
    wire: 'Wire',
    card: 'Card',
    check: 'Check',
};

const moneyFormatters = new Map<string, Intl.NumberFormat>();

/** $7,872.77  €1,204.00  £980.50 — uses the row's own currency. */
export function formatMoney(amount: number, currency: string): string {
    let formatter = moneyFormatters.get(currency);
    if (!formatter) {
        formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency });
        moneyFormatters.set(currency, formatter);
    }
    return formatter.format(amount);
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
});

/** 31 Aug 2026 */
export function formatDate(iso: string): string {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) {
        return iso;
    }
    const parts = dateFormatter.formatToParts(date);
    const pick = (type: Intl.DateTimeFormatPartTypes): string =>
        parts.find(part => part.type === type)?.value ?? '';
    return `${pick('day')} ${pick('month')} ${pick('year')}`;
}

/** Net = amount - fee, rounded to cents to avoid float noise. */
export function netAmount(amount: number, fee: number): number {
    return Math.round((amount - fee) * 100) / 100;
}