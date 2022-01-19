import ICartItem from '@app/interfaces/cartItem.interface';
import { Component, Input, OnInit } from '@angular/core';
import { CartService } from '../state&service/cart.service';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css'],
})
export class CartItemComponent implements OnInit {
  @Input() cartItem: ICartItem;
  isHovered = false;
  constructor(private cartService: CartService) {}

  ngOnInit(): void {}
  toggleButtons() {
    this.isHovered = this.isHovered ? false : true;
  }

  addOne() {
    if (this.cartItem.amount === 50) return;
    this.cartService.updateCartItemAmount(
      this.cartItem._id,
      this.cartItem.productRef._id,
      this.cartItem.amount + 1
    );
  }

  remove() {
    this.cartService.removeCartItem(
      this.cartItem._id,
      this.cartItem.productRef._id
    );
  }
  removeOne() {
    if (this.cartItem.amount === 1) {
      this.remove();
    }
    this.cartService.updateCartItemAmount(
      this.cartItem._id,
      this.cartItem.productRef._id,
      this.cartItem.amount - 1
    );
  }
}
