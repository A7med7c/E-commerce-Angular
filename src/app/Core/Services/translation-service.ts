import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {

  private readonly _translateService = inject(TranslateService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _document = inject(DOCUMENT);
  private readonly _supportedLangs = ['en', 'ar'] as const;
  private readonly _defaultLang = 'en';
  constructor() {
    this.init();
  }

  private init(): void {
    this._translateService.addLangs([...this._supportedLangs]);
    this._translateService.setDefaultLang(this._defaultLang);

    const storedLanguage = this.getStoredLanguage();
    const language = storedLanguage ?? this._defaultLang;
    this.useLanguage(language);
  }

  private getStoredLanguage(): string | null {
    if (!isPlatformBrowser(this._platformId)) {
      return null;
    }

    const stored = localStorage.getItem('lang');
    if (stored && this._supportedLangs.includes(stored as (typeof this._supportedLangs)[number])) {
      return stored;
    }

    return null;
  }

  useLanguage(language: string): void {
    const normalized = this._supportedLangs.includes(language as (typeof this._supportedLangs)[number])
      ? language
      : this._defaultLang;

    this._translateService.use(normalized);
    this.changeDirection(normalized);

    if (isPlatformBrowser(this._platformId)) {
      localStorage.setItem('lang', normalized);
    }
  }

  private changeDirection(language: string): void {
    if (!isPlatformBrowser(this._platformId)) {
      return;
    }

    const dir = language === 'ar' ? 'rtl' : 'ltr';
    this._document.documentElement.dir = dir;
  }
}
