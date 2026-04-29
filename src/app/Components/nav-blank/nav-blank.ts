import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../Core/Services/auth-service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-nav-blank',
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './nav-blank.html',
  styleUrl: './nav-blank.scss',
})
export class NavBlank {
  readonly _authService = inject(AuthService);


}
