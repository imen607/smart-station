import { Injectable, inject } from '@angular/core';
import { Database, objectVal, ref, update, push, set } from '@angular/fire/database';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LastScanService {
  private db = inject(Database);

  getLastScan() {
    return objectVal<{ uid: string }>(ref(this.db, 'lastScan')).pipe(
      map((data: any) => ({
        uid: data?.uid ? data.uid.trim() : ''
      }))
    );
  }

  getCard(uid: string) {
    return objectVal(ref(this.db, `cards/${uid}`));
  }

  async rechargeCard(uid: string, currentBalance: number, amount: number) {
    const newBalance = currentBalance + amount;

    await update(ref(this.db, `cards/${uid}`), {
      balance: newBalance
    });

    await push(ref(this.db, 'transactions'), {
      uid,
      type: 'recharge',
      amount,
      date: Date.now()
    });
  }

  async saveSubscription(uid: string, subscription: any) {
    await update(ref(this.db, `cards/${uid}`), {
      subscription: subscription
    });

    await push(ref(this.db, 'transactions'), {
      uid,
      type: 'subscription',
      offerLabel: subscription.offerLabel,
      amount: subscription.price,
      startAt: subscription.startAt,
      endAt: subscription.endAt,
      date: Date.now()
    });
  }

  async resetUID() {
    await set(ref(this.db, 'lastScan/uid'), '');
  }
}