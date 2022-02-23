import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { PlainObject } from '../interfaces/json-object.interface';
import { ClientService } from './client.service';

@Injectable({
  providedIn: 'root'
})
export class WatchesService {
  constructor(
    private clientService: ClientService,
  ) {}

  check_user_watch_member(you_id: number, watch_id: number) {
    const endpoint = `/users/${you_id}/watches/${watch_id}/check-watch-member`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  check_user_watch_member_request(you_id: number, watch_id: number) {
    const endpoint = `/users/${you_id}/watches/${watch_id}/check-watch-member-request`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  request_user_watch_member(you_id: number, watch_id: number) {
    const endpoint = `/users/${you_id}/watches/${watch_id}/send-member-request`;
    return this.clientService.sendRequest<any>(endpoint, `POST`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  cancel_request_user_watch_member(you_id: number, watch_id: number) {
    const endpoint = `/users/${you_id}/watches/${watch_id}/cancel-member-request`;
    return this.clientService.sendRequest<any>(endpoint, `POST`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  accept_request_user_watch_member(you_id: number, watch_id: number, user_id: number) {
    const endpoint = `/users/${you_id}/watches/${watch_id}/accept-member-request/${user_id}`;
    return this.clientService.sendRequest<any>(endpoint, `POST`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  reject_request_user_watch_member(you_id: number, watch_id: number, user_id: number) {
    const endpoint = `/users/${you_id}/watches/${watch_id}/reject-member-request/${user_id}`;
    return this.clientService.sendRequest<any>(endpoint, `POST`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_watches(you_id: number, timestamp?: string | null, get_all: boolean = false) {
    const endpoint = get_all
      ? '/users/' + you_id + '/watches/all'
      : timestamp
        ? '/users/' + you_id + '/watches/' + timestamp
        : '/users/' + you_id + '/watches';
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_watch(you_id: number, watch_id: number) {
    const endpoint = `/users/${you_id}/${watch_id}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_watch_messages(you_id: number, watch_id: number, min_id?: number) {
    const endpoint = min_id
      ? '/users/' + you_id + '/watches/' + watch_id + '/messages/' + min_id
      : '/users/' + you_id + '/watches/' + watch_id + '/messages';
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_watch_members(you_id: number, watch_id: number, min_id?: number, get_all?: boolean) {
    const endpoint = get_all
      ? '/users/' + you_id + '/watches/' + watch_id + '/members/all'
      : min_id
        ? '/users/' + you_id + '/watches/' + watch_id + '/members/' + min_id
        : '/users/' + you_id + '/watches/' + watch_id + '/members';
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  search_users(you_id: number, watch_id: number, query_term: string) {
    const endpoint = `/users/${you_id}/watches/${watch_id}/search-users?query_term=${query_term}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  create_watch(you_id: number, formData: FormData) {
    const endpoint = `/users/${you_id}/watches`;
    return this.clientService.sendRequest<any>(endpoint, `POST`, formData).pipe(
      map((response) => {
        return response;
      })
    );
  }

  update_watch(you_id: number, watch_id: number, formData: FormData) {
    const endpoint = `/users/${you_id}/watches/${watch_id}`;
    return this.clientService.sendRequest<any>(endpoint, `PUT`, formData).pipe(
      map((response) => {
        return response;
      })
    );
  }

  delete_watch(you_id: number, watch_id: number) {
    const endpoint = `/users/${you_id}/watches/${watch_id}`;
    return this.clientService.sendRequest<any>(endpoint, `DELETE`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  add_watch_member(you_id: number, watch_id: number, user_id: number) {
    const endpoint = '/users/' + you_id + '/watches/' + watch_id + '/members/' + user_id;
    return this.clientService.sendRequest<any>(endpoint, `POST`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  remove_watch_member(you_id: number, watch_id: number, user_id: number) {
    const endpoint = '/users/' + you_id + '/watches/' + watch_id + '/members/' + user_id;
    return this.clientService.sendRequest<any>(endpoint, `DELETE`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  leave_watch(you_id: number, watch_id: number) {
    const endpoint = '/users/' + you_id + '/watches/' + watch_id + '/members';
    return this.clientService.sendRequest<any>(endpoint, `DELETE`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  create_watch_message(you_id: number, watch_id: number, data: PlainObject) {
    const endpoint = '/users/' + you_id + '/watches/' + watch_id + '/messages';
    return this.clientService.sendRequest<any>(endpoint, `POST`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  mark_message_as_seen(you_id: number, watch_id: number, message_id: number) {
    const endpoint = '/users/' + you_id + '/watches/' + watch_id + '/messages/' + message_id + '/mark-as-seen';
    return this.clientService.sendRequest<any>(endpoint, `POST`, {}).pipe(
      map((response) => {
        return response;
      })
    );
  }

  update_watch_last_opened(you_id: number, watch_id: number) {
    return this.clientService.sendRequest<any>(`/users/${you_id}/watches/${watch_id}/update-last-opened`, `PUT`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
}
