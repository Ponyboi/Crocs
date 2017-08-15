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
import { NavController, NavParams } from 'ionic-angular';
import { GithubUsers } from '../../providers/github-users';
var UserDetailsPage = (function () {
    function UserDetailsPage(navCtrl, navParams, githubUsers) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.githubUsers = githubUsers;
        this.login = navParams.get('login');
        githubUsers.loadDetails(this.login).subscribe(function (user) {
            _this.user = user;
            console.log(user);
        });
    }
    return UserDetailsPage;
}());
UserDetailsPage = __decorate([
    Component({
        selector: 'page-user-details',
        templateUrl: 'user-details.html'
    }),
    __metadata("design:paramtypes", [NavController, NavParams, GithubUsers])
], UserDetailsPage);
export { UserDetailsPage };
//# sourceMappingURL=user-details.js.map