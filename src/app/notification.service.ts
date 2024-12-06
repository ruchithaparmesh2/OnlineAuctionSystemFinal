import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notifications: string[] = [];
  private triggerSource = new BehaviorSubject<boolean>(false);
  trigger$ = this.triggerSource.asObservable();

  addNotification(message: string) {
    this.notifications.push(message);
    this.triggerSource.next(true);
  }

  getNotifications(): string[] {
    return this.notifications;
  }

  resetTrigger() {
    this.triggerSource.next(false);
  }
}
