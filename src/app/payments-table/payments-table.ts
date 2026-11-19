import { Component, input, output } from '@angular/core';
import { StatusBadge } from '../status-badge/status-badge';
import { Payment } from '../payment/payment.model';
import { formatDate, formatMoney, METHOD_LABELS } from '../shared/format';

@Component({
    selector: 'app-payments-table',
    standalone: true,
    imports: [StatusBadge],
    template: `
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Reference</th>
            <th>Customer</th>
            <th class="right">Amount</th>
            <th>Status</th>
            <th>Method</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          @for (payment of payments(); track payment.id) {
            <tr
              tabindex="0"
              (click)="selected.emit(payment)"
              (keydown.enter)="selected.emit(payment)"
            >
              <td class="reference">{{ payment.reference }}</td>
              <td>{{ payment.customerName }}</td>
              <td class="right">{{ money(payment) }}</td>
              <td><app-status-badge [status]="payment.status" /></td>
              <td>{{ methodLabels[payment.method] }}</td>
              <td>{{ date(payment.createdAt) }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
    styles: `
    .table-wrapper { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; white-space: nowrap; }
    th { font-size: 12px; text-transform: uppercase; color: #6b7280; }
    .right { text-align: right; }
    .reference { font-family: monospace; }
    tbody tr { cursor: pointer; }
    tbody tr:hover, tbody tr:focus { background: #f9fafb; outline: none; }
  `,
})
export class PaymentsTable {
    readonly payments = input.required<readonly Payment[]>();
    readonly selected = output<Payment>();

    readonly methodLabels = METHOD_LABELS;

    money(payment: Payment): string {
        return formatMoney(payment.amount, payment.currency);
    }

    date(iso: string): string {
        return formatDate(iso);
    }
}