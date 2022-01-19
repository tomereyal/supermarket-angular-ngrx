import { OrderComponent } from './order/order.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DoormanPageComponent } from './doorman-page/doorman-page.component';
import { ShoppingPageComponent } from './shopping-page/shopping-page.component';
import { SuperMarketComponent } from './super-market.component';
import { SuccessPageComponent } from './success-page/success-page.component';
import { CartGuard } from '@app/_helpers/cart.guard';

const routes: Routes = [
  {
    path: '',
    component: SuperMarketComponent,
    children: [
      { path: 'doorman', component: DoormanPageComponent },
      {
        path: 'shop',
        canActivate: [CartGuard],
        component: ShoppingPageComponent,
      },
      { path: 'order', component: OrderComponent },
      { path: 'order-succeeded', component: SuccessPageComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuperMarketRoutingModule {}
