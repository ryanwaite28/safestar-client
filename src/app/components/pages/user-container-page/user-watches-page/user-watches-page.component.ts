import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Params, ActivatedRoute } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { EVENT_TYPES } from 'src/app/enums/all.enums';
import { IWatch } from 'src/app/interfaces/watch.interface';
import { PlainObject } from 'src/app/interfaces/json-object.interface';
import { IUser } from 'src/app/interfaces/user.interface';
import { AlertService } from 'src/app/services/alert.service';
import { WatchesService } from 'src/app/services/watches.service';
import { SocketEventsService } from 'src/app/services/socket-events.service';
import { UnseenService } from 'src/app/services/unseen.service';
import { UsersService } from 'src/app/services/users.service';
import { UserStoreService } from 'src/app/stores/user-store.service';
import { GoogleMapsService } from 'src/app/services/google-maps.service';

@Component({
  selector: 'app-user-watches-page',
  templateUrl: './user-watches-page.component.html',
  styleUrls: ['./user-watches-page.component.scss']
})
export class UserWatchesPageComponent implements OnInit, OnDestroy {
  @ViewChild('watchFormElm', { static: false }) watchFormElm: ElementRef<HTMLFormElement> | any;
  @ViewChild('areaMapDiv', {  }) areaMapDiv?: ElementRef<HTMLDivElement> | any;
  
  watchForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    is_public: new FormControl(false, []),
  });

  you: IUser | any;
  user: IUser | any;
  currentParams: Params | any;
  currentWatchSelected: IWatch | null = null;
  loading = false;
  isEditingCurrentWatchSelected = false;
  shouldShowAddingMemberForm = false;
  shouldShowMemberForm = false;
  search_results: any[] = [];

  watches_map: PlainObject = {};
  watches_list: IWatch[] = [];
  watch_members_list: any[] = [];
  watch_messages_list: any[] = [];
  watches_list_end = true;
  watch_messages_list_end = true;
  
  usersTypingMap: PlainObject = {};

  socketTypingEmittersMap: PlainObject = {};
  socketTypingStoppedEmittersMap: PlainObject = {};
  socketMemberAddedEmittersMap: PlainObject = {};
  socketMemberRemovedEmittersMap: PlainObject = {};
  socketWatchDeletedEmittersMap: PlainObject = {};
  socketNewMessageEmittersMap: PlainObject = {};
  typingTimeout: any;
  
  google: any;
  map: any;
  directionsRenderer: any;
  directionsService: any;
  infowindow: any;
  newWatchSub: Subscription | any;
  removedSub: Subscription | any;
  MSG_MAX_LENGTH = 1000;
  messageForm = new FormGroup({
    body: new FormControl('', [])
  });
  searchUsersForm = new FormGroup({
    name: new FormControl('', [])
  });
  searchUsersInputChanged = new Subject();
  subsList: Subscription[] = [];
  coordinates?: {
    center: { lat: number, lng: number },
    northEast: { lat: number, lng: number },
    southWest: { lat: number, lng: number },
  };

  constructor(
    private route: ActivatedRoute,
    private userStore: UserStoreService,
    private usersService: UsersService,
    private alertService: AlertService,
    private socketEventsService: SocketEventsService,
    private googleMapsService: GoogleMapsService,
    private watchesService: WatchesService,
    private unseenService: UnseenService,
  ) { }

  ngOnInit(): void {
    this.userStore.getChangesObs().subscribe(you => {
      this.you = you;
      if (you) {
        this.getWatches();
      }
    });

    this.route.parent!.params.subscribe((params) => {
      this.currentParams = params;
    });

    this.searchUsersForm.get('name')!.valueChanges.subscribe((value) => {
      this.searchUsersInputChanged.next(value);
    });

    this.newWatchSub = this.socketEventsService.listenToObservableEventStream(EVENT_TYPES.WATCH_MEMBER_ADDED).subscribe((event: any) => {
      this.handleMemberAddedEvent(event);
    });
    this.removedSub = this.socketEventsService.listenToObservableEventStream(EVENT_TYPES.WATCH_MEMBER_REMOVED).subscribe((event: any) => {
      this.handleMemberRemovedEvent(event);
    });

    this.searchUsersInputChanged.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
    ).subscribe((query_term: any) => {
      this.search_users(query_term);
    });
  }

  ngAfterViewInit() {
    const googleIsReadySub = this.googleMapsService.isReady().subscribe(
      (google) => {
        if (google) {
          this.google = google;
          this.initGoogleMaps();
        }
      },
      (error) => {
        console.log(error);
      }
    );

    this.subsList.push(googleIsReadySub);
  }

  initGoogleMaps() {
    this.map = new this.google.maps.Map(this.areaMapDiv!.nativeElement, {
      center: {
        lat: 39.173303,
        lng: -77.177274
      },
      scrollwheel: true,
      zoom: 9,
    });

    this.google.maps.event.addListener(this.map, 'bounds_changed', () => {
      const bounds = this.map.getBounds();
      const center = bounds.getCenter();
      const northEast = bounds.getNorthEast();
      const southWest = bounds.getSouthWest();

      const coordinates = {
        center: { lat: center.lat(), lng: center.lng() },
        northEast: { lat: northEast.lat(), lng: northEast.lng() },
        southWest: { lat: southWest.lat(), lng: southWest.lng() },
      };
      this.coordinates = coordinates;
    });

  }

  ngOnDestroy() {
    if (this.newWatchSub) {
      this.newWatchSub.unsubscribe();
    }
    this.currentWatchSelected = null;
    this.watches_list.forEach((c: any) => {
      try {
        this.removeListeners(c.watch_id);
      } catch (e) {
        console.error(e);
      }
    });
  }

  handleMemberAddedEvent(event: any) {
    console.log(event);
    this.watches_list.unshift(event.watch);
    this.watches_map[event.watch.id] = event.watch;
    this.addListeners(event.watch.id);
  }

  handleMemberRemovedEvent(event: any) {
    console.log(event);
    const index = this.watches_list.findIndex((c) => c.id === event.watch_id);
    if (index !== -1) {
      this.watches_list.splice(index, 1);
    }
    delete this.watches_map[event.watch_id];
    this.removeListeners(event.watch_id);
  }

  getWatches() {
    const min_timestamp =
      this.watches_list.length &&
      this.watches_list[0].updated_at;
    this.watchesService.get_user_watches(
      this.you.id,
      null,
      true
    ).subscribe({
      next: (response: any) => {
        for (const watch of response.data) {
          this.watches_list.unshift(watch);
          this.watches_map[watch.id] = watch;
          this.usersTypingMap[watch.id] = [];
          this.addListeners(watch.id);
        }
        this.watches_list_end = response.data.length < 5;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      }
    });
  }

  setWatch(watch: any) {
    if (watch === this.currentWatchSelected) {
      return;
    }
    this.watches_list_end = true;
    this.watch_messages_list = [];
    // this.usersTyping = [];
    
    // if (this.currentWatchSelected) {
    //   this.removeListeners(this.currentWatchSelected.id);
    // }

    this.currentWatchSelected = watch;

    // this.addListeners(this.currentWatchSelected.id);

    this.getWatchMessages();
    this.watchesService.update_watch_last_opened(this.you.id, this.currentWatchSelected!.id)
      .subscribe((response) => {
        console.log(`watch last opened updated`, response);
      });

    // decrement unseen count by selected watch's unseen count
    this.unseenService.decrement('watches', watch.unseen_messages_count);
  }

  addListeners(watch_id: number) {
    this.socketEventsService.joinRoom(`watch-${watch_id}`);

    this.socketTypingEmittersMap[watch_id] = this.socketEventsService.listenSocketCustom(
      EVENT_TYPES.WATCH_MESSAGE_TYPING,
      (event) => {
        console.log('member is typing...');
        if (this.you.id !== event.user.id) {
          if (!this.usersTypingMap) {
            this.usersTypingMap = {
              [watch_id]: []
            };
          }

          this.usersTypingMap[watch_id].push(event.user);
        }
      }
    );
    this.socketTypingStoppedEmittersMap[watch_id] = this.socketEventsService.listenSocketCustom(
      EVENT_TYPES.WATCH_MESSAGE_TYPING_STOPPED,
      (event) => {
        console.log('member stopped typing...');
        const index = this.usersTypingMap[watch_id].findIndex((u: any) => u.id === event.user.id);
        if (index !== -1) {
          this.usersTypingMap[watch_id].splice(index, 1);
        }
      }
    );
    this.socketMemberAddedEmittersMap[watch_id] = this.socketEventsService.listenSocketCustom(
      EVENT_TYPES.WATCH_MEMBER_ADDED,
      (event) => {
        console.log(event);
        if (this.shouldShowMemberForm) {
          this.watch_members_list.push(event.data.member);
        }
      }
    );
    this.socketMemberRemovedEmittersMap[watch_id] = this.socketEventsService.listenSocketCustom(
      EVENT_TYPES.WATCH_MEMBER_REMOVED,
      (event) => {
        console.log(event);
        if (this.shouldShowMemberForm) {
          const index = this.watch_members_list.findIndex((m) => {
            return m.id === event.data.member.id && m.user.id === event.data.member.user.id
          });
          if (index !== -1) {
            this.watch_members_list.splice(index, 1);
          }
        }
      }
    );
    this.socketNewMessageEmittersMap[watch_id] = this.socketEventsService.listenSocketCustom(
      EVENT_TYPES.NEW_WATCH_MESSAGE,
      (event) => {
        this.handleMessageEvent(event);
      }
    );
    this.socketWatchDeletedEmittersMap[watch_id] = this.socketEventsService.listenSocketCustom(
      EVENT_TYPES.WATCH_DELETED,
      (event) => {
        const index = this.watches_list.findIndex((c) => c.id === event.data.watch_id);
        if (index !== -1) {
          this.watches_list.splice(index, 1);
        }
        this.removeListeners(event.data.watch_id);
        if (event.data.watch_id === this.currentWatchSelected!.id) {
          this.currentWatchSelected = null;
        }
      }
    );
  }

  removeListeners(watch_id: number, eventType?: EVENT_TYPES)  {
    this.socketEventsService.leaveRoom(`watch-${watch_id}`);

    if (eventType) {
      if (this.socketTypingEmittersMap[watch_id]) {
        this.socketTypingEmittersMap[watch_id].off(`${eventType}:watch-${watch_id}`);
      }
      return;
    }

    if (this.socketTypingEmittersMap[watch_id]) {
      this.socketTypingEmittersMap[watch_id].off(`${EVENT_TYPES.WATCH_MESSAGE_TYPING}:watch-${watch_id}`);
    }
    if (this.socketTypingStoppedEmittersMap[watch_id]) {
      this.socketTypingStoppedEmittersMap[watch_id].off(`${EVENT_TYPES.WATCH_MESSAGE_TYPING_STOPPED}:watch-${watch_id}`);
    }
    if (this.socketMemberAddedEmittersMap[watch_id]) {
      this.socketMemberAddedEmittersMap[watch_id].off(`${EVENT_TYPES.WATCH_MEMBER_ADDED}:watch-${watch_id}`);
    }
    if (this.socketMemberRemovedEmittersMap[watch_id]) {
      this.socketMemberRemovedEmittersMap[watch_id].off(`${EVENT_TYPES.WATCH_MEMBER_REMOVED}:watch-${watch_id}`);
    }
    if (this.socketNewMessageEmittersMap[watch_id]) {
      this.socketNewMessageEmittersMap[watch_id].off(`${EVENT_TYPES.NEW_WATCH_MESSAGE}:watch-${watch_id}`);
    }
    if (this.socketWatchDeletedEmittersMap[watch_id]) {
      this.socketNewMessageEmittersMap[watch_id].off(`${EVENT_TYPES.WATCH_DELETED}:watch-${watch_id}`);
    }
  }

  handleMessageEvent(event: any) {
    console.log(`new message event ctrl - admit one:`, event);
    // check if is currently selected watch
    const isCurrentSelectedMessaging = (
      this.currentWatchSelected &&
      event.data.watch_id === this.currentWatchSelected.id
    );
    if (isCurrentSelectedMessaging) {
      // the messages list is also reflecting the watch; add the new message to the list
      this.watch_messages_list.push(event.data);
      // mark as seen 
      this.markMessageAsSeen(event.data);
      // the unseen service auto increments the count; decrement it since it is currently selected
      this.unseenService.decrement('watches', 1);
    } else {
      // check if there is an existing messaging in the list
      const watch = this.watches_list.find((c) => c.id === event.data.watch_id);
      if (watch) {
        // messaging found; user is not currently looking at it; update the unread count
        if (watch.hasOwnProperty('unseen_messages_count') && typeof(watch.unseen_messages_count) === 'number') {
          watch.unseen_messages_count++;
        }
      } else {
        // no messaging found; this must be first in history; unshift to the list (latest by date)
        console.warn(`no watch found`, { event, watch }, this);
      }
    }
  }

  setEditingState() {
    if (!this.isEditingCurrentWatchSelected) {
      this.isEditingCurrentWatchSelected = true;
      this.watchFormElm.nativeElement.title.value = this.currentWatchSelected!.title;
      this.watchForm.setValue({
        title: this.currentWatchSelected!.title,
        is_public: this.currentWatchSelected!.is_public,
      });
    } else {
      this.isEditingCurrentWatchSelected = false;
      this.watchFormElm.nativeElement.reset();
      this.watchForm.reset({
        title: ''
      });
    }
  }

  getWatchMessages() {
    const min_id =
      this.watch_messages_list.length &&
      this.watch_messages_list[0].id;
    this.watchesService.get_watch_messages(
      this.you.id,
      this.currentWatchSelected!.id,
      min_id
    ).subscribe({
      next: (response: any) => {
        for (const message of response.data) {
          this.watch_messages_list.unshift(message);
          this.markMessageAsSeen(message);
        }
        this.watch_messages_list_end = response.data.length < 5;
        if (this.currentWatchSelected!.hasOwnProperty('unseen_messages_count')) {
          this.currentWatchSelected!.unseen_messages_count = 0;
        }
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      }
    });
  }

  markMessageAsSeen(message: any) {
    this.watchesService.mark_message_as_seen(
      this.you.id,
      this.currentWatchSelected!.id,
      message.id
    ).subscribe({
      next: (response: any) => {
        message.seen = true;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      }
    });
  }

  setAddingMembersState() {
    this.shouldShowMemberForm = false;
    if (this.shouldShowAddingMemberForm) {
      this.searchUsersForm.reset();
      this.search_results = [];
    }
    this.shouldShowAddingMemberForm = !this.shouldShowAddingMemberForm;
  }

  setRemovingMembersState() {
    this.shouldShowAddingMemberForm = false;
    if (this.shouldShowMemberForm) {
      this.watch_members_list = [];
    } else {
      this.getWatchMembers();
    }
    this.shouldShowMemberForm = !this.shouldShowMemberForm;
  }

  getWatchMembers() {
    const min_id =
      this.watch_members_list.length &&
      this.watch_members_list[0].id;

    this.loading = true;
    this.watchesService.get_watch_members(
      this.you.id,
      this.currentWatchSelected!.id,
      undefined,
      true
    ).subscribe({
      next: (response: any) => {
        this.watch_members_list = response.data;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  createWatch(watchFormElm: HTMLFormElement) {
    if (!this.coordinates) {
      return;
    }
    const formData = new FormData(watchFormElm);
    formData.append(`coordinates`, JSON.stringify(this.coordinates));
    this.loading = true;
    this.watchesService.create_watch(
      this.you.id,
      formData
    ).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.watches_list.unshift(response.data.watch);
        this.watches_map[response.data.watch.id] = response.data.watch;
        this.usersTypingMap[response.data.watch.id] = [];
        this.addListeners(response.data.watch.id)
        watchFormElm.reset();
        this.watchForm.reset({
          title: '',
          is_public: false,
        });
        this.alertService.showSuccessMessage(response.message);
        this.coordinates = undefined;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  editWatch(watchFormElm: HTMLFormElement) {
    if (!this.coordinates) {
      return;
    }
    const formData = new FormData(watchFormElm.nativeElement);
    formData.append(`coordinates`, JSON.stringify(this.coordinates));
    this.loading = true;
    this.watchesService.update_watch(
      this.you.id,
      this.currentWatchSelected!.id,
      formData
    ).subscribe({
      next: (response: any) => {
        this.currentWatchSelected!.title = response.data.watch.title;
        this.currentWatchSelected!.icon_link = response.data.watch.icon_link;
        this.currentWatchSelected!.icon_id = response.data.watch.icon_id;
        this.currentWatchSelected!.is_public = response.data.watch.is_public;

        watchFormElm.nativeElement.reset();
        this.watchForm.reset({
          title: '',
          is_public: false
        });
        this.alertService.showSuccessMessage(response.message);
        this.isEditingCurrentWatchSelected = false;
        this.coordinates = undefined;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  deleteWatch() {
    const ask = window.confirm(`Are you sure you want to delete this watch? All messages will be lost for all users`);
    if (!ask) {
      return;
    }
    this.loading = true;
    this.watchesService.delete_watch(
      this.you.id,
      this.currentWatchSelected!.id
    ).subscribe({
      next: (response: any) => {
        const index = this.watches_list.findIndex((c) => c.id === this.currentWatchSelected!.id);
        if (index !== -1) {
          this.watches_list.splice(index, 1);
        }
        this.removeListeners(this.currentWatchSelected!.id);

        this.currentWatchSelected = null;
        this.alertService.showSuccessMessage(response.message);
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  search_users(query_term: string) {
    if (!query_term) {
      this.search_results = [];
      return;
    }
    this.loading = true;
    this.watchesService.search_users(
      this.you.id,
      this.currentWatchSelected!.id,
      query_term
    ).subscribe({
      next: (response: any) => {
        this.search_results = response.data;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  addWatchMember(user: IUser) {
    this.loading = true;
    this.watchesService.add_watch_member(
      this.you.id,
      this.currentWatchSelected!.id,
      user.id
    ).subscribe({
      next: (response: any) => {
        const index = this.search_results.indexOf(user);
        if (index !== -1) {
          this.search_results.splice(index, 1);
        }
        if (this.watches_map[this.currentWatchSelected!.id].hasOwnProperty('members_count')) {
          this.watches_map[this.currentWatchSelected!.id].members_count++;
        }
        this.alertService.showSuccessMessage(response.message);
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  removeWatchMember(member: any) {
    this.loading = true;
    this.watchesService.remove_watch_member(
      this.you.id,
      this.currentWatchSelected!.id,
      member.user.id
    ).subscribe({
      next: (response: any) => {
        if (this.watches_map[this.currentWatchSelected!.id].hasOwnProperty('members_count')) {
          this.watches_map[this.currentWatchSelected!.id].members_count--;
        }
        this.alertService.showSuccessMessage(response.message);
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  leaveWatch() {
    const ask = window.confirm(`Are you sure you want to leave this watch?`);
    if (!ask) {
      return;
    }
    this.loading = true;
    this.watchesService.leave_watch(
      this.you.id,
      this.currentWatchSelected!.id
    ).subscribe({
      next: (response: any) => {
        const index = this.watches_list.findIndex((c) => c.id === this.currentWatchSelected!.id);
        if (index !== -1) {
          this.watches_list.splice(index, 1);
        }
        this.removeListeners(this.currentWatchSelected!.id);

        this.currentWatchSelected = null;
        this.alertService.showSuccessMessage(response.message);
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  sendTypingSocketEvent() {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
      this.typingTimeout = setTimeout(() => {
        this.socketEventsService.emit(
          EVENT_TYPES.WATCH_MESSAGE_TYPING_STOPPED,
          { watch_id: this.currentWatchSelected!.id, user: this.you }
        );
        this.typingTimeout = null;
      }, 10000);
      return;
    }

    this.typingTimeout = setTimeout(() => {
      this.socketEventsService.emit(
        EVENT_TYPES.WATCH_MESSAGE_TYPING_STOPPED,
        { watch_id: this.currentWatchSelected!.id, user: this.you }
      );
      this.typingTimeout = null;
    }, 10000);

    this.socketEventsService.emit(
      EVENT_TYPES.WATCH_MESSAGE_TYPING,
      { watch_id: this.currentWatchSelected!.id, user: this.you }
    );
  }

  sendMessage() {
    if (this.loading) {
      return;
    }
    if (!this.messageForm.value.body.trim()) {
      return window.alert(`Message form cannot be empty`);
    }

    this.loading = true;
    this.watchesService.create_watch_message(
      this.you.id,
      this.currentWatchSelected!.id,
      this.messageForm.value
    ).subscribe({
      next: (response: any) => {
        this.messageForm.setValue({ body: '' });
        this.messageForm.get('body')!.markAsPristine();
        this.loading = false;
        if (this.typingTimeout) {
          clearTimeout(this.typingTimeout);
        }
        this.socketEventsService.emit(
          EVENT_TYPES.WATCH_MESSAGE_TYPING_STOPPED,
          { watch_id: this.currentWatchSelected!.id, user: this.you }
        );
        this.typingTimeout = null;
      },
      error: (error: HttpErrorResponse) => {
        this.alertService.handleResponseErrorGeneric(error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
