import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';
import { IUser } from 'src/app/interfaces/user.interface';
import { INotification } from 'src/app/interfaces/_common.interface';
import { UnseenService } from 'src/app/services/unseen.service';
import { UsersService } from 'src/app/services/users.service';
import { UserStoreService } from 'src/app/stores/user-store.service';

@Component({
  selector: 'app-user-notifications-page',
  templateUrl: './user-notifications-page.component.html',
  styleUrls: ['./user-notifications-page.component.scss']
})
export class UserNotificationsPageComponent implements OnInit {
  you: IUser | any;
  
  notifications: INotification[] = [];
  loading: boolean = false;
  end_reached = true;
  shouldUpdateLastOpened = true;
  
  constructor(
    private userStore: UserStoreService,
    private usersService: UsersService,
    private router: Router,
    private route: ActivatedRoute,
    private unseenService: UnseenService,
  ) { }

  ngOnInit() {
    this.userStore.getChangesObs().subscribe(you => {
      this.you = you;

      if (this.shouldUpdateLastOpened) {
        this.shouldUpdateLastOpened = false;
        this.getNotifications();
        const notificationSub = this.usersService.update_user_last_opened(this.you!.id)
          .pipe(take(1))
          .subscribe({
            next: (response: any) => {
              notificationSub.unsubscribe();
              this.unseenService.clear('notifications');
            }
          });
      }
    });
  }

  getNotifications() {
    const min_id =
      this.notifications.length &&
      this.notifications[this.notifications.length - 1].id;
    this.loading = true;
    this.usersService.getUserNotifications<any>(
      this.you!.id,
      min_id,
    ).subscribe({
      next: (response: any) => {
        for (const notification of response.data) {
          this.notifications.push(notification);
        }
        this.end_reached = response.data.length < 5;
        this.loading = false;
      }
    });
  }
}
