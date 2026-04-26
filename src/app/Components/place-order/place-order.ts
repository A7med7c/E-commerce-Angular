import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '../../Core/Services/orders-service';

@Component({
  selector: 'app-place-order',
  imports: [ReactiveFormsModule],
  templateUrl: './place-order.html',
  styleUrl: './place-order.scss',
})
export class PlaceOrder implements OnInit {

  private readonly _formBuilder = inject(FormBuilder)
  private readonly _activatedRoute = inject(ActivatedRoute)
  private readonly _ordersService = inject(OrdersService)

  cartId: string | null = ''
  orderDetails: FormGroup = this._formBuilder.group({

    details: [null],
    phone: [null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
    city: [null, Validators.required]
  }

  )

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe({
      next: (params) => {
        this.cartId = params.get('id');
      }
    })
  }

  submitOrderDetails(): void {
    this._ordersService.checkout(this.cartId, this.orderDetails.value).subscribe({
      next: (res) => {
        window.open(res.session.url, '_self');
      },
      error: (err) => {
        console.log(err);

      }
    })
  }
}
