import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../Core/Services/auth-service';
import { TranslatePipe } from '@ngx-translate/core';
import { TranslationService } from '../../Core/Services/translation-service';
import { CartService } from '../../Core/Services/cart-service';
import { map } from 'rxjs';

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

  readonly currentLang = toSignal(
    this._translationService.getCurrentLang$().pipe(
      map(() => this._translationService.getCurrentLang())
    ),
    { initialValue: this._translationService.getCurrentLang() }
  );
  cartItemsNumber: Signal<number> = computed(() => this._cartService.itemsNumber());

  ngOnInit(): void {
    this._cartService.refreshItemsCount();
  }

  changeLang(lang: Lang): void {
    this._translationService.useLanguage(lang);
  }
}


