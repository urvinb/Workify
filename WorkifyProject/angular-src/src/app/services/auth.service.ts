import { Injectable } from '@angular/core';
import {HttpHeaders} from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthService {
  authToken: any;
  user: any;

  constructor(private http: HttpClient) {
      //this.isDev = false;  // Change to false before deployment
    }

  registerUser(user) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };
    return this.http.post('http://localhost:3000/users/register',user,httpOptions)
      .map(res => res);
  }

  authenticateUser(user) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };
    return this.http.post('http://localhost:3000/users/authenticate', user,httpOptions)
      .map(res => res);
  }

  getProfile() {
    this.loadToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
         'Authorization': this.authToken
      })
    };
    return this.http.get('http://localhost:3000/users/profile', httpOptions)
      .map(res => res);
  }

  storeUserData(token, user) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loggedIn() {
    return tokenNotExpired('id_token');
  }

  logout() {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }
}
