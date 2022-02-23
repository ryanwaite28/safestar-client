import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { EVENT_TYPES, PULSE_CODES } from 'src/app/enums/all.enums';
import { IPhotoPulse, IPulse } from 'src/app/interfaces/pulse.interface';
import { IUser } from 'src/app/interfaces/user.interface';
import { ServiceMethodResultsInfo } from 'src/app/interfaces/_common.interface';
import { TimeAgoPipe } from 'src/app/pipes/time-ago.pipe';
import { UserFullNamePipe } from 'src/app/pipes/user-full-name.pipe';
import { AlertService } from 'src/app/services/alert.service';
import { GoogleMapsService } from 'src/app/services/google-maps.service';
import { PhotoPulsesService } from 'src/app/services/photo-pulses.service';
import { PulsesService } from 'src/app/services/pulses.service';
import { SocketEventsService } from 'src/app/services/socket-events.service';
import { UnseenService } from 'src/app/services/unseen.service';
import { UsersService } from 'src/app/services/users.service';
import { UserStoreService } from 'src/app/stores/user-store.service';
import { PULSE_CODES_GENERIC, PULSE_CODES_OKAY, PULSE_CODES_WARNING, PULSE_CODES_DANGER } from 'src/app/_misc/vault';

@Component({
  selector: 'app-user-pulses-page',
  templateUrl: './user-pulses-page.component.html',
  styleUrls: ['./user-pulses-page.component.scss']
})
export class UserPulsesPageComponent implements OnInit {
  you: IUser | null;
  
  pulses: IPulse[] = [];
  photo_pulses: IPhotoPulse[] = [];

  pulses_loading = false;
  photo_pulses_loading = false;

  pulses_end_reached = true;
  photo_pulses_end_reached = true;

  subsList: Subscription[];

  PULSE_CODES_GENERIC = PULSE_CODES_GENERIC;
  PULSE_CODES_OKAY = PULSE_CODES_OKAY;
  PULSE_CODES_WARNING = PULSE_CODES_WARNING;
  PULSE_CODES_DANGER = PULSE_CODES_DANGER;

  google: any;

  constructor(
    private userStore: UserStoreService,
    private usersService: UsersService,
    private userFullNamePipe: UserFullNamePipe,
    private datePipe: DatePipe,
    private timeAgoPipe: TimeAgoPipe,
    private googleMapsService: GoogleMapsService,
    private socketEventsService: SocketEventsService,
    private pulsesService: PulsesService,
    private photoPulsesService: PhotoPulsesService,
    private alertService: AlertService,
    private unseenService: UnseenService,
  ) { }

  ngOnInit(): void {
    this.userStore.getChangesObs().subscribe((you: IUser | null) => {
      this.you = you;
      if (you) {
        this.getPulses();
        this.getPhotoPulses();
      }
    });
  }

  getPulses() {
    const min_id = this.pulses.length && this.pulses[this.pulses.length - 1].id;
    this.pulses_loading = true;
    this.pulsesService.get_user_pulses(this.you!.id, min_id)
    .pipe(
      finalize(() => {
        this.pulses_loading = false;
      })
    )
    .subscribe({
      next: (response: ServiceMethodResultsInfo<IPulse[]>) => {
        for (const item of response.data!) {
          this.pulses.push(item);
        }
        this.pulses_end_reached = response.data!.length < 5;
      }
    });
  }

  getPhotoPulses() {
    const min_id = this.photo_pulses.length && this.photo_pulses[this.photo_pulses.length - 1].id;
    this.photo_pulses_loading = true;
    this.photoPulsesService.get_user_photo_pulses(this.you!.id, min_id)
    .pipe(
      finalize(() => {
        this.photo_pulses_loading = false;
      })
    )
    .subscribe({
      next: (response: ServiceMethodResultsInfo<IPhotoPulse[]>) => {
        for (const item of response.data!) {
          this.photo_pulses.push(item);
        }
        this.photo_pulses_end_reached = response.data!.length < 5;
      }
    });
  }

  createPulse(code: PULSE_CODES) {
    this.pulses_loading = true;
    
    this.googleMapsService.getCurrentLocation().subscribe({
      next: (position) => {
        console.log(position);
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        this.pulsesService.create_pulse(this.you!.id, { lat, lng, code })
        .pipe(
          finalize(() => {
            this.pulses_loading = false;
          })
        )
        .subscribe({
          next: (response) => {
            this.alertService.showSuccessMessage(response.message);
            !!response.data && this.pulses.unshift(response.data);
          }
        });
      },

      error: () => {
        this.pulses_loading = false;
      }
    });
  }
}
