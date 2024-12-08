import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { UserService } from '../user.service'; // Import UserService

@Component({
  selector: 'app-my-auctions',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './my-auctions.component.html',
  styleUrls: ['./my-auctions.component.css']
})
export class MyAuctionsComponent implements OnInit, OnDestroy {
  username: string = '';  // Username will be fetched from UserService
  auctions: any[] = [];
  bidDetails: { [key: string]: any[] } = {};
  timerInterval: any;

  constructor(private http: HttpClient, private userService: UserService) {}

  ngOnInit(): void {
    const user = this.userService.getUser();
    if (user && user.name) {
      this.username = user.name.replace(/\s+/g, '');  // Remove spaces from username
      this.fetchAuctions();
    } else {
      console.error('No username found in UserService.');
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
  }

  fetchAuctions(): void {
    if (this.username.trim()) {
      this.http.get<any[]>(`http://localhost:8080/api/auctions/name/${this.username}`)
        .subscribe((data) => {
          this.auctions = data.map(auction => ({
            ...auction,
            imageUrl: auction.imageUrl,
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
    const url = `http://localhost:8080/api/highestBids/itemName/${itemName}`;
    console.log("Fetching highest bids from URL: ", url);
  
    // Check for highest bid if the item is sold
    if (isSold) {
      this.http.get<any>(url)  // Expecting an object, not an array
        .subscribe((data) => {
          console.log('Highest Bid Data:', data);
          if (data && data.itemName) {
            // If a highest bid exists, display it
            this.bidDetails[itemName] = [{
              itemName: data.itemName,
              userName: data.userName,
              highestBidAmount: data.highestBidAmount,
              payment: data.payment || 'Not Available'
            }];
          } else {
            // If no highest bid, check for regular bids
            this.bidDetails[itemName] = [{ message: 'No highest bids available, showing regular bids.' }];
            this.fetchRegularBids(itemName); // Fetch regular bids if no highest bid
          }
        }, (error) => {
          console.error('Error fetching highest bids:', error);
        });
    } else {
      // If the item is not sold, show regular bids
      this.fetchRegularBids(itemName);
    }
  }
  
  // Helper function to fetch regular bids
  fetchRegularBids(itemName: string): void {
    const url = `http://localhost:8080/api/bids/itemName/${itemName}`;
    this.http.get<any[]>(url)
      .subscribe((data) => {
        console.log('Regular Bids:', data);
        if (data && data.length > 0) {
          this.bidDetails[itemName] = data;
        } else {
          this.bidDetails[itemName] = [{ message: 'No bids available for this item.' }];
        }
      }, (error) => {
        console.error('Error fetching regular bids:', error);
      });
  }
  
}
