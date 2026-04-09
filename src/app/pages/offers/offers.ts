import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgFor, NgClass } from '@angular/common';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [NgFor, NgClass],
  templateUrl: './offers.html',
  styleUrl: './offers.css'
})
export class OffersComponent implements OnInit {
  selectedOffer: any = null;
  uid: string = '';

  offers = [
    { label: 'Valable 2 heures', price: 2, duration: '2h' },
    { label: 'Valable 1 jour', price: 5, duration: '1 jour' },
    { label: 'Valable 7 jours', price: 20, duration: '7 jours' },
    { label: 'Valable 1 mois', price: 70, duration: '1 mois' }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.uid = this.route.snapshot.paramMap.get('uid') || '';
    console.log('UID reçu dans offers :', this.uid);
  }

  selectOffer(offer: any) {
    this.selectedOffer = offer;
  }

  goToPayment() {
    if (!this.selectedOffer) return;
    if (!this.uid) return;

    this.router.navigate(['/payment', this.uid], {
      state: { offer: this.selectedOffer }
    });
  }

  goBack() {
    if (!this.uid) return;
    this.router.navigate(['/recharge', this.uid]);
  }
}