import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { MainService } from '../main/main.service';
import { DrupalConstants } from '../application/drupal-constants';
import { SystemConnection } from '../models/system';


/**
 * system service for drupal
 * @see BACK_END/admin/structure/services/list/END_POINT/resources for more details
 */
@Injectable()
export class SystemService extends MainService {
  entityType = 'system';

  /**
   * if there is already a token in the browser cookies and it is not expired this will fetch a new token before trying to connect
   * @return observable of the connect method
   * the subscription data is an object of System interface
   */
  connect(): Observable<SystemConnection> {
    if (DrupalConstants.Settings.connection) {
      return Observable.of(DrupalConstants.Settings.connection);
    }

    if (this.isConnectionExpired()) {
      this.removeSession();
    }

    return this.getToken().flatMap(token => {
      this.saveToken(token);
      return this.post("connect");
    });
  }

  // TODO
  get_variable(variableName) {
    return;
  }

  // TODO
  set_variable(variableName, value) {
    return;
  }

  // TODO
  del_variable(variableName) {
    return;
  }

  public saveSession(sessid: string, session_name: string, timestamp: number, token?: string): void {
    if (token) {
      this.saveToken(token);
    }
    this.cookieService.put("sessid", sessid);
    this.cookieService.put("session_name", session_name);
    this.cookieService.put("timestamp", timestamp.toString());
  }

  public removeSession(): void {
    this.cookieService.remove("token");
    this.cookieService.remove("sessid");
    this.cookieService.remove("session_name");
    this.cookieService.remove("timestamp");
  }

  private saveToken(token: string): void {
    this.cookieService.put("token", token);
  }

  private isConnected(): boolean {
    return this.cookieService.get("token") &&
    this.cookieService.get("sessid") &&
    this.cookieService.get("session_name") &&
    !this.isConnectionExpired() ?
    true : false;
  }

  private isConnectionExpired(): boolean {
    const nowTS = Math.floor(Date.now());
    const expirationTS = 1987200000;
    return nowTS - +this.cookieService.get("timestamp") < expirationTS
  }
}
