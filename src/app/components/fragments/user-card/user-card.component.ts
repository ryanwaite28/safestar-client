import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ICheckpoint } from 'src/app/interfaces/checkpoint.interface';
import { ITrackingRequest } from 'src/app/interfaces/tracking.model';
import { IUser } from 'src/app/interfaces/user.interface';
import { UserFullNamePipe } from 'src/app/pipes/user-full-name.pipe';
import { AlertService } from 'src/app/services/alert.service';
import { CheckpointsService } from 'src/app/services/checkpoints.service';
import { TrackingsService } from 'src/app/services/trackings.service';
import { UsersService } from 'src/app/services/users.service';
import { UserStoreService } from 'src/app/stores/user-store.service';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {
  @Input() user: IUser;
  @Input() showBio: boolean;

  you: IUser | null;
  isNotYou: boolean = false;
  isShowingInfo = false;
  loading = false;
  isTracking = false;
  checkpointPending: ICheckpoint | null = null;
  trackingRequest: ITrackingRequest | null;
  messageFormIsOpen = false;
  MSG_MAX_LENGTH = 1000;
  @Input() imgSize: string = '24';
  @Input() textSize: string = 'sm';
  messageForm = new FormGroup({
    body: new FormControl('', [
      Validators.required,
      // Validators.pattern(/(.*)+/),
      Validators.minLength(1),
      Validators.maxLength(this.MSG_MAX_LENGTH)
    ])
  });

  constructor(
    private userStore: UserStoreService,
    private usersService: UsersService,
    private trackingsService: TrackingsService,
    private checkpointsService: CheckpointsService,
    private alertService: AlertService,
  ) { }

  ngOnInit(): void {
    this.userStore.getChangesObs().subscribe((you: IUser | null) => {
      this.you = you;
      this.init();
    });
  }
  
  init() {
    this.isNotYou = !!this.you && !!this.user && this.you.id !== this.user.id;
    if (this.isNotYou) {
      this.trackingsService.check_user_tracking(this.you!.id, this.user.id).subscribe({
        next: (response: any) => {
          console.log('tracking', response);
          this.isTracking = !!response.data;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });

      this.trackingsService.check_user_tracking_request(this.you!.id, this.user.id).subscribe({
        next: (response: any) => {
          console.log('tracking request', response);
          this.trackingRequest = response.data;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });

      this.checkpointsService.check_user_to_user_checkpoint_pending(this.you!.id, this.user.id).subscribe({
        next: (response) => {
          console.log('checkpoint pending', response);
          this.checkpointPending = response.data;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
    }
  }

  toggleTracking() {
    if (this.isTracking) {
      // stop tracking
      this.trackingsService.stop_tracking(this.you!.id, this.user.id).subscribe({
        next: (response) => {
          this.isTracking = false;
        }
      });
    }
    else if (this.trackingRequest) {
      // cancel request
      this.trackingsService.cancel_request_user_tracking(this.you!.id, this.user.id).subscribe({
        next: (response) => {
          this.trackingRequest = null;
        }
      });
    }
    else {
      // send request
      this.trackingsService.request_user_tracking(this.you!.id, this.user.id).subscribe({
        next: (response) => {
          this.trackingRequest = response.data;
        }
      });
    }
  }

  sendCheckpoint() {
    if (this.loading || this.checkpointPending) {
      return;
    }
    this.loading = true;
    this.checkpointsService.create_send_user_checkpoint(
      this.you!.id,
      this.user.id
    ).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.alertService.showSuccessMessage(response.message);
        this.checkpointPending = response.data;
      }
    });
  }

  sendMessage() {
    if (this.loading) {
      return;
    }
    if (!this.messageForm.value.body.trim()) {
      return window.alert(`Message form cannot be empty`);
    }

    this.loading = true;
    this.usersService.send_user_message(
      this.you!.id,
      this.user.id,
      this.messageForm.value
    ).subscribe({
      next: (response: any) => {
        this.alertService.showSuccessMessage(response.message);
        this.messageForm.setValue({ body: '' });
        this.messageFormIsOpen = false;
        this.loading = false;
      }
    });
  }
}
