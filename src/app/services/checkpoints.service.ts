import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ClientService } from './client.service';



@Injectable({
  providedIn: 'root'
})
export class CheckpointsService {

  constructor(
    private clientService: ClientService,
  ) {}

  get_checkpoint_by_id(checkpoint_id: number) {
    const endpoint = `/checkpoints/${checkpoint_id}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  check_user_to_user_checkpoint_pending(you_id: number, user_id: number) {
    const endpoint = `/checkpoints/${you_id}/checkpoint-pending/${user_id}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_to_user_checkpoints(you_id: number, user_id: number) {
    const endpoint = `/checkpoints/${you_id}/checkpoints-sent/${user_id}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_checkpoints_sent_all(you_id: number) {
    const endpoint = `/checkpoints/${you_id}/get-checkpoints-sent/all`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_checkpoints_sent(you_id: number, min_id?: number) {
    const endpoint = `/checkpoints/${you_id}/get-checkpoints-sent${min_id ? `/${min_id}` : ``}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_checkpoints_received_all(you_id: number) {
    const endpoint = `/checkpoints/${you_id}/get-checkpoints-received/all`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_checkpoints_received(you_id: number, min_id?: number) {
    const endpoint = `/checkpoints/${you_id}/get-checkpoints-received${min_id ? `/${min_id}` : ``}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_checkpoints_sent_all_pending(you_id: number) {
    const endpoint = `/checkpoints/${you_id}/get-checkpoints-sent-pending/all`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_checkpoints_sent_pending(you_id: number, min_id?: number) {
    const endpoint = `/checkpoints/${you_id}/get-checkpoints-sent-pending${min_id ? `/${min_id}` : ``}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_checkpoints_received_all_pending(you_id: number) {
    const endpoint = `/checkpoints/${you_id}/get-checkpoints-received-pending/all`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_checkpoints_received_pending(you_id: number, min_id?: number) {
    const endpoint = `/checkpoints/${you_id}/get-checkpoints-received-pending${min_id ? `/${min_id}` : ``}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  create_send_user_checkpoint(you_id: number, user_id: number) {
    const endpoint = `/checkpoints/${you_id}/checkpoint/${user_id}`;
    return this.clientService.sendRequest<any>(endpoint, `POST`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  respond_to_user_checkpoint_pending(you_id: number, user_id: number) {
    const endpoint = `/checkpoints/${you_id}/checkpoint-respond/${user_id}`;
    return this.clientService.sendRequest<any>(endpoint, `PUT`).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
