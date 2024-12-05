import { Component } from '@angular/core';

@Component({
  selector: 'app-login-user',
  standalone: true,
  imports: [],
  templateUrl: './login-user.component.html',
  styleUrl: './login-user.component.css'
})
export class LoginUserComponent {
  loginWithGoogle() {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
}
}
