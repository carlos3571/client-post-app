import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'header-front',
  imports: [ RouterLink],
  templateUrl: './header-front.component.html',
  styleUrl: './header-front.component.css'
})
export class HeaderFrontComponent {
  authService = inject(AuthService);

}
