import { AccountService } from '../state&service/account.service';
import { Router, ActivatedRoute } from '@angular/router';
import { catchError, map, Observable, tap } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { StateWithUser } from '../state&service/account.reducer';
import { requestFailure } from '@app/actions';
import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/material/stepper';

interface City {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  firstForm: FormGroup;
  secondForm: FormGroup;
  topCities: City[];
  errorResponse: string;
  hide = true;
  $loading: Observable<boolean>;
  stepperOrientation: Observable<StepperOrientation>;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private store: Store<StateWithUser>,
    breakpointObserver: BreakpointObserver
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit(): void {
    this.firstForm = this.fb.group({
      email: [
        '',
        {
          validators: [Validators.required, Validators.email],
          asyncValidators: [this.uniqueEmailValidator()],
          updateOn: 'blur',
        },
      ],
      password: ['', Validators.required],
      confirmedPassword: [
        '',
        [Validators.required, this.passwordConfirmedValidator()],
      ],
    });

    this.secondForm = this.fb.group({
      city: ['', Validators.required],
      street: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });

    this.topCities = this.getTopCities();

    this.$loading = this.store
      .select((state) => state.account.loadingUser)
      .pipe(tap((data) => console.log(`data`, data)));
  }

  get fc1() {
    return this.firstForm?.controls;
  }
  get fc2() {
    return this.secondForm?.controls;
  }

  private passwordConfirmedValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isSame = control.value == this.fc1?.password?.value;
      return isSame ? null : { passwordNotConfirmed: true };
    };
  }
  private getTopCities() {
    return [
      { value: 'Tel-Aviv', viewValue: 'Tel-Aviv' },
      { value: 'Jerusalem', viewValue: 'Jerusalem' },
      { value: 'Haifa', viewValue: 'Haifa' },
      { value: 'Ashdod', viewValue: 'Ashdod' },
      { value: 'Rishon LeZiyyon', viewValue: 'Rishon LeZiyyon' },
      { value: 'Petah Tikva', viewValue: 'Petah Tikva' },
      { value: 'Beersheba', viewValue: 'Beersheba' },
      { value: 'Netanya', viewValue: 'Netanya' },
      { value: 'Holon', viewValue: 'Holon' },
      { value: 'Bnei Brak', viewValue: 'Bnei Brak' },
      { value: 'Rehovot', viewValue: 'Rehovot' },
      { value: 'Bat Yam', viewValue: 'Bat Yam' },
    ];
  }

  private uniqueEmailValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.accountService.isEmailTaken(control.value).pipe(
        map((data) => (data.isEmailTaken ? { emailExists: true } : null)),
        catchError(async (error) => {
          this.store.dispatch(requestFailure({ error }));
          return null;
        })
      );
    };
  }

  async register() {
    if (!this.firstForm.valid || !this.secondForm.valid) return;

    const newUser = {
      email: this.fc1.email.value,
      password: this.fc1.password.value,
      address: { city: this.fc2.city.value, street: this.fc2.street.value },
      firstName: this.fc2.firstName.value,
      lastName: this.fc2.lastName.value,
    };
    const response = await this.accountService.register(newUser);
    if (response?._id) this.router.navigate(['/']);
    else {
      this.errorResponse = response;
    }
  }

  getEmailError() {
    if (!this.fc1.email.errors) return '';
    const emailErrors = this.fc1.email.errors;
    if (emailErrors['required']) return 'Email is required';
    if (emailErrors['email']) return 'Please enter a valid email address';
    if (emailErrors['emailExists'])
      return 'Email exists, please choose another';
  }
  getPasswordError() {
    if (!this.fc1.password.errors) return '';
    const passwordErrors = this.fc1.password.errors;
    if (passwordErrors['required']) return 'Password is required';
  }
  getConfirmedPasswordError() {
    if (!this.fc1.confirmedPassword.errors) return '';
    const confirmedPasswordErrors = this.fc1.confirmedPassword.errors;
    if (confirmedPasswordErrors['required'])
      return 'Please confirm your password';
    if (confirmedPasswordErrors['passwordNotConfirmed'])
      return "Passwords don't match. Please check again.";
  }
}
