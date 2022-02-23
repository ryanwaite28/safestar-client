import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { EVENT_TYPES } from 'src/app/enums/all.enums';
import { ITracking, ITrackingRequest } from 'src/app/interfaces/tracking.model';
import { IUser } from 'src/app/interfaces/user.interface';
import { ServiceMethodResultsInfo } from 'src/app/interfaces/_common.interface';
import { TimeAgoPipe } from 'src/app/pipes/time-ago.pipe';
import { UserFullNamePipe } from 'src/app/pipes/user-full-name.pipe';
import { AlertService } from 'src/app/services/alert.service';
import { GoogleMapsService } from 'src/app/services/google-maps.service';
import { SocketEventsService } from 'src/app/services/socket-events.service';
import { TrackingsService } from 'src/app/services/trackings.service';
import { UnseenService } from 'src/app/services/unseen.service';
import { UsersService } from 'src/app/services/users.service';
import { UserStoreService } from 'src/app/stores/user-store.service';
import { getUserFullName } from 'src/app/_misc/chamber';

@Component({
  selector: 'app-user-trackings-page',
  templateUrl: './user-trackings-page.component.html',
  styleUrls: ['./user-trackings-page.component.scss']
})
export class UserTrackingsPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapDiv', {  }) mapDiv?: ElementRef<HTMLDivElement> | any;

  you: IUser | null;
  
  trackers: ITracking[] = [];
  tracker_requests: ITrackingRequest[] = [];
  trackings: ITracking[] = [];
  tracking_requests: ITrackingRequest[] = [];
  
  trackers_loading = false;
  trackings_loading = false;
  tracker_requests_loading = false;
  tracking_requests_loading = false;

  trackers_list_show = true;
  trackings_list_show = true;
  tracker_requests_list_show = true;
  tracking_requests_list_show = true;

  trackers_end_reached = true;
  trackings_end_reached = true;
  tracker_requests_end_reached = true;
  tracking_requests_end_reached = true;

  subsList: Subscription[];

  google: any;
  map: any;
  markersMap: any = {};
  directionsRenderer: any;
  directionsService: any;
  infowindow: any;
  updating_location = false;
  mapCenterSet = false;

  currentView = 'LIST_VIEW';

  constructor(
    private userStore: UserStoreService,
    private usersService: UsersService,
    private userFullNamePipe: UserFullNamePipe,
    private datePipe: DatePipe,
    private timeAgoPipe: TimeAgoPipe,
    private googleMapsService: GoogleMapsService,
    private socketEventsService: SocketEventsService,
    private trackingsService: TrackingsService,
    private alertService: AlertService,
    private unseenService: UnseenService,
  ) { }

  ngOnInit(): void {
    this.userStore.getChangesObs().subscribe((you: IUser | null) => {
      this.you = you;
      if (you) {
        this.getTrackers();
        this.getTrackings();
        this.getTrackerRequests();
        this.getTrackingRequests();

        this.subsList = [
          EVENT_TYPES.STOP_TRACKER, // user stopped you from tracking them
          EVENT_TYPES.STOP_TRACKING, // user stopped tracking you

          EVENT_TYPES.NEW_TRACKER_REQUEST, // user request to track you
          EVENT_TYPES.NEW_TRACKER_REQUEST_CANCELED, // user canceled their request to track you
          EVENT_TYPES.NEW_TRACKER_REQUEST_ACCEPTED, // user accepted your request to track them
          EVENT_TYPES.NEW_TRACKER_REQUEST_REJECTED, // user rejected your request to track them
        ].map((event_type: EVENT_TYPES) => {
          return this.socketEventsService.listenToObservableEventStream(event_type).subscribe((event: any) => {
            console.log(event);
            this.handleEvent(event);
          });
        });
      }
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

  ngOnDestroy() {
    this.subsList?.forEach(sub => sub?.unsubscribe());
  }

  initGoogleMaps() {
    this.map = new this.google.maps.Map(this.mapDiv!.nativeElement, {
      center: {
        lat: 39.173303,
        lng: -77.177274
      },
      scrollwheel: true,
      zoom: 9,
    });

    this.infowindow = new this.google.maps.InfoWindow();
    this.directionsRenderer = new this.google.maps.DirectionsRenderer();
    this.directionsService = new this.google.maps.DirectionsService();

    this.directionsRenderer.setMap(this.map);
  }

  handleEvent(event: any) {
    switch (event.event as EVENT_TYPES) {
      case EVENT_TYPES.NEW_TRACKER_REQUEST: {
        if (!event.tracking_request) {
          console.log({ event });
          throw new TypeError(`Event did not have tracking_request property`);
        }
        this.tracker_requests?.unshift(event.tracking_request);
        break;
      }

      case EVENT_TYPES.NEW_TRACKER_REQUEST_CANCELED: {
        if (!event.tracking_request) {
          console.log({ event });
          throw new TypeError(`Event did not have tracking_request property`);
        }
        const i = this.tracker_requests?.findIndex(t => t.id === event.tracking_request.id);
        if (i > -1) {
          this.tracker_requests?.splice(i, 1);
        }
        break;
      }

      case EVENT_TYPES.NEW_TRACKER_REQUEST_ACCEPTED: {
        if (!event.tracking_request) {
          console.log({ event });
          throw new TypeError(`Event did not have tracking_request property`);
        }
        const i = this.tracking_requests?.findIndex(t => t.id === event.tracking_request.id);
        if (i > -1) {
          this.tracking_requests?.splice(i, 1);
        }
        if (event.tracking) {
          this.trackings?.unshift(event.tracking);
        }
        break;
      }
      
      case EVENT_TYPES.NEW_TRACKER_REQUEST_REJECTED: {
        if (!event.tracking_request) {
          console.log({ event });
          throw new TypeError(`Event did not have tracking_request property`);
        }
        const i = this.tracking_requests?.findIndex(t => t.id === event.tracking_request.id);
        if (i > -1) {
          this.tracking_requests?.splice(i, 1);
        }
        break;
      }

      case EVENT_TYPES.STOP_TRACKER: {
        if (!event.tracking) {
          console.log({ event });
          throw new TypeError(`Event did not have tracking property`);
        }
        const i = this.trackings?.findIndex(t => t.id === event.tracking.id);
        if (i > -1) {
          this.trackings?.splice(i, 1);
        }
        break;
      }
      case EVENT_TYPES.STOP_TRACKING: {
        if (!event.tracking) {
          console.log({ event });
          throw new TypeError(`Event did not have tracking property`);
        }
        const i = this.trackers?.findIndex(t => t.id === event.tracking.id);
        if (i > -1) {
          this.trackers?.splice(i, 1);
        }
        break;
      }
    }
  }

  addMarkerFromTracking(tracking: ITracking) {
    if (!tracking.track_user!.latest_lat || !tracking.track_user!.latest_lng) {
      console.warn(`No coordinates data found on user`, tracking);
      return;
    }
    if (!this.mapCenterSet) {
      this.mapCenterSet = true;
      this.map.setCenter({
        lng: tracking.track_user!.latest_lng,
        lat: tracking.track_user!.latest_lat,
      });
    }
    const userFullName = this.userFullNamePipe.transform(null, tracking.track_user!);
    const timeAgo = this.timeAgoPipe.transform(tracking.track_user!.latlng_last_updated);
    const latlngLastUpdated = this.datePipe.transform(tracking.track_user!.latlng_last_updated, `MMM d, y - h:mm a`);
    const locationLastUpdatedStr = `${latlngLastUpdated} (${timeAgo})`;
    const infoWindowContent = `<div class="infowindow-content-box flex flex-col items-center">
      <h1 class="text-2xl">${userFullName}</h1>
      <img class="mb-3 w-24 h-24 rounded-full shadow-lg" src="${tracking.track_user!.icon_link || './assets/img/anon.png'}" alt="${userFullName}" />
      <p>Updated: ${locationLastUpdatedStr}</p>
      </div>`;
    const marker = new this.google.maps.Marker({
      position: { lat: tracking.track_user!.latest_lat, lng: tracking.track_user!.latest_lng, },
      animation: this.google.maps.Animation.DROP,
      map: this.map,
      title: userFullName,
      tracking_id: tracking.id,
      infoWindowContent,
    });
    marker.addListener("click", () => {
      if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
      } else {
        marker.setAnimation(this.google.maps.Animation.BOUNCE);
      }
      setTimeout(function() {
        marker.setAnimation(null);
      }, 1500);
      this.infowindow.setContent(marker.infoWindowContent);
      this.infowindow.open({
        anchor: marker,
        map: this.map,
        shouldFocus: false,
      });
    });

    this.markersMap[tracking.id] = marker;
  }

  getTrackers() {
    const min_id = this.trackers.length && this.trackers[this.trackers.length - 1].id;
    this.trackers_loading = true;
    this.trackingsService.get_user_trackers(this.you!.id, min_id)
    .pipe(
      finalize(() => {
        this.trackers_loading = false;
      })
    )
    .subscribe({
      next: (response: ServiceMethodResultsInfo<ITracking[]>) => {
        for (const item of response.data!) {
          this.trackers.push(item);
        }
        this.trackers_end_reached = response.data!.length < 5;
      }
    });
  }
  
  getTrackings() {
    const min_id = this.trackings.length && this.trackings[this.trackings.length - 1].id;
    this.trackings_loading = true;
    this.trackingsService.get_user_trackings(this.you!.id, min_id)
    .pipe(
      finalize(() => {
        this.trackings_loading = false;
      })
      )
      .subscribe({
        next: (response: ServiceMethodResultsInfo<ITracking[]>) => {
          for (const item of response.data!) {
          this.trackings.push(item);
          this.addMarkerFromTracking(item);
        }
        this.trackings_end_reached = response.data!.length < 5;
      }
    });
  }

  getTrackerRequests() {
    const min_id = this.tracker_requests.length && this.tracker_requests[this.tracker_requests.length - 1].id;
    this.tracker_requests_loading = true;
    this.trackingsService.get_user_tracker_requests_pending(this.you!.id, min_id)
    .pipe(
      finalize(() => {
        this.tracker_requests_loading = false;
      })
    )
    .subscribe({
      next: (response) => {
        for (const item of response.data) {
          this.tracker_requests.push(item);
        }
        this.tracker_requests_end_reached = response.data.length < 5;
      }
    });
  }

  getTrackingRequests() {
    const min_id = this.tracking_requests.length && this.tracking_requests[this.tracking_requests.length - 1].id;
    this.tracking_requests_loading = true;
    this.trackingsService.get_user_tracking_requests_pending(this.you!.id, min_id)
    .pipe(
      finalize(() => {
        this.tracking_requests_loading = false;
      })
    )
    .subscribe({
      next: (response) => {
        for (const item of response.data) {
          this.tracking_requests.push(item);
        }
        this.tracking_requests_end_reached = response.data.length < 5;
      }
    });
  }



  cancelTrackingRequest(request: ITrackingRequest) {
    this.trackingsService.cancel_request_user_tracking(this.you!.id, request.tracking!.id).subscribe({
      next: (response) => {
        const i = this.tracking_requests?.findIndex(t => t.id === request.id);
        if (i > -1) {
          this.tracking_requests?.splice(i, 1);
          this.unseenService.decrement('trackings', 1);
        }
      }
    });
  }

  acceptTrackingRequest(request: ITrackingRequest) {
    const fullName = getUserFullName(request.user!);
    const ask: boolean = window.confirm(`Accept tracking request from ${fullName}?`);
    if (!ask) {
      return;
    }
    this.trackingsService.accept_request_user_tracking(this.you!.id, request.user!.id).subscribe({
      next: (response) => {
        const i = this.tracker_requests?.findIndex(t => t.id === request.id);
        if (i > -1) {
          this.tracker_requests?.splice(i, 1);
          this.unseenService.decrement('trackings', 1);
        }
        if (response.data) {
          this.trackers?.unshift(response.data);
        }
      }
    });
  }

  rejectTrackingRequest(request: ITrackingRequest) {
    const fullName = getUserFullName(request.user!);
    const ask: boolean = window.confirm(`Reject tracking request from ${fullName}?`);
    if (!ask) {
      return;
    }
    this.trackingsService.reject_request_user_tracking(this.you!.id, request.user!.id).subscribe({
      next: (response) => {
        const i = this.tracker_requests?.findIndex(t => t.id === request.id);
        if (i > -1) {
          this.tracker_requests?.splice(i, 1);
          this.unseenService.decrement('trackings', 1);
        }
      }
    });
  }

  stopTracking(tracking: ITracking) {
    const fullName = getUserFullName(tracking.track_user!);
    const ask: boolean = window.confirm(`Stop tracking ${fullName}?`);
    if (!ask) {
      return;
    }
    this.trackingsService.stop_tracking(this.you!.id, tracking.track_user!.id).subscribe({
      next: (response) => {
        const i = this.trackings?.findIndex(t => t.id === tracking.id);
        if (i > -1) {
          this.trackings?.splice(i, 1);
        }
      }
    });
  }

  stopTracker(tracker: ITracking) {
    const fullName = getUserFullName(tracker.track_user!);
    const ask: boolean = window.confirm(`Stop ${fullName} from tracking you?`);
    if (!ask) {
      return;
    }
    this.trackingsService.stop_tracker(this.you!.id, tracker.user!.id).subscribe({
      next: (response) => {
        const i = this.trackers?.findIndex(t => t.id === tracker.id);
        if (i > -1) {
          this.trackers?.splice(i, 1);
        }
      }
    });
  }

  updateLatestLocation() {
    this.updating_location = true;

    this.googleMapsService.getCurrentLocation()
    .subscribe({
      next: (position) => {
        console.log(position);
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        this.usersService.update_latest_coordinates(this.you!.id, { lat, lng, automated: false })
        .pipe(
          finalize(() => {
            this.updating_location = false;
          })
        )
        .subscribe({
          next: (response) => {
            console.log(response);
            this.alertService.showSuccessMessage(response.message!);
          }
        });
      },
      error: (error) => {
        this.updating_location = false;
      }
    });
  }
}
