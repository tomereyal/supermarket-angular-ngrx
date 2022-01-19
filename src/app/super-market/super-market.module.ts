import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { SuperMarketRoutingModule } from './super-market-routing.module';
import { SuperMarketComponent } from './super-market.component';
import { CartComponent } from './cart/cart.component';
import { ProductComponent } from './product/product.component';
import { OrderComponent } from './order/order.component';
import { ProductListComponent } from './product-list/product-list.component';
import { CartItemComponent } from './cart-item/cart-item.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { StoreModule } from '@ngrx/store';
import * as fromSuperMarket from './state&service/sm.reducer';
import { ShoppingPageComponent } from './shopping-page/shopping-page.component';
import { DoormanPageComponent } from './doorman-page/doorman-page.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { AddRemProductComponent } from './add-rem-product/add-rem-product.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { ItemsReviewComponent } from './items-review/items-review.component';
import { MatTableModule } from '@angular/material/table';
import { SuccessPageComponent } from './success-page/success-page.component';
import { ProductEditorComponent } from './product-editor/product-editor.component';
import { ResponsiveColsDirective } from '@app/responsive-cols.directive';

@NgModule({
  declarations: [
    SuperMarketComponent,
    CartComponent,
    ProductComponent,
    OrderComponent,
    ProductListComponent,
    CartItemComponent,
    SearchBarComponent,
    ShoppingPageComponent,
    DoormanPageComponent,
    AddRemProductComponent,
    ItemsReviewComponent,
    SuccessPageComponent,
    ProductEditorComponent,
    ResponsiveColsDirective,
  ],
  imports: [
    CommonModule,
    SharedModule,
    SuperMarketRoutingModule,
    StoreModule.forFeature(
      fromSuperMarket.superMarketFeatureKey,
      fromSuperMarket.reducers,
      { metaReducers: fromSuperMarket.metaReducers }
    ),
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatTabsModule,
    MatMenuModule,
    MatDialogModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatTableModule,
  ],
})
export class SuperMarketModule {}
