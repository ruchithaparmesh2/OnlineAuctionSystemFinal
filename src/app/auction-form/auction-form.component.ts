import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';


@Component({
  selector: 'app-auction-form',
  standalone: true,
  imports: [CommonModule,FormsModule,NavbarComponent],
  templateUrl: './auction-form.component.html',
  styleUrl: './auction-form.component.css'
})
export class AuctionFormComponent {
  username: string = '';
  email: string = '';
  itemName: string = '';
  problem: string = '';

}
