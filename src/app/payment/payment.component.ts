import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  itemName: string = '';
  username: string = '';
  bidAmount: number = 0;
  ownerName: string = '';
  paymentSuccess: boolean = false;

  constructor(
    private route: ActivatedRoute,  // ActivatedRoute is injected correctly
    private http: HttpClient,       // HttpClient is injected for API calls
    private router: Router          // Router is injected for navigation
  ) {}

  ngOnInit(): void {
    // Fetch query parameters and log them for debugging
    this.route.queryParams.subscribe((params) => {
      this.itemName = params['itemName'];
      this.username = params['username'];
      this.bidAmount = +params['bidAmount']; // Convert to number

      // Log the received parameters
      console.log('Received parameters:', this.itemName, this.username, this.bidAmount);

      // Fetch owner details using itemName
      const auctionUrl = `http://localhost:8080/api/auctions/itemName/${this.itemName}`;
      this.http.get<any>(auctionUrl).subscribe(
        (response) => {
          if (response && response.userName) {
            this.ownerName = response.userName;
            console.log('Owner Name fetched:', this.ownerName); // Log owner name for verification
          } else {
            console.error('Owner not found.');
          }
        },
        (error) => {
          console.error('Error fetching owner details:', error);
        }
      );
    });
  }

  doPayment() {
    const updatePaymentUrl = `http://localhost:8080/api/highestBids/updatePayment?itemName=${this.itemName}&payment=yes`;
  
    this.http.put(updatePaymentUrl, {}, { responseType: 'text' }).subscribe(
      (response) => {
        console.log('Payment field updated to "yes" in database.', response);
        this.paymentSuccess = true;
  
        setTimeout(() => {
          alert('Congratulations! Payment successful! You won the auction!');
          this.router.navigate(['/my-bids']);
        }, 500);
      },
      (error) => {
        console.error('Error updating payment field:', error);
        alert('There was an error processing your payment. Please try again.');
      }
    );
  }
  
  
  
}
