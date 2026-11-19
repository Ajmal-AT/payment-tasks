import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, delay, map } from 'rxjs';
import { Payment } from './payment/payment.model';

@Injectable({
    providedIn: 'root'
})
export class Payments {
    private http = inject(HttpClient);

    getPayments(): Observable<Payment[]> {
        return this.http.get<Payment[]>('/assets/payments.json')
            .pipe(delay(600));
    }
}
