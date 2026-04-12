import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Database, ref, set } from '@angular/fire/database';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './payment.html',
  styleUrl: './payment.css'
})
export class PaymentComponent {
  offer: any;
  uid: string = '';
  message = '';
  loading = false;

  private durationMap: { [key: string]: number } = {
    '2h':   60,              // 60 secondes pour test → remplace par 7200 en prod
    '1 jour': 24 * 3600,
    '7 jours': 7 * 24 * 3600,
    '1 mois': 30 * 24 * 3600
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private db: Database
  ) {
    const nav = this.router.getCurrentNavigation();
    this.offer = nav?.extras?.state?.['offer'] || null;

    // Récupérer l'UID directement depuis l'URL
    this.uid = this.route.snapshot.paramMap.get('uid') || '';
  }

  async validatePayment() {
    if (!this.uid) {
      this.message = '❌ UID carte manquant';
      return;
    }

    if (!this.offer) {
      this.message = '❌ Aucune offre sélectionnée';
      return;
    }

    this.loading = true;

    try {
      const durationSeconds = this.durationMap[this.offer.duration] ?? 60;
      const nowSeconds = Math.floor(Date.now() / 1000);
      const endAtSeconds = nowSeconds + durationSeconds;

      const subscriptionRef = ref(this.db, `cards/${this.uid}/subscription`);
      await set(subscriptionRef, {
        duration: this.offer.duration,
        durationSeconds: durationSeconds,
        startAt: nowSeconds,
        endAt: endAtSeconds,
        isActive: true,
        offerLabel: this.offer.label,
        price: this.offer.price
      });

      this.message = `✅ Abonnement activé ! Expire dans ${this.offer.duration}`;

    } catch (err) {
      console.error(err);
      this.message = '❌ Erreur lors de l\'activation';
    }

    this.loading = false;
  }
}