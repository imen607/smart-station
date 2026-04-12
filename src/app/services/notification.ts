import { Injectable, inject } from '@angular/core';
import { Database, ref, onValue, set } from '@angular/fire/database';
import emailjs from '@emailjs/browser';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  private db = inject(Database);

  private SERVICE_ID  = 'service_h3iv1ol';
  private TEMPLATE_ID = 'template_smn4c3b';
  private PUBLIC_KEY  = 'cte3xxf1d82yGNs84';

  private notifiedCards: Set<string> = new Set();

  startMonitoring() {
    setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const cardsRef = ref(this.db, 'cards');

      onValue(cardsRef, (snapshot) => {
        snapshot.forEach((cardSnap) => {
          const uid = cardSnap.key!;
          const card = cardSnap.val();
          const sub = card?.subscription;
          const email = card?.email;

          if (!sub || !email) return;
          if (!sub.isActive) return;
          if (now < sub.endAt) return;
          if (this.notifiedCards.has(uid)) return;

          this.notifiedCards.add(uid);

          set(ref(this.db, `cards/${uid}/subscription/isActive`), false);

          emailjs.send(
            this.SERVICE_ID,
            this.TEMPLATE_ID,
            {
              to_email: email,
              offer_label: sub.offerLabel
            },
            this.PUBLIC_KEY
          ).then(() => {
            console.log('✅ Email envoyé à', email);
          }).catch((err) => {
            console.error('❌ Erreur email:', JSON.stringify(err));
          });
        });
      }, { onlyOnce: true });

    }, 30000);
  }
}