
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-dashboard-user',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './dashboard-user.component.html',
  styleUrl: './dashboard-user.component.css'
})
export class DashboardUserComponent implements OnInit{
  user: any; // To store the real user data

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.fetchUserDataFromOAuth();
  }
  fetchUserDataFromOAuth() {
    this.http
      .get('http://localhost:8080/oauth-success', { withCredentials: true })
      .subscribe(
        (data: any) => {
          this.user = data; // Assign data from /oauth-success endpoint
          this.saveUser(); // Save user data to the backend
        },
        (error) => {
          console.error('Error fetching user data from OAuth:', error);
        }
      );
  }

  saveUser() {
    if (this.user && this.user.name && this.user.email) {
      this.userService.saveUser(this.user).subscribe({
        next: (response) => {
          // Check if the response is in the expected JSON format
          if (response && typeof response === 'object' && response['status'] === 'success') {
            console.log('User saved successfully:', response);
          } else {
            console.error('Unexpected response format:', response);
           // alert('Unexpected response received from server. Please contact support.');
          }
        },
        error: (error) => {
          console.error('Error saving user:', error);
          //alert('Error saving user. Please check the backend or API configuration.');
        },
      });
    } else {
      console.error('Incomplete user data. Cannot save to backend.');
     // alert('Incomplete user data. Please check the input.');
    }
  }
  
}
