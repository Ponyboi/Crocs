import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

import { ControlsPage } from '../pages/controls/controls';

import { GithubUsers } from '../providers/github-users';
import { WSClient } from '../providers/ws';

@NgModule({
  declarations: [
    MyApp,
    ControlsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ControlsPage
  ],
  providers: [
    GithubUsers,
    WSClient,
  ]
})
export class AppModule {}
