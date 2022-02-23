import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ClientService } from './client.service';

@Injectable({
  providedIn: 'root'
})
export class TrackingsService {

  constructor(
    private clientService: ClientService,
  ) {}

  get_user_trackers_count(you_id: number) {
    const endpoint = `/trackings/${you_id}/trackers-count`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_trackings_count(you_id: number) {
    const endpoint = `/trackings/${you_id}/trackings-count`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  check_user_tracking(you_id: number, user_id: number) {
    const endpoint = `/trackings/${you_id}/tracking/${user_id}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  check_user_tracking_request(you_id: number, user_id: number) {
    const endpoint = `/trackings/${you_id}/tracking-request/${user_id}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }



  get_user_trackers_all(you_id: number) {
    const endpoint = `/trackings/${you_id}/get-trackers/all`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }
  get_user_trackers(you_id: number, min_id: number) {
    const endpoint = `/trackings/${you_id}/get-trackers${min_id ? `/${min_id}` : ``}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_trackings_all(you_id: number) {
    const endpoint = `/trackings/${you_id}/get-trackings/all`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }
  get_user_trackings(you_id: number, min_id: number) {
    const endpoint = `/trackings/${you_id}/get-trackings${min_id ? `/${min_id}` : ``}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_tracker_requests_all(you_id: number) {
    const endpoint = `/trackings/${you_id}/get-tracker-requests/all`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }
  get_user_tracker_requests(you_id: number, min_id?: number) {
    const endpoint = `/trackings/${you_id}/get-tracker-requests${min_id ? `/${min_id}` : ``}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_tracking_requests_all(you_id: number) {
    const endpoint = `/trackings/${you_id}/get-tracking-requests/all`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }
  get_user_tracking_requests(you_id: number, min_id?: number) {
    const endpoint = `/trackings/${you_id}/get-tracking-requests${min_id ? `/${min_id}` : ``}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_tracker_requests_pending_all(you_id: number) {
    const endpoint = `/trackings/${you_id}/get-tracker-requests-pending/all`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }
  get_user_tracker_requests_pending(you_id: number, min_id?: number) {
    const endpoint = `/trackings/${you_id}/get-tracker-requests-pending${min_id ? `/${min_id}` : ``}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_tracking_requests_pending_all(you_id: number) {
    const endpoint = `/trackings/${you_id}/get-tracking-requests-pending/all`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }
  get_user_tracking_requests_pending(you_id: number, min_id?: number) {
    const endpoint = `/trackings/${you_id}/get-tracking-requests-pending${min_id ? `/${min_id}` : ``}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }




  request_user_tracking(you_id: number, user_id: number) {
    const endpoint = `/trackings/${you_id}/request-tracking/${user_id}`;
    return this.clientService.sendRequest<any>(endpoint, `POST`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  cancel_request_user_tracking(you_id: number, user_id: number) {
    const endpoint = `/trackings/${you_id}/cancel-request-tracking/${user_id}`;
    return this.clientService.sendRequest<any>(endpoint, `POST`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  accept_request_user_tracking(you_id: number, user_id: number) {
    const endpoint = `/trackings/${you_id}/accept-request-tracking/${user_id}`;
    return this.clientService.sendRequest<any>(endpoint, `POST`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  reject_request_user_tracking(you_id: number, user_id: number) {
    const endpoint = `/trackings/${you_id}/reject-request-tracking/${user_id}`;
    return this.clientService.sendRequest<any>(endpoint, `POST`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  stop_tracking(you_id: number, user_id: number) {
    const endpoint = `/trackings/${you_id}/stop-tracking/${user_id}`;
    return this.clientService.sendRequest<any>(endpoint, `DELETE`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  stop_tracker(you_id: number, user_id: number) {
    const endpoint = `/trackings/${you_id}/stop-tracker/${user_id}`;
    return this.clientService.sendRequest<any>(endpoint, `DELETE`).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
