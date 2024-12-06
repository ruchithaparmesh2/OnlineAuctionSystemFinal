import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-my-bids',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule,NavbarComponent],
  templateUrl: './my-bids.component.html',
  styleUrl: './my-bids.component.css',
})
export class MyBidsComponent {
  username: string = '';
  bids: any[] = [];
  wonBids: any[] = [];

  constructor(private http: HttpClient) {}

  fetchBidDetails() {
    if (!this.username.trim()) {
      alert('Username cannot be empty!');
      return;
    }

    // Fetch all bids
    const allBidsUrl = `http://localhost:8080/api/bids/name/${this.username}`;
    this.http.get<any[]>(allBidsUrl).subscribe(
      (response) => {
        if (response && response.length > 0) {
          this.bids = response.map((bid) => ({
            itemName: bid.itemName,
            bidAmount: bid.bidAmount,  // Only include bidAmount
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

    // Fetch won bids
    const wonBidsUrl = `http://localhost:8080/api/highestBids/name/${this.username}`;
    this.http.get<any[]>(wonBidsUrl).subscribe(
      (response) => {
        if (response && response.length > 0) {
          this.wonBids = response.map((bid) => ({
            itemName: bid.itemName,
            bidAmount: bid.highestBidAmount,  // Only include bidAmount
          }));
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

  goToPayment(bid: any) {
    // Navigate to payment page with the bid information
    console.log('Going to payment for:', bid);
    // You can add your routing logic here, e.g., this.router.navigate(['/payment', bid.id]);
  }
  handleImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'default-image.jpg';
  }
  
}
