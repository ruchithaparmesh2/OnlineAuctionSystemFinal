import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NavbarAdminComponent } from '../navbar-admin/navbar-admin.component';

// Interface for Auction Data
export interface Auction {
  userName: string;
  category: string;
  itemName: string;
  startingPrice: number;
  auctionDate: string;
  auctionStartTime: string;
  auctionEndDate: string;
  auctionEndTime: string;
  imageUrl: string;
}

@Component({
  standalone:true,
  imports:[CommonModule,NavbarAdminComponent],
  selector: 'app-auction-insights',
  templateUrl: './auction-insights.component.html',
  styleUrls: ['./auction-insights.component.css']
})
export class AuctionInsightsComponent implements OnInit {
  auctions: Auction[] = [];
  totalAuctions: number = 0;
  avgPrice: number = 0;
  totalAuctionsPercent: number = 0;
  avgPricePercent: number = 0;
  categoryData: { name: string, percent: number }[] = [];
  timelineData: { date: string, percent: number }[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchAuctionInsights();
  }

  fetchAuctionInsights() {
    this.http.get<Auction[]>('http://localhost:8080/api/auctions').subscribe((data: Auction[]) => {
      this.auctions = data;
      this.totalAuctions = data.length;
      this.avgPrice = this.calculateAvgPrice(data);
      this.totalAuctionsPercent = (this.totalAuctions / 100) * 100; // Example calculation for percentage
      this.categoryData = this.getCategoryInsights(data);
      this.timelineData = this.getTimelineInsights(data);
      this.avgPricePercent = Math.min((this.avgPrice / 5000) * 100, 100); 
 // Assuming 5000 as the highest price for percentage calculation
    });
  }

  calculateAvgPrice(data: Auction[]): number {
    const total = data.reduce((sum, auction) => sum + auction.startingPrice, 0);
    return total / data.length;
  }

  getCategoryInsights(data: Auction[]): { name: string, percent: number }[] {
    const categoryMap: Record<string, number> = {};
    data.forEach(auction => {
      categoryMap[auction.category] = (categoryMap[auction.category] || 0) + 1;
    });

    return Object.keys(categoryMap).map(category => {
      const count = categoryMap[category];
      const percent = (count / data.length) * 100;
      return { name: category, percent };
    });
  }

  getTimelineInsights(data: Auction[]): { date: string, percent: number }[] {
    const dateMap: Record<string, number> = {};
    data.forEach(auction => {
      const auctionDate = auction.auctionDate;
      dateMap[auctionDate] = (dateMap[auctionDate] || 0) + 1;
    });

    return Object.keys(dateMap).map(date => {
      const count = dateMap[date];
      const percent = (count / data.length) * 100;
      return { date, percent };
    });
  }
}
