# Big thanks to [BioPhoton](https://github.com/BioPhoton) for giving me alot of ideas from his old [AngularJS services project](https://github.com/BioPhoton/ng-drupal-7-services)

# Angular 2+/Ionic 2+ Drupal 7 Services
#### Typescript angular module for [Drupal Services 3.x](https://www.drupal.org/project/services)

[![npm version](https://badge.fury.io/js/ngx-drupal7-services.svg)](https://badge.fury.io/js/ngx-drupal7-services)  

Angular Drupal 7 Services is a REST client for Angular 2+, which allows you to user predefined functions when communication with Drupal's api endpoints.  
Unlike the other project focusing on the same topic, Angular Drupal 7 Services is precisely organized around the [Drupal Services 3.x](https://www.drupal.org/project/services) architecture and naming conventions.   
  
It optionally provides events next to the common used observable approach.

A full set of Drupal's resources is available, and all basic workflow's depending to authentication or helpers for CRUD operations are also provided as a set of extra modules.

Also supports Server Side Rendering "Angular Universal".

## DEMOS
Check out the [Demo folder](https://github.com/wnabil/ngx-drupal7-services/tree/master/demo) for a full demo.
Running the demo
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
    };
    DrupalConstants.Settings = drupalSettings;
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
    this.userService.login(user).subscribe(data => {
      // re-direct to user pofile or show welcome message.
    });
  }
}
```

## Contribution, Ideas and pull requests are welcome, Please open an issue on Github or contact me on w.nabil@orangestudio.com if i didn't response in approx 2 days.

## Configuration
Basically all configurable options are wrapped in an angular constant.
Your must implement your own application configuration for the DrupalConstants.Settings as shown above.

## Supported Drupal Modules
Here is a list of supported Drupal services 3.x modules "Others are still WIP":
- [x] [Services](https://www.drupal.org/project/services) **7 Resources** | **51 Requests**
- [ ] [Services Views](https://www.drupal.org/project/services_view) **1 Resources** | **1 Requests**
- [ ] [Services Menu](https://www.drupal.org/project/services_menu) **1 Resources** | **1 Requests**
- [ ] [Services Search](https://www.drupal.org/project/services_search) **2 Resources** | **2 Requests**
- [ ] [Services Entity](https://www.drupal.org/project/services_entity) **6 Resources** | **47 Requests**

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
    - Get_variable // WIP
    - Set_variable // WIP
    - Del_variable // WIP
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

- **Drupal Services Menu**
  - Menu Resource
    - Retrieve

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
- Some requests requires the user to have permission to to them, make sure you configured your user permissions to match the application requirements

### Setup for CORS
- install [CORS](https://www.drupal.org/project/cors) 
- Go to admin/config/services/cors  and paste following into the textarea   

`api/<mirror>|POST,PUT,GET,DELETE|Content-Type,Authorization,X-CSRF-TOKEN|true`.

### OR Configure your nginx
```
add_header Access-Control-Allow-Origin 'http://YOURAPPLICATIONURL';
add_header Access-Control-Allow-Credentials true;
add_header Access-Control-Allow-Headers 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-CSRF-Token, Cookie';
add_header Access-Control-Expose-Headers 'Authorization';
add_header Access-Control-Allow-Methods 'POST,PUT,GET,DELETE,OPTIONS';
```
