import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class AuthenticationService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {
  }

  login(username: string, password: string) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Basic ' + btoa(username + ':' + password));
    // headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.get(`${this.baseUrl}/users/`, {headers})
      .pipe(map((user: any) => {
        // login successful if there's a user in the response
        if (user) {
          // store user details and basic auth credentials in local storage
          // to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify({authdata: window.btoa(username + ':' + password)}));
        }

        return user;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }
}
