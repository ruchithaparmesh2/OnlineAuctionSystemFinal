import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';
import { Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  user: any;
  activeLink: string = '';
  hasNewNotification = false;

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.setActiveLink();

    this.router.events
      .pipe(filter(event => event.constructor.name === 'NavigationEnd'))
      .subscribe(() => {
        this.setActiveLink();
      });

    this.fetchUserDataFromOAuth();

    this.notificationService.trigger$.subscribe(trigger => {
      if (trigger) {
        this.hasNewNotification = true;

        setTimeout(() => {
          this.hasNewNotification = false;
          this.notificationService.resetTrigger();
        }, 3000);
      }
    });
  }

  setActiveLink() {
    if (this.router.url.includes('all-auctions')) {
      this.activeLink = 'all-auctions';
    } else if (this.router.url.includes('add-item')) {
      this.activeLink = 'add-item';
    } else if (this.router.url.includes('my-bids')) {
      this.activeLink = 'my-bids';
    } else if (this.router.url.includes('my-auctions')) {
      this.activeLink = 'my-auctions';
    }
  }

  fetchUserDataFromOAuth() {
    this.http
      .get('http://localhost:8080/oauth-success', { withCredentials: true })
      .subscribe(
        (data: any) => {
          this.user = data;
          this.saveUser();
        },
        error => {
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
