import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminLayoutRoutingModule } from './admin-layout-routing.module';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { CheckoutComponent } from '../../pages/checkout/checkout.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WishlistComponent } from '../../pages/wishlist/wishlist.component';
import { CategoriesComponent } from '../../pages/categories/categories.component';
import { ShoppingCartComponent } from 'src/app/pages/shopping-cart/shopping-cart.component';
import { CarsComponent } from '../../pages/cars/cars.component';
import { UserCarsComponent } from '../../pages/user-cars/user-cars.component';
import { SubscriptionsComponent } from 'src/app/pages/subscriptions/subscriptions.component';


@NgModule({
  declarations: [
    UserProfileComponent,
    CheckoutComponent,
    WishlistComponent,
    CategoriesComponent,
    ShoppingCartComponent,
    CarsComponent,
    UserCarsComponent,
    SubscriptionsComponent
  ],
  imports: [
    CommonModule,
    AdminLayoutRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminLayoutModule { }
