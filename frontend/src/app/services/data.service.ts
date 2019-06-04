import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Context} from "../models/context";
import {Requirement} from "../models/requirement";

@Injectable({providedIn: 'root'})
export class DataService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {
  }

  getRequirements() {
    return this.http.get<any[]>(`${this.baseUrl}/requirements/`);
  }

  getSteps() {
    return this.http.get<any[]>(`${this.baseUrl}/steps/`);
  }

  getContexts() {
    return this.http.get<any[]>(`${this.baseUrl}/context/`);
  }

  startContext(context: Context) {
    return this.http.post(`${context.url}start/`, {});
  }

  accomplishRequirement(requirement: Requirement) {
    return this.http.post(`${requirement.url}submit/`, {});
  }
}
