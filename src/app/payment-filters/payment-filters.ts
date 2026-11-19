import { Component, input, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { isStatusFilter, STATUS_OPTIONS, StatusFilter } from '../payment/payment.model';

@Component({
    selector: 'app-payment-filters',
    standalone: true,
    template: `
    <div class="filters">
      <input
        type="search"
        placeholder="Search customer or reference..."
        aria-label="Search customer or reference"
        (input)="onInput($event)"
      />
      <select aria-label="Filter by status" [value]="status()" (change)="onStatus($event)">
        @for (option of options; track option.value) {
          <option [value]="option.value" [selected]="option.value === status()">{{ option.label }}</option>
        }
      </select>
    </div>
  `,
    styles: `
    .filters { display: flex; gap: 12px; margin: 16px 0; }
    input { flex: 1; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; }
    select { padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; }
  `,
})
export class PaymentFilters {
    readonly status = input.required<StatusFilter>();
    readonly searchChange = output<string>();
    readonly statusChange = output<StatusFilter>();

    readonly options = STATUS_OPTIONS;
    private readonly typed = new Subject<string>();

    constructor() {
        this.typed
            .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed())
            .subscribe(value => this.searchChange.emit(value));
    }

    onInput(event: Event): void {
        this.typed.next((event.target as HTMLInputElement).value);
    }

    onStatus(event: Event): void {
        const value = (event.target as HTMLSelectElement).value;
        if (isStatusFilter(value)) {
            this.statusChange.emit(value);
        }
    }
}