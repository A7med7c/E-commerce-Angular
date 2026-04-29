import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { LangChangeEvent } from '@ngx-translate/core';
type Lang = 'en' | 'ar';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {

  private readonly _translateService = inject(TranslateService);
  private readonly _platformId = inject(PLATFORM_ID);
  private readonly _document = inject(DOCUMENT);

  private readonly _supportedLangs: Lang[] = ['en', 'ar'];
  private readonly _defaultLang: Lang = 'en';

  constructor() {
    this.init();
  }



  private init(): void {
    this._translateService.addLangs(this._supportedLangs);
    this._translateService.setDefaultLang(this._defaultLang);
    this._translateService.setFallbackLang(this._defaultLang);

    const stored = this.getStoredLanguage();
    this.useLanguage(stored ?? this._defaultLang);
  }

  getCurrentLang(): Lang {
    return (this._translateService.currentLang as Lang) || this._defaultLang;
  }

  getLangChange$() {
    return this._translateService.onLangChange;
  }
  getCurrentLang$(): Observable<LangChangeEvent> {
    return this._translateService.onLangChange;
  }

  useLanguage(language: Lang): void {
    const normalized = this.normalizeLang(language);

    this._translateService.use(normalized);
    this.updateDocument(normalized);

    if (isPlatformBrowser(this._platformId)) {
      localStorage.setItem('lang', normalized);
    }
  }

  private normalizeLang(lang: string): Lang {
    return this._supportedLangs.includes(lang as Lang)
      ? (lang as Lang)
      : this._defaultLang;
  }

  private getStoredLanguage(): Lang | null {
    if (!isPlatformBrowser(this._platformId)) return null;

    const stored = localStorage.getItem('lang');
    return this._supportedLangs.includes(stored as Lang)
      ? (stored as Lang)
      : null;
  }

  private updateDocument(language: Lang): void {
    if (!isPlatformBrowser(this._platformId)) return;

    const dir = language === 'ar' ? 'rtl' : 'ltr';

    this._document.documentElement.dir = dir;
    this._document.documentElement.lang = language;
  }
}