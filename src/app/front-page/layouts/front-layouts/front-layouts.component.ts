import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderFrontComponent } from '../../components/header-front/header-front.component';
import { FooterFrontComponent } from '../../components/footer-front/footer-front.component';

@Component({
  selector: 'app-front-layouts',
  imports: [RouterOutlet, HeaderFrontComponent, FooterFrontComponent],
  templateUrl: './front-layouts.component.html',
  styleUrl: './front-layouts.component.css'
})
export class FrontLayoutsComponent {

}
