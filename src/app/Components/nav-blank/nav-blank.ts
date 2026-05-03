import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../Core/Services/auth-service';
import { TranslatePipe } from '@ngx-translate/core';
import { TranslationService } from '../../Core/Services/translation-service';
import { CartService } from '../../Core/Services/cart-service';

type Lang = 'en' | 'ar';

@Component({
  selector: 'app-nav-blank',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslatePipe, AsyncPipe],
  templateUrl: './nav-blank.html',
  styleUrl: './nav-blank.scss',
})

export class NavBlank implements OnInit {

  readonly _authService = inject(AuthService);
  private readonly _cartService = inject(CartService);
  private readonly _translationService = inject(TranslationService);
  private readonly _destroyRef = inject(DestroyRef);

  currentLang: string = 'en';
  cartItemsNumber$ = this._cartService.itemsNumber$;

  ngOnInit(): void {
    this.currentLang = this._translationService.getCurrentLang();
    this._translationService.getCurrentLang$()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(() => {
        this.currentLang = this._translationService.getCurrentLang();
      });

    this._cartService.refreshItemsCount();
  }

  changeLang(lang: Lang): void {
    this._translationService.useLanguage(lang);
    this.currentLang = lang;
  }
}


