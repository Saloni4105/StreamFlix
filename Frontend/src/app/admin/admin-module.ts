import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared/shared-module';

import { AdminRoutingModule } from './admin-routing-module';
import { ManageVideo } from './dialog/manage-video/manage-video';
import { VideoList } from './video-list/video-list';


@NgModule({
  declarations: [
    ManageVideo,
    VideoList
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
