import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import {Headers, RequestOptions} from '@angular/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  moduleId: module.id,
  selector: 'todos',
  templateUrl: './todos.component.html'
})
export class TodosComponent implements OnInit{
  constructor(private http: Http, private router: Router, private cookieService: CookieService) {};

  todos: any;
  request_options: any;
  new_todo: string;
  loading: boolean = false;

  title = 'todos';

  ngOnInit() { 
  this.loading = true;
	this.authenticate()
		.subscribe((user) => {
  			console.log(user);
  			this.get_todos()
  				.subscribe((data) => {
  					this.todos = data.json().todos;
            this.loading = false;
  					console.log(this.todos);
  			}, (error) => {
          this.loading = false;
  				console.log(error);
  				this.router.navigateByUrl('/');
  			});
  		}, (error) => {
        this.loading = false;
  			console.log(error);
  			this.router.navigateByUrl('/');
  		});
  }

  authenticate() {
    this.set_request_options();
  	return this.http.get('http://localhost:3000/users/me', this.request_options);
  	
  }

  get_todos() {
    this.set_request_options();
  	return this.http.get('http://localhost:3000/todos', this.request_options);
  }

  post_todo($e) {
    $e.preventDefault();
    this.set_request_options();
    var body = {
      text: this.new_todo
    };

    this.http
      .post('http://localhost:3000/todos', body, this.request_options)
      .subscribe((data) => {
        console.log(data.text());
        this.new_todo = "";
        this.ngOnInit();
      }, (err) => {
        console.log(err);
      });
  }

  complete(todo) {
    this.set_request_options();
    var body = {
      completed: !todo.completed
    };
    this.http
      .patch(`http://localhost:3000/todos/${todo._id}`, body, this.request_options)
      .subscribe((data) => {
        console.log(data.text());
        this.ngOnInit();
      }, (err) => {
        console.log(err);
      });
  }

  delete(todo_id) {
    this.set_request_options();

    this.http
    .delete(`http://localhost:3000/todos/${todo_id}`, this.request_options)
    .subscribe((data) => {
        console.log(data.text());
        this.ngOnInit();
    }, (err) => {
      console.log(err);
    });
  }

  logout() {
    this.set_request_options();
  	this.http.delete('http://localhost:3000/users/me/token', this.request_options)
  		.subscribe(() => {
  			this.cookieService.deleteAll();
  		}, (err) => {
  			console.log(err);
  		})
  }

  set_request_options() {
      var headers = new Headers();
      headers.append('x-auth', this.cookieService.get('token'));
      headers.append('Content-Type', 'application/json');
      this.request_options = new RequestOptions({ headers: headers });
  }
}