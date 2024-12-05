import { Component } from '@angular/core';

@Component({
  selector: 'app-login-admin',
  standalone: true,
  imports: [],
  templateUrl: './login-admin.component.html',
  styleUrl: './login-admin.component.css'
})
export class LoginAdminComponent {
  loginWithGoogle() {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
}
}
