import { Component,OnInit } from '@angular/core';
import { NotificationService } from '../notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent implements OnInit{
  notifications: string[] = [];

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notifications = this.notificationService.getNotifications();
  }
}
