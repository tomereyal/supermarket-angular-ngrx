import { emptyCart } from './../state&service/cart.actions';
import {
  ICartWithHashedItems,
  IHashedCartItems,
} from './../state&service/cart.reducer';
import ICart from '@app/interfaces/cart.interface';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';
import { CartService } from '../state&service/cart.service';
import { StateWithSm } from '../state&service/sm.reducer';
import { OrderService } from '../state&service/order.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  $cartItems: Observable<IHashedCartItems>;
  totalPrice: number;
  constructor(
    private orderService: OrderService,
    private router: Router,
    private store: Store<StateWithSm>,
    private cartService: CartService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.$cartItems = this.store.select((state) => state.sm.cart.cartItems);
  }


  emptyCart(){
    this.cartService.emptyCart();
  }

  getTotalPrice(cartItems: IHashedCartItems): number {
    let total = 0;
    for (const productRef in cartItems) {
      total +=
        cartItems[productRef].amount * cartItems[productRef].productRef.price;
    }
    this.totalPrice = total;
    return total;
  }

  getOrder() {
    this.$cartItems.pipe(take(1)).subscribe((cartItems: IHashedCartItems) => {
      if (Object.keys(cartItems).length > 0) {
        this.orderService.addCustomerToOrder();
        this.orderService.addCartToOrder();
        this.orderService.addTotalPriceToOrder(this.totalPrice);

        this.router.navigateByUrl('/order');
      } else {
        this.openSnackBar(
          'At least one item must be added to the cart in order to proceed to checkout.'
        );
      }
    });
  }
  openSnackBar(alert: string) {
    this._snackBar.open(alert, 'X', {
      horizontalPosition: 'start',
      verticalPosition: 'bottom',
      duration: 5 * 1000,
    });
  }
}
