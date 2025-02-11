import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notifications = new BehaviorSubject<string[]>([]);
  notifications$ = this.notifications.asObservable();

  constructor() { }

  addNotification(message: string) {
    const currentNotifications = this.notifications.getValue();
    this.notifications.next([...currentNotifications, message]);
  }

  clearNotifications() {
    this.notifications.next([]);
  }
}
