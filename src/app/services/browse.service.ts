import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ICheckpoint } from '../interfaces/checkpoint.interface';
import { IConversation } from '../interfaces/conversation.interface';
import { IPulse } from '../interfaces/pulse.interface';
import { IUser } from '../interfaces/user.interface';
import { IWatch } from '../interfaces/watch.interface';
import { ClientService } from './client.service';

@Injectable({
  providedIn: 'root'
})
export class BrowseService {

  constructor(
    private clientService: ClientService,
  ) {}

  get_recent_users() {
    return this.clientService.sendRequest<IUser[]>(`/browse/users-recent`, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_recent_conversations() {
    return this.clientService.sendRequest<IConversation[]>(`/browse/conversations-recent`, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_recent_pulses() {
    return this.clientService.sendRequest<IPulse[]>(`/browse/pulses-recent`, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_recent_checkpoints() {
    return this.clientService.sendRequest<ICheckpoint[]>(`/browse/checkpoints-recent`, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  get_recent_watches() {
    return this.clientService.sendRequest<IWatch[]>(`/browse/watches-recent`, `GET`).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
