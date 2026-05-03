import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../Core/Services/auth-service';
import { TranslatePipe } from '@ngx-translate/core';
import { TranslationService } from '../../Core/Services/translation-service';
import { CartService } from '../../Core/Services/cart-service';

type Lang = 'en' | 'ar';

@Component({
  selector: 'app-nav-blank',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './nav-blank.html',
  styleUrl: './nav-blank.scss',
})

export class NavBlank implements OnInit {

  readonly _authService = inject(AuthService);
  private readonly _cartService = inject(CartService);
  private readonly _translationService = inject(TranslationService);

  currentLang: string = 'en';
  cartItemsNumber: number = 0;

  ngOnInit(): void {
    this.currentLang = this._translationService.getCurrentLang();
    this._translationService.getCurrentLang$().subscribe(() => {
      this.currentLang = this._translationService.getCurrentLang();
    });

    this._cartService.getitems().subscribe({
      next: (res) => {
        this._cartService.itemsNumber.next(res.numOfCartItems);
      }
    });

    this._cartService.itemsNumber.subscribe({
      next: (data) => {
        this.cartItemsNumber = data
      }
    })
  }

  changeLang(lang: Lang): void {
    this._translationService.useLanguage(lang);
    this.currentLang = lang;
  }
}


