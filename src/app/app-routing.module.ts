import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CartComponent } from './cart/cart.component';
import { CatalogComponent } from './catalog/catalog.component';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { TemplateFormControlsComponent } from './user/template-form-controls/template-form-controls.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    title: "Home - Joe's Robot Shop",
  },
  // {
  //   path: 'catalog/:filter',
  //   component: CatalogComponent,
  //   title: "Catalog - Joe's Robot Shop",
  // },
  {
    path: 'catalog',
    component: CatalogComponent,
    title: "Catalog - Joe's Robot Shop",
    canActivate: [AuthGuard]
  },
  {
    path: 'cart',
    component: CartComponent,
    title: "Cart - Joe's Robot Shop",
    canActivate: [AuthGuard]
  },
  {
    path: 'sign-in',
    component: SignInComponent,
  },
  {
    path:'form-control',
    component:TemplateFormControlsComponent
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
