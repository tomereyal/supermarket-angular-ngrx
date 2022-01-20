import { Component, OnInit } from '@angular/core';
import { AccountService } from '@app/account/state&service/account.service';
import { StateWithUser } from '@app/account/state&service/account.reducer';
import IUser from '@app/interfaces/user.interface';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  $user: Observable<IUser>;
  isContactOpen = false;
  constructor(
    private store: Store<StateWithUser>,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.$user = this.store.select((state) => state.account?.user);
  }

  logout() {
    this.accountService.logout();
  }

  closeContactBox() {
    this.isContactOpen = false;
  }
}
