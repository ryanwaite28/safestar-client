import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { IPulse } from 'src/app/interfaces/pulse.interface';
import { IUser } from 'src/app/interfaces/user.interface';
import { GoogleMapsService } from 'src/app/services/google-maps.service';
import { UserStoreService } from 'src/app/stores/user-store.service';

@Component({
  selector: 'app-pulse-card',
  templateUrl: './pulse-card.component.html',
  styleUrls: ['./pulse-card.component.scss']
})
export class PulseCardComponent implements OnInit, OnChanges {
  @Input() pulse: IPulse;
  you: IUser | null;
  location: string;

  constructor(
    private userStore: UserStoreService,
    private googleMapsService: GoogleMapsService,
  ) { }

  ngOnInit(): void {
    this.userStore.getChangesObs().subscribe((you: IUser | null) => {
      this.you = you;
    });

    // this.pulse && this.getPulseLocationText(this.pulse);
    this.location = (<any> this.pulse).location;
  }

  ngOnChanges() {
  }

  getPulseLocationText(pulse: IPulse) {
    this.googleMapsService.getLocationViaCoordinates(pulse.lat, pulse.lng).subscribe({
      next: (data: any) => {
        console.log(data);
        this.location = data.placeData.location;
      }
    });
  }
}
