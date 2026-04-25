import { Subscription } from 'rxjs';
import { CartService } from './../../Core/Services/cart-service';
import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ICart } from '../../Core/Interfaces/icart';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart implements OnInit, OnDestroy {


  private readonly _cartService = inject(CartService);
  private readonly _cdr = inject(ChangeDetectorRef);


  itemsSubs!: Subscription;
  cartDetails: ICart | null = null;

  ngOnInit(): void {
    this.itemsSubs = this._cartService.getitems().subscribe({
      next: (res) => {
        console.log(res.data);
        this.cartDetails = res.data;
        this._cdr.detectChanges();

      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  ngOnDestroy(): void {
    this.itemsSubs.unsubscribe();
  }

  removeItem(id: string): void {
    this._cartService.deleteItem(id).subscribe({
      next: (res) => {
        console.log(res);
        this.cartDetails = res.data;
        this._cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  updateCount(id: string, count: number): void {
    this._cartService.changeCount(id, count).subscribe({
      next: (res) => {
        console.log(res);
        this.cartDetails = res.data;
        this._cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  removeAllItems(): void {
    this._cartService.clearCart().subscribe({
      next: (res) => {
        this.cartDetails = res.data;
        this._cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  get isCartEmpty(): boolean {
    return !this.cartDetails?.products?.length;
  }
}
