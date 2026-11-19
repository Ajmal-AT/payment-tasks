export type PaymentStatus = 'completed' | 'pending' | 'failed' | 'refunded';
export type PaymentMethod = 'ach' | 'wire' | 'card' | 'check';
export type StatusFilter = PaymentStatus | 'all';

export interface Payment {
    id: string;
    reference: string;       // e.g. INV-2026-1044
    customerName: string;
    customerEmail: string;
    description: string;
    amount: number;
    fee: number;
    currency: string;        // 'USD' | 'EUR' | 'GBP' ...
    method: PaymentMethod;
    status: PaymentStatus;
    createdAt: string;       // ISO date string
}

export const STATUS_OPTIONS: ReadonlyArray<{ value: StatusFilter; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' },
    { value: 'refunded', label: 'Refunded' },
];

export function isStatusFilter(value: string): value is StatusFilter {
    return STATUS_OPTIONS.some(option => option.value === value);
}