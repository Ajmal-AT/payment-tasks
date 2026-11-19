import { Component, input, output } from '@angular/core';

@Component({
    selector: 'app-pagination',
    standalone: true,
    template: `
    <div class="pagination">
      <button type="button" [disabled]="page() <= 1" (click)="pageChange.emit(page() - 1)">Previous</button>
      <span>Page {{ page() }} of {{ totalPages() }}</span>
      <button type="button" [disabled]="page() >= totalPages()" (click)="pageChange.emit(page() + 1)">Next</button>
    </div>
  `,
    styles: `
    .pagination { display: flex; align-items: center; justify-content: flex-end; gap: 12px; padding-top: 16px; }
    button { padding: 6px 14px; border: 1px solid #d1d5db; border-radius: 6px; background: #fff; cursor: pointer; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
  `,
})
export class Pagination {
    readonly page = input.required<number>();
    readonly totalPages = input.required<number>();
    readonly pageChange = output<number>();
}