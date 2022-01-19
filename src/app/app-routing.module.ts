import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './_helpers/auth.guard';
const routes: Routes = [
  // { path: '', component: HomePageComponent, canActivate: [AuthGuard] },
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./super-market/super-market.module').then(
        (m) => m.SuperMarketModule
      ),
  },
  {
    path: 'account',
    loadChildren: () =>
      import('./account/account.module').then((m) => m.AccountModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
