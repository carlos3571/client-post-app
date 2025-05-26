import { Component, signal } from '@angular/core';

@Component({
  selector: 'footer-front',
  imports: [],
  templateUrl: './footer-front.component.html',
  styleUrl: './footer-front.component.css'
})
export class FooterFrontComponent {
  currentYear = signal(new Date().getFullYear());
}
