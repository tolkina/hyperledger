import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {User} from '../models/user';

@Injectable({providedIn: 'root'})
export class AuthenticationService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {
  }

  login(username: string, password: string) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Basic ' + btoa(username + ':' + password));

    return this.http.get(`${this.baseUrl}/users/`, {headers})
      .pipe(map((users: User[]) => {
        if (Array.isArray(users)) {
          localStorage.setItem('users', JSON.stringify(users));

          const user = users.find(u => u.username === username);
          if (user) {
            user.authdata = window.btoa(username + ':' + password);
            localStorage.setItem('currentUser', JSON.stringify(user));
            return user;
          }
        }

        return users;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
  }
}
