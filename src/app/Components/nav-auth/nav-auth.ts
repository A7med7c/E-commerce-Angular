import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslationService } from '../../Core/Services/translation-service';
import { TranslatePipe } from '@ngx-translate/core';
import { map } from 'rxjs';
type Lang = 'en' | 'ar';


@Component({
  selector: 'app-nav-auth',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './nav-auth.html',
  styleUrl: './nav-auth.scss',
})
export class NavAuth {

  private readonly _translationService = inject(TranslationService);

  readonly currentLang = toSignal(
    this._translationService.getCurrentLang$().pipe(
      map(() => this._translationService.getCurrentLang())
    ),
    { initialValue: this._translationService.getCurrentLang() }
  );

  changeLang(lang: Lang): void {
    this._translationService.useLanguage(lang);
  }
}
