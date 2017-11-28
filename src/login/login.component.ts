import { Component } from '@angular/core';
import { Http } from '@angular/http';
import {Headers, RequestOptions} from '@angular/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  moduleId: module.id,
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  constructor(private http: Http, private router: Router, private cookieService: CookieService) {};

  title = 'app';
  loginFail: boolean  = false;
  shortPassword: boolean  = false;
  userExist: boolean = false;
  loading: boolean = false;
  email: string;
  password: string;

  login($e): void {
    //this.loading = true;
  	$e.preventDefault();
  	//console.log(`email: ${this.email}, password: ${this.password}`);
  	var body = {
  		email: this.email,
  		password: this.password
  	};

	this.http
		.post('http://localhost:3000/users/login', body)
		.subscribe((data) => {
			//console.log(JSON.stringify(data, undefined, 2));
			//console.log(data.headers.get("x-auth"));
			var date = new Date();
			var days = 1;
			date.setTime(date.getTime()+(days*24*60*60*1000));
			this.cookieService.set('token', data.headers.get("x-auth"), date);
      this.loading = false;
      this.loginFail = false;
      this.shortPassword = false;
      this.userExist = false;
			this.router.navigateByUrl('/todos');
		}, error => {
      this.loading = false;
      this.loginFail = true;
      this.shortPassword = false;
      this.userExist = false;
      console.log(error)
    });
  }

  register($e) {
    this.loading = true;
    $e.preventDefault();
    var body = {
      email: this.email,
      password: this.password
    };

    this.http
      .post('http://localhost:3000/users', body)
      .subscribe((data) => {
        var date = new Date();
        var days = 1;
        date.setTime(date.getTime()+(days*24*60*60*1000));
        this.cookieService.set('token', data.headers.get("x-auth"), date);
        this.loading = false;
        this.shortPassword = false;
        this.router.navigateByUrl('/todos');
      }, error => {
        if (JSON.parse(error._body).code == 11000) {
            this.loading = false;
            this.shortPassword = false;
            this.userExist = true;
            this.loginFail = false;
        } else {
          this.loading = false;
          this.shortPassword = true;
          this.userExist = false;
          this.loginFail = false;
        }
        console.log(error);
      });
  }
}
