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
    // const user = {
    //   name: "test",
    //   mail: "awdwad@awwad.com",
    // };
    // this.userService.createUser(user).subscribe(data => {
    //   console.log(data)
    // });
  }

  updateUser() {
    this.result.name = 'root';
    this.userService.updateUser(this.result).subscribe(data => {
      console.log(data);
    });
  }

  deleteUser() {
    this.userService.deleteUser(2).subscribe(data => {
      console.log(data);
    });
  }

  login() {
    const user = {
      username: "root",
      password: "root"
    }
    this.userService.login(user).subscribe(data => {
      console.log(data);
    });
  }

  logout() {
    this.userService.logout().subscribe(data => {
      console.log(data);
    });
  }

}

