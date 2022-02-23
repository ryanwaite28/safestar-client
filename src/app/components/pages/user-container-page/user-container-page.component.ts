import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IUser } from 'src/app/interfaces/user.interface';
import { IUnseen, UnseenService } from 'src/app/services/unseen.service';
import { UsersService } from 'src/app/services/users.service';
import { UserStoreService } from 'src/app/stores/user-store.service';

@Component({
  selector: 'app-user-container-page',
  templateUrl: './user-container-page.component.html',
  styleUrls: ['./user-container-page.component.scss']
})
export class UserContainerPageComponent implements OnInit, OnDestroy {
  you: IUser | null;
  userpageLinks: { label: string, path: (string|number)[], unseenCount?: number }[];
  unseenState: Partial<IUnseen> = {
    notifications: 0,
    conversations: 0,
    watches: 0,
    messages: 0,
  };
  unseenSub: Subscription;

  constructor(
    private userStore: UserStoreService,
    private usersService: UsersService,
    private unseenService: UnseenService,
  ) { }

  ngOnInit(): void {
    this.userStore.getChangesObs().subscribe((you: IUser | null) => {
      this.you = you;
      if (you) {
        this.userpageLinks = [
          { label: `Home`, path: ['/', 'users', you.id] },
          { label: `Settings`, path: ['/', 'users', you.id, 'settings'] },
          { label: `Mesages`, path: ['/', 'users', you.id, 'messages'] },
          { label: `Conversations`, path: ['/', 'users', you.id, 'conversations'] },
          { label: `Notifications`, path: ['/', 'users', you.id, 'notifications'] },
        ];

        this.unseenSub = this.unseenService.getStateChanges().subscribe((unseenState) => {
          this.unseenState = unseenState;
          this.userpageLinks[2].unseenCount = unseenState.messages;
          this.userpageLinks[3].unseenCount = unseenState.conversations;
          this.userpageLinks[4].unseenCount = unseenState.notifications;

          console.log(this);
        });
      }
    });
  }

  ngOnDestroy() {
    this.unseenSub?.unsubscribe();
  }
}
