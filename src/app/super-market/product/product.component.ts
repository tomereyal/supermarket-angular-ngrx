import { Observable } from 'rxjs';
import { AddRemProductComponent } from '../add-rem-product/add-rem-product.component';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import IProduct from '@app/interfaces/product.interface';
import { defaultProductImage } from 'src/assets/images';
import { CartService } from '../state&service/cart.service';
import { Store } from '@ngrx/store';
import { StateWithSm } from '../state&service/sm.reducer';
import ICartItem from '@app/interfaces/cartItem.interface';
import { ProductService } from '../state&service/product.service';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  @Input() product: IProduct;
  @Input() isAdmin: boolean;
  currentAmount: number = 0;
  $cartItem: Observable<ICartItem>;
  cartItemId: string;
  e: any;
  defaultImage = defaultProductImage;
  constructor(
    public dialog: MatDialog,
    private cartService: CartService,
    private productService: ProductService,
    private store: Store<StateWithSm>
  ) {}

  ngOnInit(): void {
    //check if product exists in cart and if so set the currentAmount and subscribe to cartItem changes
    this.store
      .select((state) => state.sm.cart.cartItems)
      .subscribe((cartItems) => {
        if (cartItems[this.product._id]) {
          this.currentAmount = cartItems[this.product._id].amount;
          this.cartItemId = cartItems[this.product._id]._id;
        } else {
          this.currentAmount = 0;
        }
      });
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddRemProductComponent, {
      width: '400px',
      data: {
        product: this.product,
        currentAmount: this.currentAmount,
        cartItemId: this.cartItemId,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      console.log(`result`, result);
    });
  }
  setCurrentProduct() {
    console.log(
      `product component trying to reach service and set current product`
    );
    this.productService.setCurrentProduct(this.product);
  }
}
