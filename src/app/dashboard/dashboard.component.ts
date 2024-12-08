import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';
import { NavbarAdminComponent } from '../navbar-admin/navbar-admin.component';

@Component({
  standalone:true,
  selector: 'app-dashboard',
  
 imports: [NavbarAdminComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
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
          console.log('User saved successfully:', response);
        },
        error: (error) => {
          console.error('Error saving user:', error);
        },
      });
    } else {
      console.error('Incomplete user data. Cannot save to backend.');
    }
  }
}
