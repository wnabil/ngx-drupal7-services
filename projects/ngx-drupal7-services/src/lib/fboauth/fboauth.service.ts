
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';

import { MainService } from '../main/main.service';
import { DrupalConstants } from '../application/drupal-constants';
import { SystemConnection } from '../models/system';


/**
 * facebook oauth service
 * @see https://www.drupal.org/project/services_fboauth
 * @see BACK_END/admin/structure/services/list/END_POINT/resources for more details
 */
@Injectable()
export class FacebookOAuthService extends MainService {
  entityType = 'fboauth';

  /**
   * if there is already a token in the browser cookies and it is not expired this will fetch a new token before trying to connect
   * @param accessToken string of the recieved access token
   * @return observable of the connect method
   * the subscription data is an object of SystemConnection interface
   */
  connect(accessToken: string): Observable<SystemConnection> {

    if (this.isConnectionExpired()) {
      this.removeSession();
    }

    const body = {
      access_token: accessToken
    };

    if (!DrupalConstants.Connection || DrupalConstants.Connection.token) {
      return this.getToken().pipe(mergeMap(token => {
        return this.post(body, 'connect').pipe(mergeMap(connection => {
          return this.getToken().pipe(map(newToken => {
            connection.token = newToken;
            this.saveConnection(connection);
            return connection;
          }));
        }));
      }));
    }

    return this.post(body, 'connect').pipe(map(connection => {
      this.saveConnection(connection);
      return connection;
    }));
  }

  /**
   * save the user connection
   * @param connection the drupal user connection object
   */
  saveConnection(connection: SystemConnection): void {
    if (!connection.user.timestamp) {
      connection.user.timestamp = Math.floor(Date.now());
    }
    this.saveSessionToken(connection);
  }
}
