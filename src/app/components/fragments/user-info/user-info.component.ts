import { Component, Input, OnInit } from '@angular/core';
import { IUser } from 'src/app/interfaces/user.interface';
import { UserFullNamePipe } from 'src/app/pipes/user-full-name.pipe';
import { getUserFullName } from 'src/app/_misc/chamber';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  @Input() user: IUser;
  @Input() showBio: boolean = false;
  @Input() imgSize: string = '24';
  @Input() textSize: string = 'sm';

  userFullName: string;

  constructor(
    private userFullNamePipe: UserFullNamePipe,
  ) {}

  ngOnInit(): void {
    this.userFullName = getUserFullName(this.user);
  }

}
