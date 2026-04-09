import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recharge',
  standalone: true,
  templateUrl: './recharge.html',
  styleUrl: './recharge.css'
})
export class RechargeComponent {
  constructor(private router: Router) {}

  goToOffers() {
    this.router.navigate(['/offers']);
  }
}