import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ClientService } from './client.service';

@Injectable({
  providedIn: 'root'
})
export class PhotoPulsesService {

  constructor(
    private clientService: ClientService,
  ) {}

  get_photo_pulse_by_id(photo_pulse_id: number) {
    const endpoint = `/photo-pulses/${photo_pulse_id}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_photo_pulses_count(user_id: number) {
    const endpoint = `/photo-pulses/${user_id}/photo-pulses-count`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_photo_pulses_all(you_id: number) {
    const endpoint = `/photo-pulses/${you_id}/get-photo-pulses/all`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_user_photo_pulses(you_id: number, min_id?: number) {
    const endpoint = `/photo-pulses/${you_id}/get-photo-pulses${min_id ? `/${min_id}` : ``}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_photo_pulse_messages_all(photo_pulse_id: number) {
    const endpoint = `/photo-pulses/${photo_pulse_id}/get-photo-pulse-messages/all`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_photo_pulse_messages(photo_pulse_id: number, min_id?: number) {
    const endpoint = `/photo-pulses/${photo_pulse_id}/get-photo-pulse-messages${min_id ? `/${min_id}` : ``}`;
    return this.clientService.sendRequest<any>(endpoint, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }



  create_photo_pulse(you_id: number, data: any) {
    const endpoint = `/photo-pulses/${you_id}/create-photo-pulse`;
    return this.clientService.sendRequest<any>(endpoint, `POST`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  create_photo_pulse_message(you_id: number, photo_pulse_id: number, data: any) {
    const endpoint = `/photo-pulses/${you_id}/create-photo-pulse-message/${photo_pulse_id}`;
    return this.clientService.sendRequest<any>(endpoint, `POST`, data).pipe(
      map((response) => {
        return response;
      })
    );
  }

  mark_photo_pulse_as_sent_in_error(you_id: number, photo_pulse_id: number) {
    const endpoint = `/photo-pulses/${you_id}/mark-as-sent-in-error/${photo_pulse_id}`;
    return this.clientService.sendRequest<any>(endpoint, `POST`).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
