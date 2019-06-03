import {Component, OnInit} from '@angular/core';
import {first} from 'rxjs/operators';
import {UserService} from '../services/user.service';
import {User} from '../models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.userService.getRequirements().pipe(first()).subscribe(users => {
      console.log('requirements', users);
      this.users = users;
    });

    this.userService.getSteps().pipe(first()).subscribe(users => {
      console.log('steps', users);
      this.users = users;
    });
  }

}
