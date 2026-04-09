import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor, NgClass } from '@angular/common';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [NgFor, NgClass],
  templateUrl: './offers.html',
  styleUrl: './offers.css'
})
export class OffersComponent {
  selectedOffer: any = null;

  offers = [
    { label: 'Valable 2 heures', price: 2, duration: '2h' },
    { label: 'Valable 1 jour', price: 5, duration: '1 jour' },
    { label: 'Valable 7 jours', price: 20, duration: '7 jours' },
    { label: 'Valable 1 mois', price: 70, duration: '1 mois' }
  ];

  constructor(private router: Router) {}

  selectOffer(offer: any) {
    this.selectedOffer = offer;
  }

  goToPayment() {
    if (!this.selectedOffer) return;

    this.router.navigate(['/payment'], {
      state: { offer: this.selectedOffer }
    });
  }

  goBack() {
    this.router.navigate(['/recharge']);
  }
}