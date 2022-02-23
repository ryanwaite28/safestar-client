import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/interfaces/user.interface';
import { ServiceMethodResultsInfo } from 'src/app/interfaces/_common.interface';
import { BrowseService } from 'src/app/services/browse.service';

@Component({
  selector: 'app-browse-users-page',
  templateUrl: './browse-users-page.component.html',
  styleUrls: ['./browse-users-page.component.scss']
})
export class BrowseUsersPageComponent implements OnInit {
  recentUsers: IUser[] = [];

  constructor(
    private browseService: BrowseService,
  ) { }

  ngOnInit(): void {
    this.browseService.get_recent_users().subscribe({
      next: (response: ServiceMethodResultsInfo<IUser[]>) => {
        this.recentUsers = response.data!;
      }
    });
  }
}
