import { Injectable } from '@angular/core';
import { IUser } from '../interfaces/user.interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {
  private you?: IUser | null;
  private changes: BehaviorSubject<IUser | null>;

  constructor() {
    this.changes = new BehaviorSubject<IUser | null>(<any> undefined);
  }

  getChangesObs(): Observable<IUser | null> {
    return this.changes.asObservable();
  }

  getLatestState(): IUser | null{
    return this.you ? { ...this.you } : null;
  }

  setState(newState: IUser | null) {
    this.you = newState ? <IUser> { ...newState } : null;
    const newEvent = this.you ? { ...this.you } : null;
    this.changes.next(<IUser | null> newEvent);
  }

  mergeState(newChanges: Partial<IUser>, emitEvent: boolean = true) {
    const newState = this.you ? { ...this.you } : {};
    Object.assign(newState, { ...newChanges });
    this.you = <IUser> newState;
    if (emitEvent) {
      this.changes.next({ ...this.you });
    }
  }
}
