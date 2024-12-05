import { Component } from '@angular/core';
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
    imageUrl: ''
  };

  constructor(private http: HttpClient) {}

  // Handle file change event
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.auction.imageUrl = file.name; // Store the file name or upload the file
    }
  }

  // Handle form submission
  onSubmit(form: NgForm) {
    const auctionData = {
      ...this.auction,
      startingPrice: parseFloat(this.auction.startingPrice.toString())
    };

    this.http.post('http://localhost:8080/api/auctions/add', auctionData)
      .subscribe(response => {
        console.log('Auction saved:', response);

        // Reset the form after submission
        form.reset();
        this.auction.imageUrl = ''; // Optionally reset image URL as well
      }, error => {
        console.error('Error saving auction:', error);
      });
  }
}
