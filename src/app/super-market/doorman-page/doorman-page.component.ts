import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import ICart from '@app/interfaces/cart.interface';
import IOrder from '@app/interfaces/order.interface';
import IUser from '@app/interfaces/user.interface';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { CartService } from '../state&service/cart.service';
import { StateWithSm } from '../state&service/sm.reducer';
@Component({
  selector: 'app-doorman-page',
  templateUrl: './doorman-page.component.html',
  styleUrls: ['./doorman-page.component.css'],
})
export class DoormanPageComponent implements OnInit {
  $cart: Observable<ICart>;
  $customer: Observable<IUser>;
  $previousOrderDate: Observable<string | null>;
  isCartEmpty: boolean;
  loading: boolean;
  cart: ICart;
  constructor(
    private store: Store<StateWithSm>,
    private cartService: CartService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.loading = true;
    await this.cartService
      .getCart()
      .then((cart) => {
        if (cart) {
          this.cart = cart;
          if (cart.cartItems.length > 0) this.isCartEmpty = false;
          else this.isCartEmpty = true;
        }
      })
      .finally(() => {
        this.loading = false;
      });

    this.$customer = this.store.select((state) => state.account.user);
    this.$previousOrderDate = this.store
      .select((state) => (state.sm.previousOrders[0] as IOrder)?.createdAt)
      .pipe(
        map((date) => {
          if (date) {
            return date;
          } else {
            return null;
          }
        })
      );
  }

  async deleteOldCreateNewCart() {
    await this.cartService.createCart();
    this.router.navigate(['shop']);
  }
  shopWithCurrentCart() {
    this.router.navigate(['shop']);
  }
}
