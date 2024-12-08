import { Component } from '@angular/core';
import { NotificationService } from '../notification.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { UserService } from '../user.service'; // Import UserService

@Component({
  selector: 'app-add-item',
  standalone: true,
  imports: [NavbarComponent, FormsModule],
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent {
  auction = {
    userName: '', // This will be automatically populated
    category: '',
    itemName: '',
    startingPrice: 0,
    auctionDate: '',
    auctionStartTime: '',
    auctionEndDate: '',
    auctionEndTime: '',
    imageUrl: '',
  };

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private userService: UserService // Inject the UserService
  ) {
    // Fetch the user name from the UserService
    this.userService.user$.subscribe(user => {
      if (user) {
        this.auction.userName = user.name; // Automatically set userName
      }
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.auction.imageUrl = file.name;
    }
  }

  onSubmit(form: NgForm) {
    // Prepare the auction data
    const auctionData = {
      ...this.auction,
      startingPrice: parseFloat(this.auction.startingPrice.toString()), // Ensure correct data format
    };

    // Make an HTTP POST request to save auction data
    this.http.post('http://localhost:8080/api/auctions/add', auctionData).subscribe(
      response => {
        console.log('Auction saved:', response);
        this.notificationService.addNotification(
          `New item "${this.auction.itemName}" added at ${new Date().toLocaleTimeString()}`
        );
        
        // Reset the form manually
        form.reset(); // This resets the form state
        this.auction.imageUrl = ''; // Reset imageUrl explicitly
        this.auction.category = ''; // Reset other fields explicitly, if needed
        this.auction.itemName = '';
        this.auction.startingPrice = 0;
        this.auction.auctionDate = '';
        this.auction.auctionStartTime = '';
        this.auction.auctionEndDate = '';
        this.auction.auctionEndTime = '';
      },
      error => {
        console.error('Error saving auction:', error);
      }
    );
  }
}
