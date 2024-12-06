import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';
import { Router, RouterModule } from '@angular/router';

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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchUserDataFromOAuth();
  }

  fetchUserDataFromOAuth() {
    this.http.get('http://localhost:8080/oauth-success', { withCredentials: true })
      .subscribe(
        (data: any) => {
          this.user = data;
          this.saveUser();
        },
        (error) => {
          console.error('Error fetching user data from OAuth:', error);
        }
      );
  }

  saveUser() {
    if (this.user && this.user.name && this.user.email) {
      this.userService.setUserName(this.user.name);
      console.log('User data saved successfully.');
    } else {
      console.error('Incomplete user data.');
    }
  }
}
