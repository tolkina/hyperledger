import {Component, OnInit} from '@angular/core';
import {first} from 'rxjs/operators';
import {DataService} from '../services/data.service';
import {Context} from '../models/context';
import {Step} from '../models/step';
import {Requirement} from '../models/requirement';
import {User} from '../models/user';
import {faCheck} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  users: User[] = [];
  contexts: Context[] = [];
  steps: Step[] = [];
  requirements: Requirement[] = [];
  faCheck = faCheck;
  file: any;

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    setTimeout(() => {
      this.getUsers();
      this.getContexts();
      this.getSteps();
      this.getRequirements();
    }, 3000);

  }

  getUsers() {
    this.users = JSON.parse(localStorage.getItem('users')) || [];
  }

  getContexts() {
    this.dataService.getContexts().pipe(first()).subscribe((contexts: Context[]) => {
      this.contexts = contexts;
    });
  }

  getSteps() {
    this.dataService.getSteps().pipe(first()).subscribe((steps: Step[]) => {
      this.steps = steps;
    });
  }

  getRequirements() {
    this.dataService.getRequirements().pipe(first()).subscribe((requirements: Requirement[]) => {
      this.requirements = requirements;
    });
  }

  startContext(context: Context) {
    console.log('Start context');
    this.dataService.startContext(context).subscribe(() => this.loadData());
  }

  getStep(current_step: string) {
    return this.steps.find(step => step.url === current_step);
  }

  getUserName(current_user: string) {
    const user: User = this.users.find(u => u.url === current_user);
    return user
      ? user.first_name && user.last_name ? user.first_name + ' ' + user.last_name : user.username
      : '';
  }

  getRequirement(current_requirement: string) {
    return this.requirements.find(requirement => requirement.url === current_requirement);
  }

  getRequirementsForStep(current_step: string) {
    const step = this.getStep(current_step);
    if (step) {
      return (step.requirements || [])
        .map(requirement => this.getRequirement(requirement))
        .filter(requirement => requirement != null);
    }
    return [];
  }

  accomplishRequirement(requirement: Requirement) {
    this.dataService.accomplishRequirement(requirement).subscribe(() => this.loadData());
  }

  getTable(context: Context): Step[] {
    const steps = [];
    let step = this.getStep(context.initial_step);
    step.start_date = context.start_date;

    let findCurrent = false;

    while (step && step.next_step) {
      if (step.url === context.current_step) {
        step.status = this.isDateMore(step) ? 21 : 20;
        findCurrent = true;
      } else if (!findCurrent) {
        step.status = 1;
      } else {
        step.status = this.isDateMore(step) ? 31 : 30;
      }

      steps.push(step);
      step = this.getStep(step.next_step);
    }
    return steps;

  }

  isDateMore(step: Step) {
    return step.end_date ? new Date().getTime() > new Date(step.end_date).getTime() : false;
  }

  isDisabledSubmitButton(step: Step) {
    const user = JSON.parse(localStorage.getItem('currentUser')) as User;
    return user ? user.url !== step.executor && user.url !== step.manager : true;
  }

  getClass(step: Step) {
    if (step.status === 1) {
      return 'table-success';
    }
    if (step.status === 21) {
      return 'table-danger';
    }
    if (step.status === 20) {
      return 'table-primary';
    }
    if (step.status === 31) {
      return 'table-warning';
    }
    if (step.status === 30) {
      return 'table-light';
    }
    return '';
  }
}
