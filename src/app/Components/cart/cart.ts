import { Subscription } from 'rxjs';
import { CartService } from './../../Core/Services/cart-service';
import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ICart } from '../../Core/Interfaces/icart';
import { CurrencyPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart implements OnInit, OnDestroy {


  private readonly _cartService = inject(CartService);
  private readonly _cdr = inject(ChangeDetectorRef);
  private readonly _toastrService = inject(ToastrService)


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
        this.cartDetails = res.data;
        this._cdr.detectChanges();

        this._toastrService.warning(
          res.message || 'Item removed from cart',
          'Removed'
        );
      },
      error: (err) => {
        this._toastrService.error(
          err?.error?.message || 'Failed to remove item',
          'Error'
        );

        console.log(err);
      }
    });
  }

  updateCount(id: string, count: number): void {

    if (count < 1) return;

    this._cartService.changeCount(id, count).subscribe({
      next: (res) => {
        this.cartDetails = res.data;
        this._cdr.detectChanges();

        this._toastrService.info(
          'Cart updated successfully',
          'Updated'
        );
      },
      error: (err) => {
        this._toastrService.error(
          err?.error?.message || 'Failed to update cart',
          'Error'
        );

        console.log(err);
      }
    });
  }

  removeAllItems(): void {
    this._cartService.clearCart().subscribe({
      next: (res) => {
        this.cartDetails = res.data;
        this._cdr.detectChanges();

        this._toastrService.warning(
          'All items removed from cart',
          'Cart Cleared'
        );
      },
      error: (err) => {
        this._toastrService.error(
          err?.error?.message || 'Failed to clear cart',
          'Error'
        );

        console.log(err);
      }
    });
  }

  get isCartEmpty(): boolean {
    return !this.cartDetails?.products?.length;
  }
}
