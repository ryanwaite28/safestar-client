import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ClientService } from './client.service';

@Injectable({
  providedIn: 'root'
})
export class PulsesService {

  constructor(
    private clientService: ClientService,
  ) {}

  get_pulse_by_id(pulse_id: number) {
    const endpoint = `/pulses/${pulse_id}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_pulses_count(user_id: number) {
    const endpoint = `/pulses/${user_id}/pulses-count`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_pulses_all(you_id: number) {
    const endpoint = `/pulses/${you_id}/get-pulses/all`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_pulses(you_id: number, min_id?: number) {
    const endpoint = `/pulses/${you_id}/get-pulses${min_id ? `/${min_id}` : ``}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_pulse_messages_all(pulse_id: number) {
    const endpoint = `/pulses/${pulse_id}/get-pulse-messages/all`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_pulse_messages(pulse_id: number, min_id?: number) {
    const endpoint = `/pulses/${pulse_id}/get-pulse-messages${min_id ? `/${min_id}` : ``}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }



  create_pulse(you_id: number, data: any) {
    const endpoint = `/pulses/${you_id}/create-pulse`;
    return this.clientService.sendRequest<any>(endpoint, `POST`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  create_pulse_message(you_id: number, pulse_id: number, data: any) {
    const endpoint = `/pulses/${you_id}/create-pulse-message/${pulse_id}`;
    return this.clientService.sendRequest<any>(endpoint, `POST`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  mark_pulse_as_sent_in_error(you_id: number, pulse_id: number) {
    const endpoint = `/pulses/${you_id}/mark-as-sent-in-error/${pulse_id}`;
    return this.clientService.sendRequest<any>(endpoint, `POST`).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
