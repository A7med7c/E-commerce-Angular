import { Subscription } from 'rxjs';
import { CartService } from './../../Core/Services/cart-service';
import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ICart } from '../../Core/Interfaces/icart';
import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart implements OnInit, OnDestroy {


  private readonly _cartService = inject(CartService);
  private readonly _cdr = inject(ChangeDetectorRef);
  private readonly _toastrService = inject(ToastrService)
  private readonly _platformId = inject(PLATFORM_ID);

  private get canToast(): boolean {
    return isPlatformBrowser(this._platformId);
  }


  itemsSubs!: Subscription;
  cartDetails: ICart | null = null;

  ngOnInit(): void {
    this.itemsSubs = this._cartService.getitems().subscribe({
      next: (res) => {
        console.log(res.data);
        this.cartDetails = res.data;
        // Update the cart items number for the badge in navbar
        this._cartService.itemsNumber.next(res.numOfCartItems);
        this._cdr.detectChanges();
      },
      error: (err) => {
        if (this.canToast) {
          this._toastrService.error(err?.error?.message || 'Something went wrong');
        }
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
        this._cartService.itemsNumber.next(res.numOfCartItems)
        this._cdr.detectChanges();

        if (this.canToast) {
          this._toastrService.warning(
            res.message || 'Item removed from cart successfully',
            'Removed'
          );
        }
      },
      error: (err) => {
        if (this.canToast) {
          this._toastrService.error(
            err?.error?.message || 'Something went wrong',
            'Error'
          );
        }

        console.log(err);
      }
    });
  }

  updateCount(id: string, count: number): void {

    if (count < 1) return;

    this._cartService.changeCount(id, count).subscribe({
      next: (res) => {
        this.cartDetails = res.data;
        // Update the cart items number for the badge in navbar
        this._cartService.itemsNumber.next(res.numOfCartItems);
        this._cdr.detectChanges();

        if (this.canToast) {
          this._toastrService.info(
            'Cart updated successfully',
          );
        }
      },
      error: (err) => {
        if (this.canToast) {
          this._toastrService.error(
            err?.error?.message || 'Something went wrong',
            'Error'
          );
        }

        console.log(err);
      }
    });
  }

  removeAllItems(): void {
    this._cartService.clearCart().subscribe({
      next: (res) => {
        this.cartDetails = res.data;
        // Update the cart items number for the badge in navbar (should be 0)
        this._cartService.itemsNumber.next(res.numOfCartItems || 0);
        this._cdr.detectChanges();

        if (this.canToast) {
          this._toastrService.warning(
            res.message || 'Operation completed successfully',
            'Cart Cleared'
          );
        }
      },
      error: (err) => {
        if (this.canToast) {
          this._toastrService.error(
            err?.error?.message || 'Something went wrong',
            'Error'
          );
        }

        console.log(err);
      }
    });
  }

  get isCartEmpty(): boolean {
    return !this.cartDetails?.products?.length;
  }
}
