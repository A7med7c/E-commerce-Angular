import { HttpErrorResponse } from '@angular/common/http';
import { ProductService } from './../../Core/Services/product-service';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { IProducts } from '../../Core/Interfaces/iproducts';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private readonly _productService = inject(ProductService)
  private readonly _cdr = inject(ChangeDetectorRef)
  productList: IProducts[] = []
  ngOnInit(): void {
    this._productService.getAllProducts().subscribe({
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

}
