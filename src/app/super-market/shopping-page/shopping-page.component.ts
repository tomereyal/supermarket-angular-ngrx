import { Observable, of } from 'rxjs';
import { ProductService } from './../state&service/product.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../state&service/cart.service';
import IProduct from '@app/interfaces/product.interface';
import { Store } from '@ngrx/store';
import { StateWithSm } from '../state&service/sm.reducer';

@Component({
  selector: 'app-shopping-page',
  templateUrl: './shopping-page.component.html',
  styleUrls: ['./shopping-page.component.css'],
})
export class ShoppingPageComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  $isAdmin: Observable<boolean>;
  private _mobileQueryListener: () => void;
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private cartService: CartService,
    private store: Store<StateWithSm>
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  async ngOnInit(): Promise<void> {
    await this.cartService.getCart();
    this.$isAdmin = this.store.select((state) => state.account.user.isAdmin);
  }
}
