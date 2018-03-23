# Angular 2+/Ionic 2+ Drupal 7 Services
#### Typescript angular module for [Drupal Services 3.x](https://www.drupal.org/project/services)

[![npm version](https://badge.fury.io/js/ngx-drupal7-services.svg)](https://badge.fury.io/js/ngx-drupal7-services)  

Angular Drupal 7 Services is a REST client for Angular 2+, which allows you to use predefined functions when communication with Drupal's api endpoints.  
Unlike the other project focusing on the same topic, Angular Drupal 7 Services is precisely organized around the [Drupal Services 3.x](https://www.drupal.org/project/services) architecture and naming conventions.   
  
It optionally provides events next to the common used observable approach.

A full set of Drupal's resources is available, and all basic workflow's depending to authentication or helpers for CRUD operations are also provided as a set of extra modules.

Also supports Server Side Rendering "Angular Universal".

## DEMOS
Check out the [Demo folder](https://github.com/wnabil/ngx-drupal7-services/tree/master/demo) for a full demo.

Running the demo:
```bash
git clone git@github.com:wnabil/ngx-drupal7-services.git
cd ngx-drupal7-services
npm install
ng serve
```
Then navigate to `localhost:4200` via your browser.

## Get Started

**(1)** Get Angular Drupal 7 Services:
```bash
npm install --save ngx-drupal7-services
```

**(2)** import `ngx-drupal7-services` in your `app.module.ts` and `imports` array.
```javascript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { Drupal7ServicesModule, DrupalConstants, Settings } from 'ngx-drupal7-services';

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
```

**(3)** Implement `'DrupalConstants.Settings'` to add the back-end configuration and add it to `AppModule' constructor.

```javascript
export class AppModule {
  constructor () {
    const drupalSettings: Settings = {
      apiEndPoint: 'api',
      apiHost: 'localhost',
      apiProtocol: 'http',
      language: 'und',
      requestTimeout: 5000,
      allowOffline: true // optional
    };
    DrupalConstants.Settings = drupalSettings;
    // OPTIONAL
    DrupalConstants.Instance.handleOffline = this.customHandle;
  }

  /**
   * OPTIONAL
   * custom http offline handler
   * you can add sweet alert message for example
   * Note that you always must return an Observable
   */
  customHandle() {
    alert("custom offline handler! you are offline");
    return Observable.of();
  }
}
```

**(4)** Import the required service into your component and use the methods inside it
```javascript 
import { UserService } from 'ngx-drupal7-services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private userService: UserService) { }

  login(username: string, password: string) {
    const user = {
      username: username,
      password: password
    };
    this.userService.login(user).subscribe(connection => {
      // re-direct to user pofile or show welcome message.
    });
  }
}
```

## Contribution, Ideas and pull requests are welcome, Please open an issue on Github or contact me on w.nabil@orangestudio.com if i didn't response in approx 2 days.

## Configuration
Basically all configurable options are wrapped in an angular constant.
You must implement your own application configuration for the DrupalConstants.Settings as shown above.

## Supported Drupal Modules
Here is a list of supported Drupal services 3.x modules "Others are still WIP":
- [x] [Services](https://www.drupal.org/project/services) **7 Resources**
- [x] [Services Views](https://www.drupal.org/project/services_view) **1 Resources**
- [x] [Services Entity](https://www.drupal.org/project/services_entity) **5 Resources**
- [x] [Services Menu](https://www.drupal.org/project/services_menu) **1 Resources**
- [x] [Services FBOauth](https://www.drupal.org/project/services_fboauth) **1 Resources**
- [ ] [Services Search](https://www.drupal.org/project/services_search) **2 Resources** // create an issue please if you want this to be implemented "PR welcome".

- **Drupal Services**
  - Comment Resource
    - Retrieve
    - Create
    - Update
    - Delete
    - Index
    - CountAll
    - CountNew
  - File Resource
    - Retrieve
    - Create
    - Delete
    - Index
    - Create_raw
  - Node Resource
    - Retrieve
    - Create
    - Update
    - Delete
    - Index
    - Files
    - Comments
    - Attach_file
  - System Resource
    - Connect
    - Get_variable
    - Set_variable
    - Del_variable
  - TaxonomyTerm Resource
    - Retrieve
    - Create
    - Update
    - Delete
    - Index
    - SelectNodes
  - TaxonomyVocabulary Resource
    - Retrieve
    - Create
    - Update
    - Delete
    - Index
    - GetTree
  - User Resource
    - Retrieve
    - Create
    - Update
    - Delete
    - Index
    - Login
    - Logout
    - Token 
    - Request_new_password
    - Register
    - Cancel
    - Password_reset
    - Resend_welcome_email

- **Drupal Services Views**
  - Views Resource
    - Retrieve

- **Drupal Services Entity**
  - Entity Resource
    - Retrieve
    - Create
    - Update
    - Delete
    - Index
    
- **Drupal Services Menu**
  - Menus Resource
    - Retrieve

- **Drupal Services FBOauth**
  - Menus Resource
    - Connect

## Setup for Drupal
- Start with a fresh Drupal7 installation.

### Services
- install [Drupal Services](https://www.drupal.org/project/services) 
- Go to  admin/structure/services/add and create a new endpoint with following settings:
  - machine name: api
  - server: REST
  - path: api
  - debug: unchecked
  - session authentication: checked
- Then click the edit resources link and open the resources tab.
  Now every resource you like by check box. 
- Then click Save
- Click the Server tab
- For Response formatters check following:
  - json
- For Request parsing check following:
  - application/json
  - multipart/form-data (for some file upload resources)
- Click Save. 
- Flush all of Drupal's caches.
- Some requests requires the user to have permission to do them, make sure you configured your user permissions to match the application requirements

### Setup for CORS
- install [CORS](https://www.drupal.org/project/cors) 
- Go to admin/config/services/cors  and paste following into the textarea   

`api/*|<mirror>|POST,PUT,GET,DELETE|Content-Type,X-CSRF-TOKEN|true`.

`services/session/token|<mirror>|GET|Content-Type,X-CSRF-TOKEN|true`.

### Change Logs
- **1.0.2**
  - Adding change logs to readme file.
  - System service/user service: saving the connection after logging in and system connect resource.
  - Adding support for adding Cookie header in drupal constants settings object.
  - drupal connection now will be retrived from the DrupalConstant singleton first, otherwhise we will get them from        cookies "usefull for making multiple authintications and changing them dinamically during the runtime".

- **1.1.0**
  - Upgrade to angular 5

- **1.1.1**
  - Fix logging out not clearing all data
  - Use set httponly for cookie header

- **1.2.1**
  - Fixes #1 - Add support for offline browsing
  - Add entity and field structure support for drupal fields

- **1.2.2**
  - Add support for view args of type array

- **1.2.3**
  - Add new sessionDays option to support dynamic session expiration

- **1.2.4**
  - Change views display_id property to required

- **1.3.0**
  - Add support for services fboauth module

- **1.4.0**
  - Upgrade to use the new HttpClient :smirk: