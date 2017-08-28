
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { User } from '../models/user';

declare var Eureca: any;

@Injectable()
export class WSClient {
    ws

  constructor(public http: Http) { 
    // this.eureca = {};
    // this.eurecaServer = {};
    var provider = this;
    this.ws = new WebSocket('ws://localhost:8080');
    // this.eureca.ready(function (proxy) {   
    //   provider.eurecaServer = proxy;
    // });
  }
  ServerStatus() {
    var payload = { command: "ServerStatus" } 
    this.ws.send(payload);
  }
  PlayPause(state) {
    this.ws.send(state);
  }
  SyncData(data) {
    this.ws.send(data);
  }
}

  // MoveUpMouseDown() {
  //   console.log(this.eurecaServer);
  //   this.eurecaServer.MoveUpMouseDown();
  // }
  // MoveUpMouseUp() {
  //   this.eurecaServer.MoveUpMouseUp();
  // }
  // MoveDownMouseDown() {
  //   this.eurecaServer.MoveDownMouseDown();
  // }
  // MoveDownMouseUp() {
  //   this.eurecaServer.MoveDownMouseUp();
  // }
  // SetSliderBrightness(bulb, val) {
  //   this.eurecaServer.SetSliderBrightness(bulb, val);
  // }
  // SetLED(rgb) {
  //   this.eurecaServer.SetLED(1, rgb);
  // }
