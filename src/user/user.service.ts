import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { MainService } from '../main/main.service';
import { DrupalConstants } from '../application/drupal-constants';
import { SystemConnection, User } from '../models';

/**
 * user service for drupal
 * @see BACK_END/admin/structure/services/list/END_POINT/resources for more details
 */
@Injectable()
export class UserService extends MainService {
  entityType = 'user';

  getUserById(uid: number): Observable<User> {
    return this.get('', uid);
  }

  getUsersList(): Observable<User[]> {
    return this.get();
  }

  createUser(user: any): Observable<User> {
    return this.post('', user);
  }

}
