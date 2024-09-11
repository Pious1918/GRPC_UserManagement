import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { RegistrationComponent } from './component/registration/registration.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet , RegistrationComponent , RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Frontend';
}
