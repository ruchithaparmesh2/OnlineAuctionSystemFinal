import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserService } from '../user.service';  // Ensure UserService is correctly imported
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-place-bid',
  standalone: true,
  imports: [NavbarComponent, CommonModule, FormsModule],
  templateUrl: './place-bid.component.html',
  styleUrls: ['./place-bid.component.css']
})
export class PlaceBidComponent implements OnInit {
  auction: any;
  previousBids: any[] = [];
  bidAmount: number = 0;
  userName: string = '';  // Username fetched from UserService

  constructor(
    private http: HttpClient, 
    private router: Router, 
    private userService: UserService
  ) {}

  ngOnInit(): void {
    console.log('Auction data from router state:', history.state);

    // Access auction data passed via the router's state
    this.auction = history.state?.auction;

    if (!this.auction) {
      console.error('Auction data not found!');
      this.router.navigate(['/all-auctions']);
      return;
    }

    // Fetch user data and proceed once it's available
    this.userService.fetchUserData().subscribe(user => {
      if (user && user.name) {
        this.userName = user.name.replace(/\s+/g, '');  // Remove spaces from username
        console.log('Username fetched:', this.userName);  // Add this for debugging
      } else {
        console.error('No username found in UserService.');
      }

      this.fetchPreviousBids();  // Proceed with fetching bids once user data is available
    });
  }

  fetchPreviousBids(): void {
    this.http.get<any[]>(`http://localhost:8080/api/bids/itemName/${this.auction.itemName}`)
      .subscribe(
        (data) => {
          this.previousBids = data.map(bid => {
            // Simplify the bidTime into a more readable format
            if (bid.bidTime) {
              bid.bidTime = this.formatDate(bid.bidTime);
            }
            return bid;
          });
        },
        (error) => {
          console.error('Error fetching previous bids:', error);
        }
      );
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      weekday: 'short',  // Short weekday (e.g., Mon)
      year: 'numeric',  // Full year (e.g., 2024)
      month: 'short',   // Short month (e.g., Dec)
      day: 'numeric',   // Day of the month (e.g., 7)
      hour: '2-digit',  // Hour in 2 digits (e.g., 08)
      minute: '2-digit',// Minute in 2 digits (e.g., 05)
      hour12: true      // 12-hour format (AM/PM)
    });
  }

  submitBid(): void {
    const bidData = {
      userName: this.userName,
      itemName: this.auction.itemName,
      bidAmount: this.bidAmount
    };

    this.http.post('http://localhost:8080/api/bids', bidData)
      .subscribe(
        () => {
          this.router.navigate(['/all-auctions']);
        },
        (error) => {
          console.error('Error submitting bid:', error);
        }
      );
  }
}
