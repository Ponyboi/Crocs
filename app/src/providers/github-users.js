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
var GithubUsers = (function () {
    function GithubUsers(http) {
        this.http = http;
        this.githubApiUrl = 'https://api.github.com';
    }
    // Load all github users
    GithubUsers.prototype.load = function () {
        return this.http.get(this.githubApiUrl + "/users")
            .map(function (res) { return res.json(); });
    };
    // Get github user by providing login(username)
    GithubUsers.prototype.loadDetails = function (login) {
        return this.http.get(this.githubApiUrl + "/users/" + login)
            .map(function (res) { return (res.json()); });
    };
    // Search for github users  
    GithubUsers.prototype.searchUsers = function (searchParam) {
        return this.http.get(this.githubApiUrl + "/search/users?q=" + searchParam)
            .map(function (res) { return (res.json().items); });
    };
    return GithubUsers;
}());
GithubUsers = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Http])
], GithubUsers);
export { GithubUsers };
//# sourceMappingURL=github-users.js.map