import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import { IUser } from 'src/app/interfaces/user.interface';
import { AlertService } from 'src/app/services/alert.service';
import { UsersService } from 'src/app/services/users.service';
import { UserStoreService } from 'src/app/stores/user-store.service';

@Component({
  selector: 'app-find-users-page',
  templateUrl: './find-users-page.component.html',
  styleUrls: ['./find-users-page.component.scss']
})
export class FindUsersPageComponent implements OnInit {
  you: IUser | any;
  searchUsersForm = new FormGroup({
    name: new FormControl('', [])
  });
  searchUsersInputChanged = new Subject<string>();
  results: IUser[] = [];
  loading = false;

  constructor(
    private userStore: UserStoreService,
    private usersService: UsersService,
    private alertService: AlertService,
  ) { }

  ngOnInit(): void {
    this.userStore.getChangesObs().subscribe(you => {
      this.you = you;
    });

    this.searchUsersForm.get('name')!.valueChanges.subscribe((value: string) => {
      this.searchUsersInputChanged.next(value);
    });

    this.searchUsersInputChanged.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe((query_term: string) => {
      this.search_users(query_term);
    });
  }

  search_users(query_term: string) {
    if (!query_term) {
      this.results = [];
      return;
    }
    this.loading = true;
    this.usersService.find_users_by_name_or_username(query_term)
    .pipe(
      finalize(() => {
        this.loading = false;
      })
    )
    .subscribe({
      next: (response) => {
        this.results = response.data;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      },
    });
  }
}
