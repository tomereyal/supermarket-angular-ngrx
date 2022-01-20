import { AfterViewInit, Component, OnInit } from '@angular/core';
import IProduct from '@app/interfaces/product.interface';
import ICategory from '@app/interfaces/category.interface';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { StateWithSm } from '../state&service/sm.reducer';
import { ProductService } from '../state&service/product.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { IHashedProducts } from '../state&service/product.reducer';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit, AfterViewInit {
  $products: Observable<IHashedProducts>;
  $isAdmin: Observable<boolean>;
  $loadingProducts: Observable<boolean> = of(false);
  $loadingCurrentProduct: Observable<boolean> = of(false);
  $categories: Observable<ICategory[]>;
  currentTabIndex: number = -1;
  previousTabIndex: number = 1;
  initialLoading = true;

  constructor(
    private store: Store<StateWithSm>,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.$categories = this.productService.getCategories();
    this.$products = this.store.select((state) => state.sm.products);
    this.$loadingProducts = this.store.select(
      (state) => state.sm.loadingProducts
    );
    this.$loadingCurrentProduct = this.store.select(
      (state) => state.sm.loadingCurrentProduct
    );

    //Need to unsubscribe on ngDestroy...
    this.store
      .select((state) => state.sm.filteringProducts)
      .subscribe((filtering) => {
        if (filtering) {
          this.previousTabIndex = this.currentTabIndex;
          this.currentTabIndex = 0;
        } else this.currentTabIndex = this.previousTabIndex;
      });

    this.$isAdmin = this.store.select((state) => state.account.user.isAdmin);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      console.log(`this.currentTabIndex`, this.currentTabIndex);
      if (this.currentTabIndex === 1) {
        this.currentTabIndex = 2;
        this.initialLoading = false;
      }
    }, 1500);
  }

  getProducts($event: MatTabChangeEvent) {
    const categoryId = $event.tab.ariaLabel;
    this.currentTabIndex = $event.index;
    console.log(`$event.index`, $event.index);
    if ($event.index !== 0)
      this.productService.getProductsByCategory(categoryId);
  }
}
