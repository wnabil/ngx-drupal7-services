import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { Drupal7ServicesModule, DrupalConstants, Settings } from '../../../index';

import { Observable } from 'rxjs/Rx';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    Drupal7ServicesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor () {
    const drupalSettings: Settings = {
      apiEndPoint: 'api',
      apiHost: 'localhost',
      apiProtocol: 'http',
      language: 'und',
      requestTimeout: 5000,
      allowOffline: true,
      sessionDays: 90,
    };
    DrupalConstants.Settings = drupalSettings;
    // OPTIONAL
    DrupalConstants.Instance.handleOffline = this.customHandle;
  }

  /**
   * OPTIONAL
   * custom http offline handler
   * you can add sweet alert message for example
   */
  customHandle() {
    alert("custom offline handler! you are offline");
    return Observable.of();
  }
}
