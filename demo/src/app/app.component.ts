import { Component } from '@angular/core';
import { MainService } from '../../../';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    private mainService: MainService,
  ) {

  }
}
