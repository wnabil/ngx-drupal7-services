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
    if (DrupalConstants.Connection) {
      return Observable.of(DrupalConstants.Connection);
    }

    if (this.isConnectionExpired()) {
      this.removeSession();
    }

    this.cookieService.remove("token");
    return this.getToken().flatMap(token => {
      this.cookieService.put("token", token);
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
}
