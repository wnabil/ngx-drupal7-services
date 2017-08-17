import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import { CookieModule } from 'ngx-cookie';

import { MainService } from './main/main.service';
import { SystemService } from './system/system.service';

export function init(systemService: SystemService) {
  return () => systemService.connect();
}

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
    SystemService
  ],
})
export class Drupal7ServicesModule { }

export { MainService };
