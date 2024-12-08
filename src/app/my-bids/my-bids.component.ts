import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-bids',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, NavbarComponent],
  templateUrl: './my-bids.component.html',
  styleUrls: ['./my-bids.component.css'],
})
export class MyBidsComponent implements OnInit {
  username: string = '';
  bids: any[] = [];
  wonBids: any[] = [];
  finalWonBids: any[] = [];

  constructor(private http: HttpClient, private userService: UserService,private router: Router) {}

  ngOnInit(): void {
    this.userService.fetchUserData().subscribe((user) => {
      if (user && user.name) {
        this.username = user.name.replace(/\s+/g, '');
        this.fetchBidDetails();
      } else {
        console.error('No user data found.');
      }
    });
  }

  fetchBidDetails() {
    if (!this.username.trim()) {
      alert('Username cannot be empty!');
      return;
    }

    const allBidsUrl = `http://localhost:8080/api/bids/name/${this.username}`;
    this.http.get<any[]>(allBidsUrl).subscribe(
      (response) => {
        if (response && response.length > 0) {
          this.bids = response.map((bid) => ({
            itemName: bid.itemName,
            bidAmount: bid.bidAmount,
            bidTime: new Date(bid.bidTime).toLocaleString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }),
          }));
        } else {
          this.bids = [];
          alert('No bids found for this username.');
        }
      },
      (error) => {
        console.error('Error fetching bid details:', error);
        alert('Failed to fetch bid details. Please try again.');
      }
    );

    const wonBidsUrl = `http://localhost:8080/api/highestBids/name/${this.username}`;
    this.http.get<any[]>(wonBidsUrl).subscribe(
      (response) => {
        if (response && response.length > 0) {
          this.wonBids = response.map((bid) => ({
            itemName: bid.itemName,
            bidAmount: bid.highestBidAmount,
          }));
          this.checkAuctionEndDates();
        } else {
          this.wonBids = [];
          alert('No won bids found for this username.');
        }
      },
      (error) => {
        console.error('Error fetching won bid details:', error);
        alert('Failed to fetch won bid details. Please try again.');
      }
    );
  }

  checkAuctionEndDates() {
    const now = new Date();
    this.finalWonBids = [];
  
    this.wonBids.forEach((bid) => {
      const auctionUrl = `http://localhost:8080/api/auctions/itemName/${bid.itemName}`;
      this.http.get<any>(auctionUrl).subscribe(
        (auction) => {
          if (auction && auction.auctionEndDate && auction.auctionEndTime) {
            const endDateTime = new Date(`${auction.auctionEndDate}T${auction.auctionEndTime}`);
            if (endDateTime <= now) {
              const highestBidUrl = `http://localhost:8080/api/highestBids/itemName/${bid.itemName}`;
              this.http.get<any>(highestBidUrl).subscribe(
                (highestBid) => {
                  if (highestBid) {
                    this.finalWonBids.push({
                      ...bid,
                      auctionEndDate: auction.auctionEndDate,
                      auctionEndTime: auction.auctionEndTime,
                      payment: highestBid.payment // Include payment field from highestBid
                    });
                  }
                },
                (error) => {
                  console.error(`Error fetching highest bid for ${bid.itemName}:`, error);
                }
              );
            }
          }
        },
        (error) => {
          console.error(`Error fetching auction details for ${bid.itemName}:`, error);
        }
      );
    });
  }
  
  goToPayment(bid: any) {
    this.router.navigate(['/payment'], {
      queryParams: {
        itemName: bid.itemName,
        username: this.username,
        bidAmount: bid.bidAmount,
      },
    });
  }

  handleImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'default-image.jpg';
  }
}
