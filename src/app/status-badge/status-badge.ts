import { Component, computed, input } from '@angular/core';
import { PaymentStatus, STATUS_OPTIONS } from '../payment/payment.model';


@Component({
    selector: 'app-status-badge',
    standalone: true,
    template: `<span [class]="'badge ' + status()">{{ label() }}</span>`,
    styles: `
    .badge { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; }
    .completed { background: #dcfce7; color: #166534; }
    .pending   { background: #fef3c7; color: #92400e; }
    .failed    { background: #fee2e2; color: #991b1b; }
    .refunded  { background: #e0e7ff; color: #3730a3; }
  `,
})
export class StatusBadge {
    readonly status = input.required<PaymentStatus>();
    readonly label = computed(
        () => STATUS_OPTIONS.find(option => option.value === this.status())?.label ?? this.status()
    );
}