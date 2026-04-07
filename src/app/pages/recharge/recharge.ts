import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-recharge',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './recharge.html',
  styleUrl: './recharge.css'
})
export class RechargeComponent {
  showOptions = false;
  selectedOffer: any = null;

  offers = [
    { label: 'Valable 2 heures', price: 2, duration: '2h' },
    { label: 'Valable 1 jour', price: 5, duration: '1 jour' },
    { label: 'Valable 7 jours', price: 20, duration: '7 jours' },
    { label: 'Valable 1 mois', price: 70, duration: '1 mois' }
  ];

  constructor(private router: Router) {}

  openOffers() {
    this.showOptions = true;
  }

  selectOffer(offer: any) {
    this.selectedOffer = offer;
  }

  goToPayment() {
    if (!this.selectedOffer) return;

    this.router.navigate(['/payment'], {
      state: { offer: this.selectedOffer }
    });
  }
}