import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { EVENT_TYPES } from 'src/app/enums/all.enums';
import { ICheckpoint } from 'src/app/interfaces/checkpoint.interface';
import { IUser } from 'src/app/interfaces/user.interface';
import { ServiceMethodResultsInfo } from 'src/app/interfaces/_common.interface';
import { TimeAgoPipe } from 'src/app/pipes/time-ago.pipe';
import { UserFullNamePipe } from 'src/app/pipes/user-full-name.pipe';
import { AlertService } from 'src/app/services/alert.service';
import { CheckpointsService } from 'src/app/services/checkpoints.service';
import { GoogleMapsService } from 'src/app/services/google-maps.service';
import { SocketEventsService } from 'src/app/services/socket-events.service';
import { UsersService } from 'src/app/services/users.service';
import { UserStoreService } from 'src/app/stores/user-store.service';

@Component({
  selector: 'app-user-checkpoints-page',
  templateUrl: './user-checkpoints-page.component.html',
  styleUrls: ['./user-checkpoints-page.component.scss']
})
export class UserCheckpointsPageComponent implements OnInit {
  you: IUser | null;
  loading = false;
  today = new Date();
  
  checkpoints_sent: ICheckpoint[] = [];
  checkpoints_sent_pending: ICheckpoint[] = [];
  checkpoints_received: ICheckpoint[] = [];
  checkpoints_received_pending: ICheckpoint[] = [];
  
  checkpoints_sent_loading = false;
  checkpoints_sent_pending_loading = false;
  checkpoints_received_loading = false;
  checkpoints_received_pending_loading = false;

  checkpoints_sent_list_show = true;
  checkpoints_sent_pending_list_show = true;
  checkpoints_received_list_show = true;
  checkpoints_received_pending_list_show = true;

  checkpoints_sent_end_reached = true;
  checkpoints_sent_pending_end_reached = true;
  checkpoints_received_end_reached = true;
  checkpoints_received_pending_end_reached = true;

  subsList: Subscription[];

  constructor(
    private userStore: UserStoreService,
    private usersService: UsersService,
    private userFullNamePipe: UserFullNamePipe,
    private datePipe: DatePipe,
    private timeAgoPipe: TimeAgoPipe,
    private googleMapsService: GoogleMapsService,
    private socketEventsService: SocketEventsService,
    private checkpointsService: CheckpointsService,
    private alertService: AlertService,
  ) { }

  ngOnInit(): void {
    this.userStore.getChangesObs().subscribe((you: IUser | null) => {
      this.you = you;
      if (you) {
        this.getCheckpointsSent();
        this.getCheckpointsReceived();
        this.getCheckpointsSentPending();
        this.getCheckpointsReceivedPending();

        this.subsList = [
          EVENT_TYPES.NEW_CHECKPOINT,
          EVENT_TYPES.NEW_CHECKPOINT_RESPONSE,
        ].map((event_type: EVENT_TYPES) => {
          return this.socketEventsService.listenToObservableEventStream(event_type).subscribe((event: any) => {
            console.log(event);
            this.handleEvent(event);
          });
        });
      }
    });
  }

  ngOnDestroy() {
    this.subsList?.forEach(sub => sub?.unsubscribe());
  }

  handleEvent(event: any) {
    switch (event.event as EVENT_TYPES) {
      case EVENT_TYPES.NEW_CHECKPOINT: {
        // user wants to check on you
        if (!event.checkpoint) {
          console.log({ event });
          throw new TypeError(`Event did not have checkpoint property`);
        }
        this.checkpoints_received_pending?.unshift(event.checkpoint);
        break;
      }
      
      case EVENT_TYPES.NEW_CHECKPOINT_RESPONSE: {
        // user responded to your checkpoint request
        if (!event.checkpoint) {
          console.log({ event });
          throw new TypeError(`Event did not have checkpoint property`);
        }
        const i = this.checkpoints_sent_pending?.findIndex(c => c.id === event.checkpoint.id);
        if (i > -1) {
          this.checkpoints_sent_pending?.splice(i, 1);
        }
        if (event.checkpoint) {
          this.checkpoints_sent?.unshift(event.checkpoint);
        }
        break;
      }
    }
  }

  getCheckpointsSent() {
    const min_id = this.checkpoints_sent.length && this.checkpoints_sent[this.checkpoints_sent.length - 1].id;
    this.checkpoints_sent_loading = true;
    this.checkpointsService.get_user_checkpoints_sent(this.you!.id, min_id)
    .pipe(
      finalize(() => {
        this.checkpoints_sent_loading = false;
      })
    )
    .subscribe({
      next: (response: ServiceMethodResultsInfo<ICheckpoint[]>) => {
        for (const item of response.data!) {
          this.checkpoints_sent.push(item);
        }
        this.checkpoints_sent_end_reached = response.data!.length < 5;
      }
    });
  }
  
  getCheckpointsReceived() {
    const min_id = this.checkpoints_received.length && this.checkpoints_received[this.checkpoints_received.length - 1].id;
    this.checkpoints_received_loading = true;
    this.checkpointsService.get_user_checkpoints_received(this.you!.id, min_id)
    .pipe(
      finalize(() => {
        this.checkpoints_received_loading = false;
      })
      )
      .subscribe({
        next: (response: ServiceMethodResultsInfo<ICheckpoint[]>) => {
          for (const item of response.data!) {
          this.checkpoints_received.push(item);
        }
        this.checkpoints_received_end_reached = response.data!.length < 5;
      }
    });
  }

  getCheckpointsSentPending() {
    const min_id = this.checkpoints_sent_pending.length && this.checkpoints_sent_pending[this.checkpoints_sent_pending.length - 1].id;
    this.checkpoints_sent_pending_loading = true;
    this.checkpointsService.get_user_checkpoints_sent_pending(this.you!.id, min_id)
    .pipe(
      finalize(() => {
        this.checkpoints_sent_pending_loading = false;
      })
    )
    .subscribe({
      next: (response: ServiceMethodResultsInfo<ICheckpoint[]>) => {
        for (const item of response.data!) {
          this.checkpoints_sent_pending.push(item);
        }
        this.checkpoints_sent_pending_end_reached = response.data!.length < 5;
      }
    });
  }
  
  getCheckpointsReceivedPending() {
    const min_id = this.checkpoints_received_pending.length && this.checkpoints_received_pending[this.checkpoints_received_pending.length - 1].id;
    this.checkpoints_received_pending_loading = true;
    this.checkpointsService.get_user_checkpoints_received_pending(this.you!.id, min_id)
    .pipe(
      finalize(() => {
        this.checkpoints_received_pending_loading = false;
      })
    )
    .subscribe({
      next: (response: ServiceMethodResultsInfo<ICheckpoint[]>) => {
        for (const item of response.data!) {
          this.checkpoints_received_pending.push(item);
        }
        this.checkpoints_received_pending_end_reached = response.data!.length < 5;
      }
    });
  }

  sendOkResponse(checkpoint: ICheckpoint) {
    this.loading = true;
    this.checkpointsService.respond_to_user_checkpoint_pending(this.you!.id, checkpoint.user_id)
    .pipe(
      finalize(() => {
        this.loading = false;
      })
    )
    .subscribe({
      next: (response: ServiceMethodResultsInfo<ICheckpoint>) => {
        const i = this.checkpoints_received_pending?.findIndex(c => c.id === checkpoint.id);
        if (i > -1) {
          this.checkpoints_received_pending?.splice(i, 1);
        }
        !!response.data && this.checkpoints_received?.unshift(response.data!);
      }
    });
  }
}
