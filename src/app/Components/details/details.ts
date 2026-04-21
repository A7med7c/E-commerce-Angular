import { ActivatedRoute } from '@angular/router';
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProductService } from '../../Core/Services/product-service';
import { HttpErrorResponse } from '@angular/common/http';
import { IProducts } from '../../Core/Interfaces/iproducts';

@Component({
  selector: 'app-details',
  imports: [],
  templateUrl: './details.html',
  styleUrl: './details.scss',
})
export class Details implements OnInit {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _productService = inject(ProductService);
  private readonly _cdr = inject(ChangeDetectorRef);

  productDetails: IProducts | null = null;

  ngOnInit(): void {
    const productId = this._activatedRoute.snapshot.paramMap.get('id');

    if (!productId) return;

    this._productService.getProduct(productId).subscribe({
      next: (res) => {
        this.productDetails = res.data;
        this._cdr.detectChanges();
      },
      error: (err: HttpErrorResponse) => console.log(err.message)
    });
  }
}