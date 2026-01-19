import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared/shared-module';

import { AdminRoutingModule } from './admin-routing-module';
import { ManageVideo } from './dialog/manage-video/manage-video';
import { VideoList } from './video-list/video-list';
import { UserList } from './user-list/user-list';
import { ManageUser } from './dialog/manage-user/manage-user';


@NgModule({
  declarations: [
    ManageVideo,
    VideoList,
    UserList,
    ManageUser
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
