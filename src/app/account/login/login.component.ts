import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '@app/account/state&service/account.service';
import { Store } from '@ngrx/store';
import { StateWithUser } from '../state&service/account.reducer';
import { loginUserSuccess } from '../state&service/account.actions';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  hide = true;
  returnUrl: string;
  $productCount: Observable<number>;
  $orderCount: Observable<number>;
  errorResponse: any;
  returnPath: string;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute, // private accountService: AccountService, // private alertService: AlertService
    private accountService: AccountService,
    private store: Store<StateWithUser>
  ) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.router.navigate(['../']);
      const user = JSON.parse(storedUser);
      if (user) {
        this.store.dispatch(loginUserSuccess({ user }));
      }
    }
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.$productCount = this.accountService.getProductCount();
    this.$orderCount = this.accountService.getOrderCount();
    this.returnPath = this.route.snapshot.queryParams['returnUrl'];
  }

  get control() {
    return this.form.controls;
  }
  getEmailErrorMessage() {
    if (this.control.email.hasError('required')) {
      return 'You must enter an email';
    }
    return this.control.email.hasError('email') ? 'Not a valid email' : '';
  }
  getPasswordErrorMessage() {
    if (this.control.password.hasError('required')) {
      return 'You must enter an password';
    }
    return this.control.password.hasError('password')
      ? 'Not a valid password'
      : '';
  }

  async onSubmit() {
    this.submitted = true;
    this.loading = true;

    if (this.form.invalid) {
      console.log(`this.form.value`, this.form.value);
      return;
    }
    console.log(`going to account service to log in`);
    const response = await this.accountService.login(this.form.value);
    this.loading = false;
    if (response?._id)
      this.router.navigate(['../'], { relativeTo: this.route.root });
    else {
      this.errorResponse = 'Incorrect username or password.';
    }
  }
}
