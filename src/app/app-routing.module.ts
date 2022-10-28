import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

const routes: Routes = [
  { path: '', redirectTo: 'categories', pathMatch: 'full' },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { 
        path: '',
        loadChildren: () => import('./layouts/admin-layout/admin-layout.module').then(e => e.AdminLayoutModule)
      }
    ]
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { 
        path: '',
        loadChildren: () => import('./layouts/auth-layout/auth-layout.module').then(e => e.AuthLayoutModule)
      }
    ]
  },
  { path: '**', redirectTo: 'categories', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
