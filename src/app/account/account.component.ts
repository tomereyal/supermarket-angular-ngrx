import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { StateWithUser } from './state&service/account.reducer';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<StateWithUser>
  ) {
    this.store
      .select((state) => state.account.user._id)
      .subscribe((user) => {
        // update account page everytime user state updates
        console.log(`Account component: user logged in ?`, user ? 'yes' : 'no');
      });
  }

  ngOnInit(): void {}
}
