import { Component, OnInit, computed, inject, signal } from '@angular/core';

import { Payments } from './payments';
import { Payment, PaymentStatus, StatusFilter } from './payment/payment.model';
import { PaymentFilters } from './payment-filters/payment-filters';
import { PaymentsTable } from './payments-table/payments-table';
import { Pagination } from './pagination/pagination';
import { PaymentDetails } from './payment-details/payment-details';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PaymentFilters, PaymentsTable, Pagination, PaymentDetails],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly paymentsService = inject(Payments);

  readonly payments = signal<Payment[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal('');

  readonly search = signal('');
  readonly status = signal<StatusFilter>('all');
  readonly page = signal(1);
  readonly selected = signal<Payment | null>(null);

  readonly filtered = computed(() => {
    const query = this.search().trim().toLowerCase();
    const status = this.status();

    return this.payments().filter(payment => {
      const matchesStatus = status === 'all' || payment.status === status;
      const matchesSearch =
        query === '' ||
        payment.customerName.toLowerCase().includes(query) ||
        payment.reference.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  });

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filtered().length / PAGE_SIZE)));

  readonly pageRows = computed(() => {
    const start = (this.page() - 1) * PAGE_SIZE;
    return this.filtered().slice(start, start + PAGE_SIZE);
  });

  readonly counts = computed(() => {
    const counts: Record<PaymentStatus, number> = { completed: 0, pending: 0, failed: 0, refunded: 0 };
    for (const payment of this.payments()) {
      counts[payment.status]++;
    }
    return counts;
  });

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.paymentsService.getPayments().subscribe({
      next: (data: Payment[]) => {
        this.payments.set(data);
        this.page.set(1);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.errorMessage.set(error instanceof Error ? error.message : 'Unable to load payments');
        this.loading.set(false);
      },
    });
  }

  onSearch(value: string): void {
    this.search.set(value);
    this.page.set(1);
  }

  onStatus(value: StatusFilter): void {
    this.status.set(value);
    this.page.set(1);
  }
}