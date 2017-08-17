import { Component } from '@angular/core';
import { MainService, DrupalConstants, UserService, SystemService } from '../../../';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  settings = DrupalConstants.Settings;

  result: any;

  constructor(
    private userService: UserService,
    private systemService: SystemService,
  ) {

  }

  connect() {
    this.systemService.connect().subscribe(data => {
      this.result = data;
    });
  }

  getUser() {
    this.userService.getUserById(1).subscribe(data => {
      console.log(data);
      this.result = data;
    });
  }

  getAllUsers() {
    this.userService.getUsersList().subscribe(data => {
      console.log(data);
      this.result = data;
    });
  }

  createUser() {
    const user = {
      name: "test",
      mail: "awdwad@awwad.com",
    };
    this.userService.createUser(user).subscribe(data => {
      console.log(data)
    });
  }

}

