var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GithubUsers } from '../../providers/github-users';
import { UserDetailsPage } from '../user-details/user-details';
var UsersPage = (function () {
    function UsersPage(navCtrl, githubUsers) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.githubUsers = githubUsers;
        githubUsers.load().subscribe(function (users) {
            _this.users = users;
            _this.originalUsers = users;
        });
    }
    UsersPage.prototype.goToDetails = function (login) {
        this.navCtrl.push(UserDetailsPage, { login: login });
    };
    UsersPage.prototype.search = function (searchEvent) {
        var _this = this;
        var term = searchEvent.target.value;
        // We will only perform the search if we have 3 or more characters
        if (term.trim() === '' || term.trim().length < 3) {
            // Load cached users
            this.users = this.originalUsers;
        }
        else {
            // Get the searched users from github
            this.githubUsers.searchUsers(term).subscribe(function (users) {
                _this.users = users;
            });
        }
    };
    return UsersPage;
}());
UsersPage = __decorate([
    Component({
        selector: 'page-users',
        templateUrl: 'users.html'
    }),
    __metadata("design:paramtypes", [NavController, GithubUsers])
], UsersPage);
export { UsersPage };
//# sourceMappingURL=users.js.map