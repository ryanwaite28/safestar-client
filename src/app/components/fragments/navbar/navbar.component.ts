import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IUser } from 'src/app/interfaces/user.interface';
import { GoogleMapsService } from 'src/app/services/google-maps.service';
import { IUnseen, UnseenService } from 'src/app/services/unseen.service';
// import { UnseenService } from 'src/app/services/unseen.service';
import { UsersService } from 'src/app/services/users.service';
import { UserStoreService } from 'src/app/stores/user-store.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  you: IUser | null = null;
  sub: any;
  navbarLinks: { label: string, path: (string|number)[], unseenCount?: number }[];
  unseenState: Partial<IUnseen> = {
    notifications: 0,
    conversations: 0,
    watches: 0,
    messages: 0,
    pulses: 0,
    trackings: 0,
    checkpoints: 0,
  };
  unseenSub: Subscription;
  updateLocationInterval: any;
  intervalAmount = 1000 * 60 * 30;

  constructor(
    private userStore: UserStoreService,
    private usersService: UsersService,
    private unseenService: UnseenService,
    private googleMapsService: GoogleMapsService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.userStore.getChangesObs().subscribe((you: IUser | null) => {
      this.you = you;
      window.setTimeout(() => {
        this.setLocationUpdateInterval(you);
      }, 5000);

      if (you) {
        this.navbarLinks = [
          { label: `Home`, path: ['/', 'users', you.id] },
          { label: `Pulses`, path: ['/', 'users', you.id, 'pulses'] },
          { label: `Trackings`, path: ['/', 'users', you.id, 'trackings'] },
          { label: `CheckPoints`, path: ['/', 'users', you.id, 'checkpoints'] },
          { label: `Watches`, path: ['/', 'users', you.id, 'watches'] },

          { label: ``, path: ['/'] },

          { label: `Browse`, path: ['/', 'browse'] },
          { label: `Find`, path: ['/', 'find'] },
        ];

        this.unseenSub = this.unseenService.getStateChanges().subscribe((unseenState) => {
          this.unseenState = unseenState;

          this.navbarLinks[1].unseenCount = unseenState.pulses;
          this.navbarLinks[2].unseenCount = unseenState.trackings;
          this.navbarLinks[3].unseenCount = unseenState.checkpoints;
          this.navbarLinks[4].unseenCount = unseenState.watches;

          console.log(this);
        });
      }
    });
  }

  private setLocationUpdateInterval(you: IUser | null) {
    if (you && !this.updateLocationInterval) {
      console.log(`Location interval starting...`);
      this.updateLocationInterval = window.setInterval(() => {
        this.updateLatestLocation();
      }, this.intervalAmount);
    }
    else {
      console.log(`Location interval clearing...`);
      window.clearInterval(this.updateLocationInterval);
      this.updateLocationInterval = undefined;
    }
  }
  
  private updateLatestLocation() {
    console.log(`Updating location via automated setInterval...`);
    this.googleMapsService.getCurrentLocation().subscribe({
      next: (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        this.usersService.update_latest_coordinates(this.you!.id, { lat, lng, automated: true })
        .subscribe({
          next: (response) => {
            console.log(response);
          }
        });
      }
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  onSignout() {
    this.usersService.sign_out_sync();
    this.router.navigate(['/', 'signin']);
  }
}