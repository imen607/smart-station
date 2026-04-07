import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './payment.html',
  styleUrl: './payment.css'
})
export class PaymentComponent {
  offer: any;
  cardCode = '';
  message = '';

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.offer = nav?.extras?.state?.['offer'] || null;
  }

  validatePayment() {
    if (!this.cardCode.trim()) {
      this.message = 'Veuillez entrer votre code de carte';
      return;
    }

    this.message = `Paiement validé pour ${this.offer?.label} avec le code carte ${this.cardCode}`;
  }
}