import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { StoreModule } from '@ngrx/store';
import * as fromAccount from './state&service/account.reducer';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MatStepperModule } from '@angular/material/stepper';

import { SharedModule } from '@app/shared/shared.module';
//ANGULAR CLI for separate module -----
//to create a module with routing
// ng g m <module-name> --route <module-name-routing> --module=app.module
//Example:  ng g m account --route account-routing --module=app.module

//to create a new component
//ng g c componentName --module=path-to-your-module-from-src-folder
//My path was changed in tsConfig file so i dont need to write the full path
//EXAMPLE : ng g c login --module=\account\account.module.ts

@NgModule({
  declarations: [AccountComponent, LoginComponent, RegisterComponent],
  imports: [
    CommonModule,
    AccountRoutingModule,
    MatStepperModule,
    StoreModule.forFeature(
      fromAccount.accountFeatureKey,
      fromAccount.reducers,
      { metaReducers: fromAccount.metaReducers }
    ),
    SharedModule,
  ],
})
export class AccountModule {}
