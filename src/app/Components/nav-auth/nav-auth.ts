import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslationService } from '../../Core/Services/translation-service';
type Lang = 'en' | 'ar';


@Component({
  selector: 'app-nav-auth',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-auth.html',
  styleUrl: './nav-auth.scss',
})
export class NavAuth {

  private readonly _translationService = inject(TranslationService);

  currentLang: string = 'en';

  ngOnInit(): void {
    this.currentLang = this._translationService.getCurrentLang();

    this._translationService.getCurrentLang$().subscribe(() => {
      this.currentLang = this._translationService.getCurrentLang();
    });
  }

  changeLang(lang: Lang): void {
    this._translationService.useLanguage(lang);
    this.currentLang = lang;
  }
}
