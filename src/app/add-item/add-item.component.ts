import { Component } from '@angular/core';

import { NotificationService } from '../notification.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-item',
  standalone: true,
  imports: [NavbarComponent, FormsModule],
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent {
  auction = {
    userName: '',
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
    private notificationService: NotificationService
  ) {}

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.auction.imageUrl = file.name;
    }
  }

  onSubmit(form: NgForm) {
    const auctionData = {
      ...this.auction,
      startingPrice: parseFloat(this.auction.startingPrice.toString()),
    };

    this.http.post('http://localhost:8080/api/auctions/add', auctionData).subscribe(
      response => {
        console.log('Auction saved:', response);
        this.notificationService.addNotification(
          `New item "${this.auction.itemName}" added at ${new Date().toLocaleTimeString()}`
        );
        form.reset();
        this.auction.imageUrl = '';
      },
      error => {
        console.error('Error saving auction:', error);
      }
    );
  }
}