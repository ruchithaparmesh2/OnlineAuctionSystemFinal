import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user: any;

  constructor(
    private http: HttpClient,
    private userService: UserService,
  
  ) {}

  ngOnInit(): void {
    this.fetchUserDataFromOAuth();
  }

  fetchUserDataFromOAuth() {
    // Make sure the endpoint is correctly responding and handling OAuth2
    this.http.get('http://localhost:8080/oauth-success', { withCredentials: true })
      .subscribe(
        (data: any) => {
          this.user = data;
          
          this.saveUser();
        },
        (error) => {
          console.error('Error fetching user data from OAuth:', error);
          alert('Error fetching user data. Please check the backend or OAuth2 configuration.');
        }
      );
  }

  saveUser() {
    if (this.user && this.user.name && this.user.email) {
      this.userService.saveUser(this.user).subscribe({
        next: (response) => {
          console.log('User saved successfully:', response);
        },
        error: (error) => {
          console.error('Error saving user:', error);
         // alert('Error saving user. Please check the backend or API configuration.');
        },
      });
    } else {
      console.error('Incomplete user data. Cannot save to backend.');
    //  alert('User data is incomplete.');
    }
  }
}
