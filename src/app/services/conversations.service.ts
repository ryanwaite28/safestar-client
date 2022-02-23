import { Injectable } from '@angular/core';
import { ClientService } from './client.service';
import { HttpClient } from '@angular/common/http';
import { UserStoreService } from '../stores/user-store.service';
import { map } from 'rxjs/operators';
import { PlainObject } from '../interfaces/json-object.interface';

@Injectable({
  providedIn: 'root'
})
export class ConversationsService {
  constructor(
    private clientService: ClientService,
  ) {}

  check_user_conversation_member(you_id: number, conversation_id: number) {
    const endpoint = `/users/${you_id}/conversations/${conversation_id}/check-conversation-member`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  check_user_conversation_member_request(you_id: number, conversation_id: number) {
    const endpoint = `/users/${you_id}/conversations/${conversation_id}/check-conversation-member-request`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  request_user_conversation_member(you_id: number, conversation_id: number) {
    const endpoint = `/users/${you_id}/conversations/${conversation_id}/send-member-request`;
    return this.clientService.sendRequest<any>(endpoint, `POST`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  cancel_request_user_conversation_member(you_id: number, conversation_id: number) {
    const endpoint = `/users/${you_id}/conversations/${conversation_id}/cancel-member-request`;
    return this.clientService.sendRequest<any>(endpoint, `POST`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  accept_request_user_conversation_member(you_id: number, conversation_id: number, user_id: number) {
    const endpoint = `/users/${you_id}/conversations/${conversation_id}/accept-member-request/${user_id}`;
    return this.clientService.sendRequest<any>(endpoint, `POST`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  reject_request_user_conversation_member(you_id: number, conversation_id: number, user_id: number) {
    const endpoint = `/users/${you_id}/conversations/${conversation_id}/reject-member-request/${user_id}`;
    return this.clientService.sendRequest<any>(endpoint, `POST`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_conversations(you_id: number, timestamp?: string | null, get_all: boolean = false) {
    const endpoint = get_all
      ? '/users/' + you_id + '/conversations/all'
      : timestamp
        ? '/users/' + you_id + '/conversations/' + timestamp
        : '/users/' + you_id + '/conversations';
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_conversation(you_id: number, conversation_id: number) {
    const endpoint = `/users/${you_id}/${conversation_id}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_conversation_messages(you_id: number, conversation_id: number, min_id?: number) {
    const endpoint = min_id
      ? '/users/' + you_id + '/conversations/' + conversation_id + '/messages/' + min_id
      : '/users/' + you_id + '/conversations/' + conversation_id + '/messages';
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_conversation_members(you_id: number, conversation_id: number, min_id?: number, get_all?: boolean) {
    const endpoint = get_all
      ? '/users/' + you_id + '/conversations/' + conversation_id + '/members/all'
      : min_id
        ? '/users/' + you_id + '/conversations/' + conversation_id + '/members/' + min_id
        : '/users/' + you_id + '/conversations/' + conversation_id + '/members';
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  search_users(you_id: number, conversation_id: number, query_term: string) {
    const endpoint = `/users/${you_id}/conversations/${conversation_id}/search-users?query_term=${query_term}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  create_conversation(you_id: number, formData: FormData) {
    const endpoint = `/users/${you_id}/conversations`;
    return this.clientService.sendRequest<any>(endpoint, `POST`, formData).pipe(
      map((response) => {
        return response;
      })
    );
  }

  update_conversation(you_id: number, conversation_id: number, formData: FormData) {
    const endpoint = `/users/${you_id}/conversations/${conversation_id}`;
    return this.clientService.sendRequest<any>(endpoint, `PUT`, formData).pipe(
      map((response) => {
        return response;
      })
    );
  }

  delete_conversation(you_id: number, conversation_id: number) {
    const endpoint = `/users/${you_id}/conversations/${conversation_id}`;
    return this.clientService.sendRequest<any>(endpoint, `DELETE`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  add_conversation_member(you_id: number, conversation_id: number, user_id: number) {
    const endpoint = '/users/' + you_id + '/conversations/' + conversation_id + '/members/' + user_id;
    return this.clientService.sendRequest<any>(endpoint, `POST`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  remove_conversation_member(you_id: number, conversation_id: number, user_id: number) {
    const endpoint = '/users/' + you_id + '/conversations/' + conversation_id + '/members/' + user_id;
    return this.clientService.sendRequest<any>(endpoint, `DELETE`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  leave_conversation(you_id: number, conversation_id: number) {
    const endpoint = '/users/' + you_id + '/conversations/' + conversation_id + '/members';
    return this.clientService.sendRequest<any>(endpoint, `DELETE`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  create_conversation_message(you_id: number, conversation_id: number, data: PlainObject) {
    const endpoint = '/users/' + you_id + '/conversations/' + conversation_id + '/messages';
    return this.clientService.sendRequest<any>(endpoint, `POST`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  mark_message_as_seen(you_id: number, conversation_id: number, message_id: number) {
    const endpoint = '/users/' + you_id + '/conversations/' + conversation_id + '/messages/' + message_id + '/mark-as-seen';
    return this.clientService.sendRequest<any>(endpoint, `POST`, {}).pipe(
      map((response) => {
        return response;
      })
    );
  }

  update_conversation_last_opened(you_id: number, conversation_id: number) {
    return this.clientService.sendRequest<any>(`/users/${you_id}/conversations/${conversation_id}/update-last-opened`, `PUT`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }
}
