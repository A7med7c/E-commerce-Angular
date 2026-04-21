import { CarouselModule } from 'ngx-owl-carousel-o';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductService } from './../../Core/Services/product-service';
import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { IProducts } from '../../Core/Interfaces/iproducts';
import { Subscription } from 'rxjs';
import { CategoryService } from '../../Core/Services/category-service';
import { ICategory } from '../../Core/Interfaces/icategory';
import { OwlOptions } from 'ngx-owl-carousel-o';


@Component({
  selector: 'app-home',
  imports: [CarouselModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit, OnDestroy {


  //Injections
  private readonly _productService = inject(ProductService)
  private readonly _categoryService = inject(CategoryService)
  private readonly _cdr = inject(ChangeDetectorRef)

  //properties
  productList: IProducts[] = []
  categoryList: ICategory[] = []
  productsSubscribtion!: Subscription

  // Slider Options 
  customOptionsCategory: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    autoplay: true,
    autoplayMouseleaveTimeout: 600,
    autoplayHoverPause: true,
    navSpeed: 700,
    navText: ['<i class="fa-duotone fa-solid fa-angles-right"></i>', '<i class="fa-duotone fa-solid fa-angles-left"></i>'],
    responsive: {
      0: { items: 1 },
      400: { items: 2 },
      740: { items: 3 },
      940: { items: 5 }
    },
    nav: true
  };
  customOptionsMain: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    autoplay: true,
    autoplayMouseleaveTimeout: 600,
    autoplayHoverPause: true,
    navSpeed: 700,
    navText: ['', ''],
    items: 1,
    nav: false
  };



  // called in init the component
  ngOnInit(): void {
    this.productsSubscribtion = this._productService.getAllProducts().subscribe({
      next: (res) => {
        this.productList = res.data;
        this._cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
        this._cdr.detectChanges();
      }
    })

    this._categoryService.getAllCategories().subscribe({
      next: (res) => {
        // console.log(res.data);
        this.categoryList = res.data;
        console.log(this.categoryList)
      },
      error: (err: HttpErrorResponse) => {
        console.log(err)
      }
    })
  }

  // called in exit the component so we make unsubscribe here 
  ngOnDestroy(): void {
    this.productsSubscribtion?.unsubscribe();
  }
}
