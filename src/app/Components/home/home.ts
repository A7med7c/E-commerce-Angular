import { HttpErrorResponse } from '@angular/common/http';
import { ProductService } from './../../Core/Services/product-service';
import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { IProducts } from '../../Core/Interfaces/iproducts';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit, OnDestroy {


  //Injections
  private readonly _productService = inject(ProductService)
  private readonly _cdr = inject(ChangeDetectorRef)

  //properties
  productList: IProducts[] = []
  productsSubscribtion!: Subscription

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
  }

  // called in exit the component so we make unsubscribe here 
  ngOnDestroy(): void {
    this.productsSubscribtion?.unsubscribe();
  }
}
