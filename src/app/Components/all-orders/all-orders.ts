import { Component, inject } from '@angular/core';
import { OrdersService } from '../../Core/Services/orders-service';
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { AsyncPipe } from '@angular/common';
import { map, catchError, startWith } from 'rxjs';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-all-orders',
  imports: [CurrencyPipe, DatePipe, TitleCasePipe, AsyncPipe],
  templateUrl: './all-orders.html',
  styleUrl: './all-orders.scss',
})
export class AllOrders {
  private readonly _ordersServices = inject(OrdersService);

  orders$ = this._ordersServices.getUserOrders().pipe(
    map(res => res || []),
    catchError(() => of([])),
    startWith(null)  // null = loading state
  );
}