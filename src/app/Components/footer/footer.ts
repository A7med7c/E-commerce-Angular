import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TranslationService } from '../../Core/Services/translation-service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  private readonly _translationService = inject(TranslationService);
}
