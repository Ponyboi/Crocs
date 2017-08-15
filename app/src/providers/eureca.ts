import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

import { User } from '../models/user';

declare var Eureca: any;

@Injectable()
export class EurecaClient {
  githubApiUrl = 'https://api.github.com';
  eureca
  eurecaServer

  constructor(public http: Http) { 
  	// this.eureca = {};
  	// this.eurecaServer = {};
  	var provider = this;
  	this.eureca = new Eureca.Client();
  	this.eureca.ready(function (proxy) {   
      provider.eurecaServer = proxy;
    });
  }
  ServerStatus() {
    this.eurecaServer.ServerStatus();
  }screenWidth

  MoveUpMouseDown() {
  	console.log(this.eurecaServer);
    this.eurecaServer.MoveUpMouseDown();
  }
  MoveUpMouseUp() {
    this.eurecaServer.MoveUpMouseUp();
  }
  MoveDownMouseDown() {
    this.eurecaServer.MoveDownMouseDown();
  }
  MoveDownMouseUp() {
    this.eurecaServer.MoveDownMouseUp();
  }
  SetSliderBrightness(bulb, val) {
    this.eurecaServer.SetSliderBrightness(bulb, val);
  }
  SetLED(rgb) {
    this.eurecaServer.SetLED(1, rgb);
  }
  PlayPause(state) {
    this.eurecaServer.PausePlay(state);
  }
}