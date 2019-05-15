/**
 * angular imports
 */
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
/**
 * my imports
 */
import { MainService } from './main/main.service';
import { SystemService } from './system/system.service';
import { UserService } from './user/user.service';
import { NodeService } from './node/node.service';
import { FileService } from './file/file.service';
import { CommentService } from './comment/comment.service';
import { TaxonomyTermService } from './taxonomy/taxonomy-term.service';
import { TaxonomyVocabularyService } from './taxonomy/taxonomy-vocabulary.service';
import { ViewService } from './view/view.service';
import { EntityService } from './entity/entity.service';
import { MenuService } from './menu/menu.service';
import { SystemConnection } from './models/system';
import { FacebookOAuthService } from './fboauth/fboauth.service';
import { PushNotificationsSerivce } from './push_notifications/push-notifications.service';

/**
 * implement APP_INITIALIZER
 * @param systemService system service to connect
 * @see https://gillespie59.github.io/2016/12/04/angular2-code-before-rendering.html
 */
export function init(systemService: SystemService): () => Promise<SystemConnection> {
  return () => {
    const connectionObservable = systemService.connect(true).toPromise();
    return connectionObservable;
  };
}

/**
 * main services module with providers
 * if you do not need to import all the services you need to make your own module and import the required providers only
 * ngx-cookie package is required
 * @see https://www.npmjs.com/package/ngx-cookie
 */
// @dynamic
@NgModule({
  imports: [
    HttpClientModule,
  ],
  providers: [
    MainService,
    SystemService,
    UserService,
    NodeService,
    FileService,
    CommentService,
    TaxonomyTermService,
    TaxonomyVocabularyService,
    ViewService,
    EntityService,
    MenuService,
    FacebookOAuthService,
    PushNotificationsSerivce,
    {
      'provide': APP_INITIALIZER,
      'useFactory': init,
      'deps': [SystemService],
      'multi': true
    }
  ],
})
export class Drupal7ServicesModule { }
/**
 * My English is bad and i know that
 * any comment enhancements are wellcome
 */

/**
* export services
*/
export {
  MainService,
  SystemService,
  UserService,
  NodeService,
  FileService,
  CommentService,
  TaxonomyTermService,
  TaxonomyVocabularyService,
  ViewService,
  EntityService,
  MenuService,
  FacebookOAuthService,
  PushNotificationsSerivce
};
