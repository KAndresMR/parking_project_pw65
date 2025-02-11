import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/firestore/notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements OnInit{
  notifications: string[] = [];

  constructor(private notificationService: NotificationService) {}
  
  ngOnInit() {
    this.notificationService.notifications$.subscribe(
      (messages) => (this.notifications = messages)
    );
  }

  clear() {
    this.notificationService.clearNotifications();
  }

}
