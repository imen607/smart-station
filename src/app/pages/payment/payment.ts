import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Database, ref, set, get } from '@angular/fire/database';

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
  loading = false;

  // Durées en secondes
  private durationMap: { [key: string]: number } = {
    '2h':     2 * 60,        // ← 2 minutes pour test (remplace par 2*3600 en prod)
    '1 jour': 24 * 3600,
    '7 jours': 7 * 24 * 3600,
    '1 mois': 30 * 24 * 3600
  };

  constructor(private router: Router, private db: Database) {
    const nav = this.router.getCurrentNavigation();
    this.offer = nav?.extras?.state?.['offer'] || null;
  }

  async validatePayment() {
    if (!this.cardCode.trim()) {
      this.message = 'Veuillez entrer votre code de carte';
      return;
    }

    this.loading = true;

    try {
      // 1. Chercher la carte par cardCode
      const cardsRef = ref(this.db, 'cards');
      const snapshot = await get(cardsRef);

      let cardUID: string | null = null;

      snapshot.forEach((child) => {
        const data = child.val();
        if (data?.subscription?.cardCode === this.cardCode.trim()) {
          cardUID = child.key;
        }
      });

      if (!cardUID) {
        this.message = '❌ Code carte invalide';
        this.loading = false;
        return;
      }

      // 2. Calculer startAt et endAt EN SECONDES Unix
      const durationSeconds = this.durationMap[this.offer?.duration] ?? 120;
      const nowSeconds = Math.floor(Date.now() / 1000);  // ← en secondes !
      const endAtSeconds = nowSeconds + durationSeconds;

      // 3. Écrire dans Firebase EN SECONDES
      const subscriptionRef = ref(this.db, `cards/${cardUID}/subscription`);
      await set(subscriptionRef, {
        cardCode: this.cardCode.trim(),
        duration: this.offer?.duration,
        durationSeconds: durationSeconds,
        endAt: endAtSeconds,        // ← secondes, compatible ESP32
        startAt: nowSeconds,        // ← secondes
        isActive: true,
        offerLabel: this.offer?.label,
        price: this.offer?.price
      });

      this.message = `✅ Abonnement activé ! Expire dans ${this.offer?.duration}`;

    } catch (err) {
      console.error(err);
      this.message = '❌ Erreur lors du paiement';
    }

    this.loading = false;
  }
}