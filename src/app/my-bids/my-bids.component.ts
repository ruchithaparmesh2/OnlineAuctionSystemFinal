import { Component } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-bids',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './my-bids.component.html',
  styleUrl: './my-bids.component.css'
})
export class MyBidsComponent {
  username: string = '';
  bids: any[] = [];

  constructor(private http: HttpClient) {}

  fetchBidDetails() {
    if (!this.username.trim()) {
      alert('Username cannot be empty!');
      return;
    }

    const url = `http://localhost:8080/api/bids/name/${this.username}`;
    this.http.get<any[]>(url).subscribe(
      (response) => {
        this.bids = response.map((bid) => ({
          itemName: bid.itemName,
          bidAmount: bid.bidAmount,
          bidTime: bid.bidTime,
        }));
      },
      (error) => {
        console.error('Error fetching bid details:', error);
        alert('Failed to fetch bid details. Please try again.');
      }
    );
  }
}

