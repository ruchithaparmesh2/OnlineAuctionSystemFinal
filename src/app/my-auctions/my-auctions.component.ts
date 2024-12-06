import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-my-auctions',
  standalone: true,
  imports: [CommonModule, FormsModule,NavbarComponent],
  templateUrl: './my-auctions.component.html',
  styleUrls: ['./my-auctions.component.css']
})
export class MyAuctionsComponent implements OnInit, OnDestroy {
  username: string = '';
  auctions: any[] = [];
  bidDetails: { [key: string]: any[] } = {};
  timerInterval: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
  }

  fetchAuctions(): void {
    if (this.username.trim()) {
      this.http.get<any[]>(`http://localhost:8080/api/auctions/name/${this.username}`)
        .subscribe((data) => {
          this.auctions = data.map(auction => ({
            ...auction,
            imageUrl: auction.imageUrl
          }));
          this.startTimer();
        }, (error) => {
          console.error('Error fetching auctions for username:', error);
        });
    }
  }

  getRemainingTime(endDateTime: string): string {
    const endTime = new Date(endDateTime);
    const timeDiff = endTime.getTime() - new Date().getTime();
    if (timeDiff <= 0) {
      return "Item Sold";
    }

    const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
    const seconds = Math.floor((timeDiff / 1000) % 60);
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  startTimer(): void {
    this.timerInterval = setInterval(() => {
      this.auctions = this.auctions.map(auction => ({
        ...auction,
        remainingTime: this.getRemainingTime(auction.auctionEndDate + 'T' + auction.auctionEndTime)
      }));
    }, 1000);
  }

  checkBidsForItem(itemName: string, isSold: boolean): void {
    if (isSold) {
      this.http.get<any[]>(`http://localhost:4200/api/highestBids/itemName/${itemName}`)
        .subscribe((data) => {
          this.bidDetails[itemName] = data.length ? data : [{ message: 'No highest bids available for this item.' }];
        }, (error) => {
          console.error('Error fetching highest bids:', error);
        });
    } else {
      this.http.get<any[]>(`http://localhost:4200/api/bids/itemName/${itemName}`)
        .subscribe((data) => {
          this.bidDetails[itemName] = data.length ? data : [{ message: 'No bids available for this item.' }];
        }, (error) => {
          console.error('Error fetching bids:', error);
        });
    }
  }
}
