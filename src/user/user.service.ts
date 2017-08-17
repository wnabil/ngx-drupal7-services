import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { MainService } from '../main/main.service';
import { DrupalConstants } from '../application/drupal-constants';
import { SystemConnection, User, LoginCredentials } from '../models';

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

  createUser(user: User): Observable<User> {
    return this.post('', user);
  }

  updateUser(user: User): Observable<User> {
    return this.put('', user.uid, user);
  }

  deleteUser(uid: number): Observable<boolean[]> {
    return this.delete('', uid);
  }

  login(user: LoginCredentials): Observable<SystemConnection> {
    const observer = this.post('login', user);
    return observer.map((connection: SystemConnection) => {
      this.saveSession(connection.sessid, connection.session_name, connection.user.login, connection.token);
      return connection;
    });
  }

  logout(): Observable<string> {
    const observer = this.post('logout');
    return observer.flatMap((loggedOut: boolean[]) => {
      if (loggedOut[0]) {
        this.removeSession();
        return this.getToken();
      }
    });
  }

}
