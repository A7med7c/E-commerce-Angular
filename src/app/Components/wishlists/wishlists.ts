import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../Core/Services/cart-service';
import { WishListService } from '../../Core/Services/wish-list-service';
import { IWishlist } from '../../Core/Interfaces/iwishlist';

@Component({
  selector: 'app-wishlists',
  imports: [CommonModule, TranslateModule],
  templateUrl: './wishlists.html',
  styleUrl: './wishlists.scss',
})
export class Wishlists implements OnInit, OnDestroy {
  private readonly _wishListService = inject(WishListService);
  private readonly _cartService = inject(CartService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _toastr = inject(ToastrService);
  private wishListSubscription?: Subscription;

  readonly wishlistItems = signal<IWishlist[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly hasError = signal<boolean>(false);
  readonly errorMessage = signal<string>('');

  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      this.loadWishlist();
    } else {
      this.isLoading.set(false);
    }
  }

  ngOnDestroy(): void {
    this.wishListSubscription?.unsubscribe();
  }

  private loadWishlist(): void {
    this.isLoading.set(true);
    this.hasError.set(false);
    this.errorMessage.set('');

    this.wishListSubscription = this._wishListService.getUserWishList().subscribe({
      next: (res) => {
        this.wishlistItems.set(res.data || []);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to load wishlist:', err);
        this.hasError.set(true);
        this.errorMessage.set(this.getErrorMessage(err, 'Failed to load wishlist items'));
        this._toastr.error(this.getErrorMessage(err, 'Failed to load wishlist items'));
        this.isLoading.set(false);
      },
    });
  }

  addToCart(item: IWishlist): void {
    const productId = item.id || item._id;

    this._cartService.addToCart(productId).subscribe({
      next: (res) => {
        this._cartService.itemsNumber.set(res.numOfCartItems ?? 0);
        this._toastr.success('Item added to cart');
      },
      error: (err: HttpErrorResponse) => {
        this._toastr.error(this.getErrorMessage(err, 'Failed to add item to cart'));
      },
    });
  }

  removeFromWishlist(item: IWishlist): void {
    const productId = item.id || item._id;

    this._wishListService.removeFromWishlist(productId).subscribe({
      next: () => {
        this.wishlistItems.update((items) =>
          items.filter((wishlistItem) => (wishlistItem.id || wishlistItem._id) !== productId)
        );
        this._toastr.success('Item removed from wishlist');
      },
      error: (err: HttpErrorResponse) => {
        this._toastr.error(this.getErrorMessage(err, 'Failed to remove item from wishlist'));
      },
    });
  }

  trackByWishlistId(_: number, item: IWishlist): string {
    return item.id || item._id;
  }

  private getErrorMessage(err: HttpErrorResponse, fallbackMessage: string): string {
    return err.error?.message || err.error?.statusMsg || err.message || fallbackMessage;
  }
}
