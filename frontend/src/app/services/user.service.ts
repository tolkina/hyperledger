import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class UserService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {
  }

  getRequirements() {
    return this.http.get<any[]>(`${this.baseUrl}/requirements/`);
  }

  getSteps() {
    return this.http.get<any[]>(`${this.baseUrl}/steps/`);
  }
}
