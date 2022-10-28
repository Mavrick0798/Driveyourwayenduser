import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { CheckoutComponent } from 'src/app/pages/checkout/checkout.component';
import { CarsComponent } from 'src/app/pages/cars/cars.component';
import { WishlistComponent } from 'src/app/pages/wishlist/wishlist.component';
import { CategoriesComponent } from 'src/app/pages/categories/categories.component';
import { ShoppingCartComponent } from 'src/app/pages/shopping-cart/shopping-cart.component';
import { UserProfileComponent } from 'src/app/pages/user-profile/user-profile.component';
import { UserCarsComponent } from 'src/app/pages/user-cars/user-cars.component';
import { SubscriptionsComponent } from 'src/app/pages/subscriptions/subscriptions.component';

const routes: Routes = [
  { path: 'categories/:categoryId/cars', component: CarsComponent, canActivate: [AuthGuard] },
  { path: 'categories', component: CategoriesComponent, canActivate: [AuthGuard] },
  { path: 'cart', component: ShoppingCartComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
  { path: 'wishlist', component: WishlistComponent, canActivate: [AuthGuard] },
  { path: 'my-cars', component: UserCarsComponent, canActivate: [AuthGuard] },
  { path: 'subscriptions', component: SubscriptionsComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminLayoutRoutingModule { }
