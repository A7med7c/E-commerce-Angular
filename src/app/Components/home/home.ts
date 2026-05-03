import { CarouselModule } from 'ngx-owl-carousel-o';
import { ProductService } from './../../Core/Services/product-service';
import { Component, inject, OnInit, DestroyRef, ChangeDetectionStrategy, OnDestroy, signal } from '@angular/core';
import { IProducts } from '../../Core/Interfaces/iproducts';
import { CategoryService } from '../../Core/Services/category-service';
import { ICategory } from '../../Core/Interfaces/icategory';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { RouterLink } from "@angular/router";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchPipe } from '../../Core/Pipes/search-pipe';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CartService } from '../../Core/Services/cart-service';
import { ToastrService } from 'ngx-toastr';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  imports: [CarouselModule, RouterLink, SearchPipe, FormsModule, TranslatePipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home implements OnInit, OnDestroy {


  private readonly _productService = inject(ProductService)
  private readonly _categoryService = inject(CategoryService)
  private readonly _cartService = inject(CartService)
  private readonly _destroyRef = inject(DestroyRef)
  private readonly _toastrService = inject(ToastrService)

  readonly productList = signal<IProducts[]>([])
  readonly categoryList = signal<ICategory[]>([])
  readonly categoryLoaded = signal(false);
  readonly productLoaded = signal(false);
  searchText: string = ''
  productSubs!: Subscription
  cartItemsNumber: number = 0;


  customOptionsCategory: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    rtl: true,
    autoplay: true,
    autoplayMouseleaveTimeout: 600,
    autoplayHoverPause: true,
    navSpeed: 700,
    navText: ['<i class="fa-duotone fa-solid fa-angles-right"></i>', '<i class="fa-duotone fa-solid fa-angles-left"></i>'],
    responsive: {
      0: { items: 2 },
      576: { items: 3 },
      768: { items: 4 },
      992: { items: 5 },
      1200: { items: 6 }
    },
    nav: true
  };

  customOptionsMain: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    rtl: true,
    autoplay: true,
    autoplayTimeout: 2000,
    autoplayHoverPause: true,
    navSpeed: 700,
    navText: ['', ''],
    nav: false,
    responsive: {
      0: { items: 1 },
      576: { items: 1 },
      768: { items: 1 },
      992: { items: 1 }
    }
  };

  ngOnInit(): void {
    this.productSubs = this._productService.getAllProducts()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (res) => {
          this.productList.set(res.data);
          console.log(this.productList())
          this.productLoaded.set(true);
        }
      });

    this._categoryService.getAllCategories()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (res) => {
          this.categoryList.set(res.data);
          this.categoryLoaded.set(true);
        }
      });
  }

  ngOnDestroy(): void {
    this.productSubs.unsubscribe();
  }

  addToCart(id: string): void {
    this._cartService.addToCart(id).subscribe({
      next: (res) => {
        console.log(res);
        this._toastrService.success(
          res.message || 'Product added successfully'
        );
        this._cartService.itemsNumber.set(res.numOfCartItems);
        console.log(this.cartItemsNumber)
      }
    })

  }
}