import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainService } from './main/main.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [MainService],
})
export class Drupal7ServicesModule { }

export { MainService };
