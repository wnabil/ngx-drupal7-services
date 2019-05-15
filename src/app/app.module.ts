import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Drupal7ServicesModule } from 'ngx-drupal7-services';
import { AppComponent } from './app.component';
import { DrupalConstants } from 'ngx-drupal7-services';

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
  constructor() {
    DrupalConstants.Settings = {
      apiHost: 'localhost',
      apiEndPoint: 'api',
      language: 'und',
      requestTimeout: 1000,
      apiProtocol: 'http',
      allowOffline: true,
    };
  }
}
