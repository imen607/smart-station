import { Injectable, inject } from '@angular/core';
import { Database, objectVal, ref, update, push, set } from '@angular/fire/database';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LastScanService {
  private db = inject(Database);

  // ✅ Lire le dernier scan (toujours retourner uid propre)
  getLastScan() {
    return objectVal<{ uid: string }>(ref(this.db, 'lastScan')).pipe(
      map((data: any) => ({
        uid: data?.uid ? data.uid.trim() : ''
      }))
    );
  }

  // ✅ Récupérer une carte
  getCard(uid: string) {
    return objectVal(ref(this.db, `cards/${uid}`));
  }

  // ✅ Recharge carte
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

  // ✅ Reset UID (IMPORTANT pour éviter redirection auto)
  async resetUID() {
    await set(ref(this.db, 'lastScan/uid'), '');
  }
}