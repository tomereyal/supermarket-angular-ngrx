import { Component, Input, OnInit } from '@angular/core';
import { IOrderCartItem } from '@app/interfaces/order.interface';
import { Store } from '@ngrx/store';
import { Observable, of, take } from 'rxjs';
import { StateWithSm } from '../state&service/sm.reducer';

@Component({
  selector: 'app-items-review',
  templateUrl: './items-review.component.html',
  styleUrls: ['./items-review.component.css'],
})
export class ItemsReviewComponent implements OnInit {
  @Input() orderItems: IOrderCartItem[] | undefined = [];
  @Input() totalPrice: number | undefined = 0;
  $cartItems: Observable<IOrderCartItem[]>;
  displayedColumns: string[] = ['amount', 'url', 'name', 'price'];
  constructor(private store: Store<StateWithSm>) {}

  ngOnInit(): void {
    this.$cartItems = this.store.select(
      (state) => state.sm.order.cart.cartItems
    );
    this.store
      .select((state) => state.sm.order.totalPrice)
      .pipe(take(1))
      .subscribe((totalPrice) => {
        this.totalPrice = totalPrice;
      });
  }
}
