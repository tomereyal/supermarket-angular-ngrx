import { CartService } from './../state&service/cart.service';
import IOrder, {
  IOrderCart,
  IOrderCustomer,
} from '@app/interfaces/order.interface';
import { StateWithSm } from './../state&service/sm.reducer';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, map, Observable, take, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { requestFailure } from '@app/actions';
import { OrderService } from '../state&service/order.service';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { Moment } from 'moment';

// Before the component
declare var Stripe: any;

const publicKey =
  'pk_test_51KGNLKSJej4IY923PqjN6qGTgGYK0GbKRKq2d1ePN2ooYVUCGF3LVRREnKq60aI9U5X03wJ1lGLoztvQU4J4A35G00yNJW9qi4';

interface City {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit, AfterViewInit {
  @ViewChild('cardErrors') cardErrors: ElementRef;
  @ViewChild('cardElement') cardElement: ElementRef;
  form: FormGroup;
  topCities: City[];
  $loading: Observable<boolean>;
  $order: Observable<IOrder>;
  order: IOrder;
  cart: IOrderCart;
  customer: IOrderCustomer;
  minDate: Date;
  maxDate: Date;
  confirmation: any;
  loading = false;
  stripe: Stripe | null;
  stripeElements: StripeElements | undefined;
  forbiddenDatesHashMap: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private orderService: OrderService,
    private cartService: CartService,
    private store: Store<StateWithSm>
  ) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate();
    this.minDate = new Date(currentYear, currentMonth, currentDay);
    this.maxDate = new Date(currentYear + 1, 11, 31);
  }

  async ngOnInit(): Promise<any> {
    this.form = this.fb.group({
      city: ['', Validators.required],
      street: ['', Validators.required],
      timeOfArrival: [
        '',
        {
          validators: [Validators.required],
          asyncValidators: [this.availableDateValidator()],
          updateOn: 'blur',
        },
      ],
    });
    /*ERASE THE LINES BELOW LATER, ONLY FOR QUICK TESTING */
    await this.cartService.getCart();
    await this.orderService.addCartToOrder();
    await this.orderService.addCustomerToOrder();

    /*=====================================================*/

    this.$order = this.store.select((state) => state.sm.order);
    /*Redirect to shop if cart is empty or no user is found else extract customer and cart */
    this.forbiddenDatesHashMap = await this.orderService.getForbiddenDates();
    await this.$order
      .pipe(take(1))
      .toPromise()
      .then((order) => {
        console.log(`order`, order);
        if (!order?.customer.email || order.totalPrice === -1) {
          this.router.navigateByUrl('shop');
        } else {
          this.cart = order.cart;
          this.customer = order.customer;
          this.order = order;
        }
      });

    this.form.patchValue({
      city: this.customer.address.city,
      street: this.customer.address.street,
    });

    this.topCities = this.getTopCities();

    this.$loading = this.store
      .select((state) => state.sm.loadingOrder)
      .pipe(tap((data) => console.log(`data`, data)));
  }

  async ngAfterViewInit() {
    this.stripe = await loadStripe(`${publicKey}`);
    this.stripeElements = this.stripe?.elements();
    console.log(`this.stripeElements`, this.stripeElements);
    const style = {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    };
    // Create an instance of the card Element.
    const card = this.stripeElements?.create('card', {
      style: style,
      hidePostalCode: true,
    });
    // Add an instance of the card Element into the `card-element` <div>.
    //@ts-ignore

    console.log(`this.stripeElements`, this.stripeElements);
    console.log(`this.cardElement`, this.cardElement);
    //@ts-ignore
    card?.mount(this.cardElement.nativeElement);
    //@ts-ignore
    card?.addEventListener('change', (event: any) => {
      if (event.error) {
        this.cardErrors.nativeElement.textContent = event.error.message;
      } else {
        this.cardErrors.nativeElement.textContent = '';
      }
    });
  }

  get fc() {
    return this.form?.controls;
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

  availableDatesFilter = (d: Date | null): boolean => {
    const date = (d || new Date()).toISOString().split('T')[0];
    if (!this.forbiddenDatesHashMap) return true;
    //only return dates that are not in the forbiddenDatesHashMAp
    return !(this.forbiddenDatesHashMap[date] === true);
  };

  private availableDateValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.orderService.isDateAvailable(control.value).pipe(
        map(({ isDateAvailable }) =>
          isDateAvailable ? null : { isNotAvailable: true }
        ),
        catchError(async (error) => {
          this.store.dispatch(requestFailure({ error }));
          return null;
        })
      );
    };
  }

  async submitOrder() {
    if (!this.form.valid) {
      console.log(`Form is not valid`, this.form.value);
      return;
    }
    this.loading = true;
    //@ts-ignore
    const { error, paymentMethod } = await this.stripe?.createPaymentMethod({
      type: 'card',
      card: this.stripeElements?.getElement('card')!,
      billing_details: {
        name: `${this.customer.firstName} ${this.customer.lastName}`,
        email: this.customer.email,
      },
    });

    const order: Partial<IOrder> = {
      customer: this.customer,
      cart: this.cart,
      destination: { city: this.fc.city.value, street: this.fc.street.value },
      timeOfArrival: (this.fc.timeOfArrival.value as Moment).format(
        'YYYY-MM-DD'
      ), //is in date and time ISO string format
      totalPrice: this.order.totalPrice,
      paymentDigits: paymentMethod.card.last4, //get last 4 numbers
    };
    console.log(`to db order: `, order);
    await this.orderService
      .submitOrder(order)
      .then((result) => {
        if (result?.newOrderId) {
          this.cartService.deleteCart(this.cart._id);

          this.router.navigateByUrl('order-succeeded', {
            state: { confirmedOrderId: result.newOrderId },
          });
        }
      })
      .catch()
      .finally(() => {
        this.loading = false;
      });
  }
}
