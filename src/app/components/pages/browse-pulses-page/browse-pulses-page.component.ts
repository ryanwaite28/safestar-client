import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { IPulse } from 'src/app/interfaces/pulse.interface';
import { IUser } from 'src/app/interfaces/user.interface';
import { ServiceMethodResultsInfo } from 'src/app/interfaces/_common.interface';
import { TimeAgoPipe } from 'src/app/pipes/time-ago.pipe';
import { UserFullNamePipe } from 'src/app/pipes/user-full-name.pipe';
import { AlertService } from 'src/app/services/alert.service';
import { BrowseService } from 'src/app/services/browse.service';
import { GoogleMapsService } from 'src/app/services/google-maps.service';
import { UserStoreService } from 'src/app/stores/user-store.service';

@Component({
  selector: 'app-browse-pulses-page',
  templateUrl: './browse-pulses-page.component.html',
  styleUrls: ['./browse-pulses-page.component.scss']
})
export class BrowsePulsesPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapDiv', {  }) mapDiv?: ElementRef<HTMLDivElement> | any;
  recentPulses: IPulse[] = [];
  you: IUser | null;
  subsList: Subscription[] = [];
  google: any;
  map: any;
  infowindow: any;
  markers_by_pulse_id_map: any = {};
  mapCenterSet = false;

  constructor(
    private userStore: UserStoreService,
    private browseService: BrowseService,
    private googleMapsService: GoogleMapsService,
    private userFullNamePipe: UserFullNamePipe,
    private datePipe: DatePipe,
    private timeAgoPipe: TimeAgoPipe,
    private alertService: AlertService,
  ) { }

  ngOnInit(): void {
    this.userStore.getChangesObs().subscribe((you: IUser | null) => {
      this.you = you;
    });
  }

  ngAfterViewInit() {
    const googleIsReadySub = this.googleMapsService.isReady().subscribe(
      (google) => {
        if (google) {
          this.google = google;
          this.initGoogleMaps();
          this.getRecentPulses();
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
  }

  getRecentPulses() {
    this.browseService.get_recent_pulses().subscribe({
      next: (response: ServiceMethodResultsInfo<IPulse[]>) => {
        this.recentPulses = response.data!;
        for (const pulse of this.recentPulses) {
          this.getPulseLocationText(pulse);
        }
      }
    });
  }

  getPulseLocationText(pulse: IPulse) {
    this.googleMapsService.getLocationViaCoordinates(pulse.lat, pulse.lng).subscribe({
      next: (data: any) => {
        console.log(data);
        pulse.location = data.placeData.location;
      },

      complete: () => {
        this.addMarkerFromPulse(pulse);
      },
    });
  }
  
  addMarkerFromPulse(pulse: IPulse) {
    if (!pulse.lat || !pulse.lng) {
      console.warn(`No coordinates data found on pulse`, pulse);
      return;
    }
    const pulseCoords = {
      lat: pulse.lat,
      lng: pulse.lng,
    };
    if (!this.mapCenterSet) {
      this.mapCenterSet = true;
      this.map.setCenter(pulseCoords);
    }
    const userFullName = this.userFullNamePipe.transform(null, pulse.owner!);
    const timeAgo = this.timeAgoPipe.transform(pulse.created_at);
    const latlngLastUpdated = this.datePipe.transform(pulse.created_at, `MMM d, y - h:mm a`);
    const locationLastUpdatedStr = `${latlngLastUpdated} (${timeAgo})`;
    const infoWindowContent = `<div class="infowindow-content-box flex flex-col items-center">
      <h1 class="text-2xl">${userFullName}</h1>
      <img class="mb-3 w-24 h-24 rounded-full shadow-lg" src="${pulse.owner!.icon_link || './assets/img/anon.png'}" alt="${userFullName}" />
      <p class="mb-3">Pulse Code: ${pulse.code}</p>
      ${pulse.location ? `<p class="mb-3">Location: ${pulse.location}</p>` : ``}
      <p>Created: ${locationLastUpdatedStr}</p>
      </div>`;
    const marker = new this.google.maps.Marker({
      position: pulseCoords,
      animation: this.google.maps.Animation.DROP,
      map: this.map,
      title: userFullName,
      pulse_id: pulse.id,
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

    this.markers_by_pulse_id_map[pulse.id] = marker;
  }

  showOnMap(pulse: IPulse) {
    const marker = this.markers_by_pulse_id_map[pulse.id];
    if (!marker) {
      console.warn(`No marker found by pulse`);
      return;
    }

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
  }
}
