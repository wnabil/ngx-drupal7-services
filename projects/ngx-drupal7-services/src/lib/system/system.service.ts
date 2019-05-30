
import { mergeMap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
   * if there is already a token in the browser cookies and it is not expired it will return it
   * this will fetch a new token before trying to connect
   * @param refreshToken boolean to force the application to request new token
   * @return observable of the connect method
   * the subscription data is an object of SystemConnection interface
   */
  connect(refreshToken: boolean = false): Observable<SystemConnection> {

    if (this.isConnectionExpired()) {
      this.removeSession();
    }

    if (!DrupalConstants.Connection || !DrupalConstants.Connection.token || refreshToken) {
      return this.getToken().pipe(mergeMap(token => {
        return this.post({}, 'connect').pipe(map(connection => {
          connection.token = token;
          this.saveSessionToken(connection);
          return connection;
        }));
      }));
    }

    return this.post({}, 'connect').pipe(map(connection => {
      this.saveSessionToken(connection);
      return connection;
    }));
  }

  /**
   * implement get_variable resource
   * @param variableName the name of the variable
   * @return the value of the variable
   */
  getVariable(variableName: string): Observable<any[]> {
    return this.post({ name: variableName }, 'get_variable');
  }

  /**
   * implement set_variable resource
   * @param variableName the name of the variable
   * @param value the value to set for the variable
   * @return always null, take care of overriding old variables with same name
   */
  setVariable(variableName: string, value: any): Observable<null> {
    const variable = {
      name: variableName,
      value: value
    };
    return this.post(variable, 'set_variable');
  }

  /**
   * implement del_variable resource
   * @param variableName variable name to delete
   * @return null if variable found or not.
   */
  delVariable(variableName: string): Observable<null> {
    return this.post({ name: variableName }, 'del_variable');
  }
}
