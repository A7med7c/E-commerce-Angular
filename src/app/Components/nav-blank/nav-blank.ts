import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../Core/Services/auth-service';
import { TranslatePipe } from '@ngx-translate/core';
import { TranslationService } from '../../Core/Services/translation-service';

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


