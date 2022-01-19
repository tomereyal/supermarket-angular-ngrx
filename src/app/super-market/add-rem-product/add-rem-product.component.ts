import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import IProduct from '@app/interfaces/product.interface';
import { defaultProductImage } from 'src/assets/images';
import { CartService } from '../state&service/cart.service';

export interface DialogProductData {
  product: IProduct;
  currentAmount: number;
  cartItemId: string;
}

@Component({
  selector: 'app-add-rem-product',
  templateUrl: './add-rem-product.component.html',
  styleUrls: ['./add-rem-product.component.css'],
})
export class AddRemProductComponent implements OnInit {
  form: FormGroup;
  product: IProduct;
  currentAmount: number;
  cartItemId: string | undefined;
  defaultImage = defaultProductImage;
  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    public dialogRef: MatDialogRef<AddRemProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogProductData
  ) {}
  ngOnInit(): void {
    this.product = this.data.product;
    this.currentAmount =
      this.data.currentAmount === 0 ? 1 : this.data.currentAmount;
    this.cartItemId = this.data.cartItemId;
    this.form = this.fb.group({
      amount: [this.currentAmount, [Validators.min(0), Validators.max(50)]],
    });
    //@ts-ignore
    this.form.get('amount').valueChanges.subscribe((x) => {
      console.log('form value changed');
      console.log(x);
      if (x < 0)
        setTimeout(() => {
          this.form.patchValue({ amount: 0 });
        }, 800);
      if (x > 50)
        setTimeout(() => {
          this.form.patchValue({ amount: 50 });
        }, 800);
    });
  }
  get fc() {
    return this.form.controls;
  }

  increment() {
    this.fc.amount.setValue(this.fc.amount.value + 1);
  }
  decrement() {
    this.fc.amount.setValue(this.fc.amount.value - 1);
  }

  addCartItem() {
    if (this.fc.amount.value > 0)
      this.cartService.addCartItem(this.product._id, this.fc.amount.value);
    this.dialogRef.close();
  }
  updateCartItem() {
    if (this.cartItemId)
      this.cartService.updateCartItemAmount(
        this.cartItemId,
        this.product._id,
        this.fc.amount.value
      );
    this.dialogRef.close();
  }
}
