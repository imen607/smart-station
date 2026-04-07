import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { RechargeComponent } from './pages/recharge/recharge';
import { PaymentComponent } from './pages/payment/payment';

export const routes: Routes = [
  { path: '', redirectTo: 'recharge', pathMatch: 'full' },
  {path:'home', component:HomeComponent},
  {path:'recharge', component: RechargeComponent},
   { path: 'payment', component: PaymentComponent }
];