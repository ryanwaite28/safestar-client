import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { EVENT_TYPES } from '../enums/all.enums';
import { IUser } from '../interfaces/user.interface';
import { UserStoreService } from '../stores/user-store.service';
import { getUserFullName } from '../_misc/chamber';
import { 
  user_conversation_events,
  user_watch_events,
  user_tracking_events,
  user_pulse_events,
  user_checkpoint_events,
} from '../_misc/vault';
import { AlertService } from './alert.service';
import { SocketEventsService } from './socket-events.service';
import { UsersService } from './users.service';

/**
 * Get and tracks user's unseen information (global state/store), this includes:
 * - messages
 * - conversations
 * - notifications
 */

export interface IUnseen {
  messages: number,
  conversations: number,
  watches: number,
  notifications: number,

  pulses: number,
  trackings: number,
  checkpoints: number,
}

export type UnseenProp =
  'messages' |
  'conversations' |
  'pulses' |
  'trackings' |
  'checkpoints' |
  'watches' |
  'notifications';

@Injectable({
  providedIn: 'root'
})
export class UnseenService {
  private you: IUser | any;
  private unseen: IUnseen = {
    messages: 0,
    conversations: 0,
    watches: 0,
    notifications: 0,
    pulses: 0,
    trackings: 0,
    checkpoints: 0,
  };
  private changes = new BehaviorSubject<IUnseen>({
    messages: 0,
    conversations: 0,
    watches: 0,
    notifications: 0,
    pulses: 0,
    trackings: 0,
    checkpoints: 0,
  });
  private userStoreSubscription: Subscription;

  private currentUrl: string = '';

  constructor(
    private alertService: AlertService,
    private userStore: UserStoreService,
    private usersService: UsersService,
    private socketEventsService: SocketEventsService,
    private route: ActivatedRoute,
  ) {
    this.userStoreSubscription = this.userStore.getChangesObs().subscribe((you) => {
      // if user logs in, `you` will have value (is null by default).
      // once user logs in, start listening to event for user
      if (!this.you && you) {
        this.you = you;
        this.usersService.get_unseen_counts(you.id).subscribe((response) => {
          this.unseen = {
            messages: response.data.unseen_messages || 0,
            conversations: response.data.unseen_conversations || 0,
            watches: response.data.unseen_watches || 0,
            notifications: response.data.unseen_notifications || 0,
            pulses: response.data.unseen_pulsess || 0,
            trackings: response.data.unseen_trackings || 0,
            checkpoints: response.data.unseen_checkpoints || 0,
          };
          this.changes.next({ ...this.unseen });
        });
      }

      // user logged out, 
      // stop listening to events
      if (this.you && !you) {
        this.you = null;
      }
    });

    this.listenToUserEventsList(user_conversation_events, 'conversations');
    this.listenToUserEventsList(user_watch_events, 'watches');
    this.listenToUserEventsList(user_tracking_events, 'trackings');
    this.listenToUserEventsList(user_pulse_events, 'pulses');
    this.listenToUserEventsList(user_checkpoint_events, 'checkpoints');

    this.socketEventsService.listenToObservableEventStream(EVENT_TYPES.NEW_USER_LOCATION_UPDATE).subscribe((event: any) => {
      this.increment('notifications', 1);
    });

    this.socketEventsService.listenToObservableEventStream(EVENT_TYPES.NEW_MESSAGE).subscribe((event: any) => {
      this.increment('messages', 1);
    });

    this.socketEventsService.listenToObservableEventStream(EVENT_TYPES.NEW_CONVERSATION_MESSAGE).subscribe((event: any) => {
      if (event.data.user_id !== this.you!.id) {
        this.increment('conversations', 1);
      }
    });

    this.socketEventsService.listenToObservableEventStream(EVENT_TYPES.NEW_WATCH_MESSAGE).subscribe((event: any) => {
      if (event.data.user_id !== this.you!.id) {
        this.increment('watches', 1);
      }
    });
  }

  listenToUserEventsList(eventsList: EVENT_TYPES[], incrementProp: UnseenProp, incrementNotifications: boolean = true) {
    eventsList.forEach((event_type: EVENT_TYPES) => {
      this.socketEventsService.listenToObservableEventStream(event_type).subscribe((event: any) => {
        console.log(event);
        this.increment(incrementProp, 1);
        if (incrementNotifications && event.notification) {
          // if the socket event contains a notification and the function call permits (incrementNotifications was true), increment 
          this.increment('notifications', 1);
        }
        if (event.notification && event.notification.message) {
          this.alertService.showSuccessMessage(event.notification.message);
        }
      });
    });
  };

  increment(prop: UnseenProp, amount: number) {
    if (!prop || !amount || !this.unseen.hasOwnProperty(prop) || amount <= 0) {
      console.log(`could not increment:`, { prop, amount });
      return;
    }
    this.unseen[prop] += amount;
    this.changes.next({ ...this.unseen });
  }
  
  decrement(prop: UnseenProp, amount: number) {
    if (!prop || !amount || !this.unseen.hasOwnProperty(prop) || amount <= 0) {
      console.log(`could not decrement:`, { prop, amount });
      return;
    }
    if (this.unseen[prop] === 0) {
      console.log(`cannot decrement into negative`);
      return;
    }
    this.unseen[prop] -= amount;
    this.changes.next({ ...this.unseen });
  }

  clear (prop?: UnseenProp) {
    if (prop && this.unseen.hasOwnProperty(prop)) {
      this.unseen[prop] = 0;
      this.changes.next({ ...this.unseen });
    } else {
      const clearState: IUnseen = {
        messages: 0,
        conversations: 0,
        watches: 0,
        notifications: 0,
        pulses: 0,
        trackings: 0,
        checkpoints: 0,
      };
      this.unseen = clearState;
      this.changes.next({ ...clearState });
    }
  }

  getStateChanges() {
    return this.changes.asObservable();
  }
}
