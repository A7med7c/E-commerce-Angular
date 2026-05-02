import { Component, inject, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TranslationService } from '../../Core/Services/translation-service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer implements OnInit {
  private readonly _translationService = inject(TranslationService);

  currentLang: string = 'en';

  ngOnInit(): void {
    this.currentLang = this._translationService.getCurrentLang();

    this._translationService.getCurrentLang$().subscribe(() => {
      this.currentLang = this._translationService.getCurrentLang();
    });
  }
}
