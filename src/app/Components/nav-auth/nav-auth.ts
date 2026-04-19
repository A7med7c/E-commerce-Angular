import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-nav-auth',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav-auth.html',
  styleUrl: './nav-auth.scss',
})
export class NavAuth { }
