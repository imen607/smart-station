import { Injectable, inject } from '@angular/core';
import { Database, objectVal, ref, update, push } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class LastScanService {
  private db = inject(Database);

  getLastScan() {
    return objectVal(ref(this.db, 'lastScan'));
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
}