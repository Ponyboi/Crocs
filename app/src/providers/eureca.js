var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
var EurecaClient = (function () {
    function EurecaClient(http) {
        this.http = http;
        this.githubApiUrl = 'https://api.github.com';
        // this.eureca = {};
        // this.eurecaServer = {};
        var provider = this;
        this.eureca = new Eureca.Client();
        this.eureca.ready(function (proxy) {
            provider.eurecaServer = proxy;
        });
    }
    EurecaClient.prototype.ServerStatus = function () {
        this.eurecaServer.ServerStatus();
    };
    EurecaClient.prototype.MoveUpMouseDown = function () {
        console.log(this.eurecaServer);
        this.eurecaServer.MoveUpMouseDown();
    };
    EurecaClient.prototype.MoveUpMouseUp = function () {
        this.eurecaServer.MoveUpMouseUp();
    };
    EurecaClient.prototype.MoveDownMouseDown = function () {
        this.eurecaServer.MoveDownMouseDown();
    };
    EurecaClient.prototype.MoveDownMouseUp = function () {
        this.eurecaServer.MoveDownMouseUp();
    };
    EurecaClient.prototype.SetSliderBrightness = function (bulb, val) {
        this.eurecaServer.SetSliderBrightness(bulb, val);
    };
    EurecaClient.prototype.SetLED = function (rgb) {
        this.eurecaServer.SetLED(1, rgb);
    };
    EurecaClient.prototype.PlayPause = function (state) {
        this.eurecaServer.PausePlay(state);
    };
    return EurecaClient;
}());
EurecaClient = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Http])
], EurecaClient);
export { EurecaClient };
//# sourceMappingURL=eureca.js.map