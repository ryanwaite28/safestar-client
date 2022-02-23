import { Component, OnInit } from '@angular/core';
import { PlainObject } from 'src/app/interfaces/json-object.interface';
import { IUser } from 'src/app/interfaces/user.interface';
import { UsersService } from 'src/app/services/users.service';
import { UserStoreService } from 'src/app/stores/user-store.service';

@Component({
  selector: 'app-user-home-page',
  templateUrl: './user-home-page.component.html',
  styleUrls: ['./user-home-page.component.scss']
})
export class UserHomePageComponent implements OnInit {
  you: IUser | null;
  stats: PlainObject<number>;

  constructor(
    private userStore: UserStoreService,
    private usersService: UsersService,
  ) { }

  ngOnInit(): void {
    this.userStore.getChangesObs().subscribe((you: IUser | null) => {
      this.you = you;
      if (you) {
        this.usersService.get_user_home_page_stats(you.id).subscribe({
          next: (response) => {
            this.stats = response.data!;
          }
        });
      }
    });
  }

}
