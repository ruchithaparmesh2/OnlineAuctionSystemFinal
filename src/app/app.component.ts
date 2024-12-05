import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainpageComponent } from './mainpage/mainpage.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MainpageComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], // Corrected from styleUrl
})
export class AppComponent {
  title = 'book_system';
}
