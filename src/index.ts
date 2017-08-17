/**
 * angular imports
 */
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

/**
 * modules imports
 */
import { CookieModule } from 'ngx-cookie';

/**
 * my imports
 */
import { DrupalConstants } from './application/drupal-constants';
import { MainService } from './main/main.service';
import { SystemService } from './system/system.service';
import { UserService } from './user/user.service';

/**
 * implement APP_INITIALIZER
 * @param systemService system service to connect
 * @see https://gillespie59.github.io/2016/12/04/angular2-code-before-rendering.html
 */
function init(systemService: SystemService) {
  return () => {
    const connectionObservable = systemService.connect();
    return connectionObservable.subscribe(connection => {
      systemService.saveSession(connection.sessid, connection.session_name, connection.user.timestamp);
      DrupalConstants.Settings.connection = connection;
    });
  };
}

/**
 * main services module with providers
 */
@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    CookieModule.forRoot(),
  ],
  declarations: [],
  providers: [
    {
      'provide': APP_INITIALIZER,
      'useFactory': init,
      'deps': [SystemService],
      'multi': true
    },
    MainService,
    SystemService,
    UserService
  ],
})
export class Drupal7ServicesModule { }

/**
 * export intrfaces
 */
export * from './models';
export { DrupalConstants };

/**
 * export services
 */
export {
  MainService,
  SystemService,
  UserService,
};
