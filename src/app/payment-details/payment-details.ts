import { Component, HostListener, input, output } from '@angular/core';
import { StatusBadge } from '../status-badge/status-badge';
import { Payment } from '../payment/payment.model';
import { formatDate, formatMoney, METHOD_LABELS, netAmount } from '../shared/format';

@Component({
    selector: 'app-payment-details',
    standalone: true,
    imports: [StatusBadge],
    template: `
    @if (payment(); as p) {
      <div class="backdrop" (click)="closed.emit()"></div>
      <aside class="panel" role="dialog" aria-modal="true" aria-label="Payment details">
        <header>
          <h3>{{ p.reference }}</h3>
          <button type="button" aria-label="Close details" (click)="closed.emit()">✕</button>
        </header>

        <dl>
          <dt>Reference</dt><dd>{{ p.reference }}</dd>
          <dt>Customer</dt><dd>{{ p.customerName }}</dd>
          <dt>Email</dt><dd>{{ p.customerEmail }}</dd>
          <dt>Description</dt><dd>{{ p.description }}</dd>
          <dt>Amount</dt><dd>{{ money(p.amount, p.currency) }}</dd>
          <dt>Fee</dt><dd>{{ money(p.fee, p.currency) }}</dd>
          <dt>Net</dt><dd>{{ money(net(p), p.currency) }}</dd>
          <dt>Status</dt><dd><app-status-badge [status]="p.status" /></dd>
          <dt>Method</dt><dd>{{ methodLabels[p.method] }}</dd>
          <dt>Created</dt><dd>{{ date(p.createdAt) }}</dd>
        </dl>
      </aside>
    }
  `,
    styles: `
    .backdrop { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.3); z-index: 10; }
    .panel { position: fixed; top: 0; right: 0; bottom: 0; width: 380px; max-width: 100%;
             background: #fff; z-index: 11; padding: 24px; overflow-y: auto;
             box-shadow: -4px 0 16px rgba(0, 0, 0, 0.15); }
    header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    header h3 { margin: 0; font-family: monospace; }
    header button { border: none; background: none; font-size: 18px; cursor: pointer; }
    dl { display: grid; grid-template-columns: 110px 1fr; gap: 12px 8px; margin: 0; }
    dt { color: #6b7280; font-size: 13px; }
    dd { margin: 0; word-break: break-word; }
  `,
})
export class PaymentDetails {
    readonly payment = input.required<Payment | null>();
    readonly closed = output<void>();

    readonly methodLabels = METHOD_LABELS;

    @HostListener('document:keydown.escape')
    onEscape(): void {
        if (this.payment()) {
            this.closed.emit();
        }
    }

    money(amount: number, currency: string): string {
        return formatMoney(amount, currency);
    }

    net(payment: Payment): number {
        return netAmount(payment.amount, payment.fee);
    }

    date(iso: string): string {
        return formatDate(iso);
    }
}