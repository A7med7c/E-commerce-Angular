import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../Core/Services/auth-service';

@Component({
  selector: 'app-nav-blank',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-blank.html',
  styleUrl: './nav-blank.scss',
})
export class NavBlank {
  readonly _authService = inject(AuthService);
}
