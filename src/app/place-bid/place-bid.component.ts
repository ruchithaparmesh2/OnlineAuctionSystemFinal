import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule,NavbarComponent],
  selector: 'app-place-bid',
  templateUrl: './place-bid.component.html',
  styleUrls: ['./place-bid.component.css']
})
export class PlaceBidComponent implements OnInit {
  auction: any;
  previousBids: any[] = [];
  bidAmount: number = 0;
  userName: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    console.log('Auction data from router state:', history.state);

    // Access auction data passed via the router's state
    this.auction = history.state?.auction;

    if (!this.auction) {
      console.error('Auction data not found!');
      this.router.navigate(['/all-auctions']);
      return;
    }

    this.fetchPreviousBids();
  }

  fetchPreviousBids(): void {
    this.http.get<any[]>(`http://localhost:8080/api/bids/itemName/${this.auction.itemName}`)
      .subscribe(
        (data) => {
          this.previousBids = data;
        },
        (error) => {
          console.error('Error fetching previous bids:', error);
        }
      );
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
