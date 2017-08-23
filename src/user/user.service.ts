import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { MainService } from '../main/main.service';
import { DrupalConstants } from '../application/drupal-constants';
import { SystemConnection, User, LoginCredentials, CreatedUser, PasswordReset, PasswordResetResponse } from '../models';

/**
 * user service for drupal
 * @see BACK_END/admin/structure/services/list/END_POINT/resources for more details
 */
@Injectable()
export class UserService extends MainService {
  entityType = 'user';

  getUserById(uid: number): Observable<User> {
    return this.get(uid);
  }

  getUsersList(): Observable<User[]> {
    return this.get();
  }

  createUser(user: User): Observable<CreatedUser> {
    return this.post(user);
  }

  updateUser(user: User): Observable<User> {
    return this.put(user, user.uid);
  }

  deleteUser(uid: number): Observable<boolean[]> {
    return this.delete(uid);
  }

  login(user: LoginCredentials): Observable<SystemConnection> {
    const observer = this.post(user, 'login');
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

  requestNewPassword(useranme: string): Observable<boolean[]> {
    const user = {
      name: useranme
    };
    return this.post(user, 'request_new_password');
  }

  userPasswordReset(passwordReset: PasswordReset): Observable<PasswordResetResponse> {
    return this.post(passwordReset, 'user_pass_reset');
  }

  registerAccount(user: User): Observable<CreatedUser> {
    return this.post(user, 'register');
  }

  cancelUser(uid: number): Observable<boolean[]> {
    return this.post(`${uid}/cancel`);
  }

  passwordReset(uid: number): Observable<boolean[]> {
    return this.post(`${uid}/password_reset`);
  }

  resendWelcomeEmail(uid: number): Observable<boolean[]> {
    return this.post(`${uid}/resend_welcome_email`);
  }

}
