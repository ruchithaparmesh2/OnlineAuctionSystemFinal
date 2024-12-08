import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarAdminComponent } from '../navbar-admin/navbar-admin.component';


@Component({
  selector: 'app-all-auctions',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarAdminComponent],
  templateUrl: './manage-auctions.component.html',
  styleUrls: ['./manage-auctions.component.css']
})
export class ManageAuctionsComponent implements OnInit, OnDestroy {
  auctions: any[] = [];
  timerInterval: any;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchAuctions();
    this.startTimer();
  }

  ngOnDestroy(): void {
    clearInterval(this.timerInterval);
  }

  fetchAuctions(): void {
    this.http.get<any[]>('http://localhost:8080/api/auctions')
      .subscribe((data) => {
        this.auctions = data.map(auction => ({
          ...auction,
          imageUrl: auction.imageUrl
        }));
        this.auctions.forEach(auction => {
          // Fetch highest bid details when the auction time ends
          this.fetchHighestBid(auction.itemName);
        });
      }, (error) => {
        console.error('Error fetching auctions:', error);
      });
  }

  getRemainingTime(endDateTime: string): string {
    const endTime = new Date(endDateTime);
    const timeDiff = endTime.getTime() - new Date().getTime();
    
    if (timeDiff <= 0) {
      return "Item Sold";
    }
  
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));  // Calculate days
    const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
    const seconds = Math.floor((timeDiff / 1000) % 60);
  
    // Adjust the format to include days
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
  

  startTimer(): void {
    this.timerInterval = setInterval(() => {
      this.auctions = this.auctions.map(auction => ({
        ...auction,
        remainingTime: this.getRemainingTime(auction.auctionEndDate + 'T' + auction.auctionEndTime)
      }));
    }, 1000);
  }

  fetchHighestBid(itemName: string): void {
    this.http.get<any[]>(`http://localhost:8080/api/bids/itemName/${itemName}`)
      .subscribe((data) => {
        if (data.length > 0) {
          const highestBid = data.reduce((prev, current) => (prev.bidAmount > current.bidAmount) ? prev : current);
          
          // Send highest bid details to the endpoint
          this.sendHighestBidToServer(highestBid);
          
          // Update auction object with the highest bid details, but keep the existing payment status
          const auction = this.auctions.find(auction => auction.itemName === itemName);
          if (auction) {
            auction.highestBidUserName = highestBid.userName || 'No bids yet';
            auction.highestBidAmount = highestBid.bidAmount;

            // Keep the existing payment status or set it to 'no' if no payment status exists
            auction.payment = auction.payment || 'no'; 
          }
        }
      }, (error) => {
        console.error('Error fetching highest bid:', error);
      });
  }

  sendHighestBidToServer(highestBid: any): void {
    this.http.get<any>(`http://localhost:8080/api/highestBids/itemName/${highestBid.itemName}`)
      .subscribe((existingBid) => {
        const paymentStatus = existingBid?.payment === 'yes' ? 'yes' : 'no';
  
        const highestBidData = {
          itemName: highestBid.itemName,
          userName: highestBid.userName || 'No bids yet',
          highestBidAmount: highestBid.bidAmount,
          payment: paymentStatus
        };
  
        this.http.post('http://localhost:8080/api/highestBids', highestBidData)
          .subscribe(() => {
            console.log('Highest bid sent successfully');
          }, (error) => {
            console.error('Error sending highest bid:', error);
          });
      }, (error) => {
        console.error('Error fetching existing bid:', error);
      });
  }

  onBid(itemId: string, bidAmount: number): void {
    const selectedAuction = this.auctions.find(auction => auction.id === itemId);
    if (selectedAuction) {
      this.router.navigate(['/place-bid'], { state: { auction: selectedAuction } });
    }
  }
  deleteAuction(itemName: string): void {
    this.http.delete(`http://localhost:8080/api/auctions/deleteItem/${itemName}`)
      .subscribe(() => {
        // Remove the deleted auction from the local list
        this.auctions = this.auctions.filter(auction => auction.itemName !== itemName);
        console.log('Auction deleted successfully');
      }, (error) => {
        console.error('Error deleting auction:', error);
      });
  }
  
  
}
