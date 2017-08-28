
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
  ServerStatus(title) {
    var payload = { command: "ServerStatus", payload: title };
    this.ws.send(JSON.stringify(payload));
  }
  PlayPause(state) {
    var payload = { command: "PlayPause", payload: state };
    this.ws.send(JSON.stringify(payload));
  }
  BroadcastDelay(delay) {
    var payload = { command: "BroadcastDelay", payload: delay };
    this.ws.send(JSON.stringify(payload));
  }
  SyncData(data) {
    var payload = { command: "SyncData", payload: data };
    this.ws.send(JSON.stringify(payload));
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
