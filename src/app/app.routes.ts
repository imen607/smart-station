import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { RechargeComponent } from './pages/recharge/recharge';
import { PaymentComponent } from './pages/payment/payment';
import { OffersComponent } from './pages/offers/offers';

export const routes: Routes = [
  { path: '', redirectTo: 'recharge', pathMatch: 'full' },
  {path:'home', component:HomeComponent},
  {path:'recharge/:uid', component: RechargeComponent},
   { path: 'payment/:uid', component: PaymentComponent },
    { path: 'offers/:uid', component: OffersComponent }
];