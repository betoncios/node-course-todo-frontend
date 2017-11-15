import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TodosComponent } from './../todos/todos.component';
import { LoginComponent } from './../login/login.component';
import {HttpModule} from '@angular/http';
import { RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [
    AppComponent,
    TodosComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([
    	{path: 'login', component: LoginComponent},
    	{path: '', redirectTo: 'login', pathMatch: 'full'},
    	{path: 'todos', component: TodosComponent}
    ])
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
