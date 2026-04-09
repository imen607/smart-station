import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LastScanService } from '../../services/last-scan';
import { Subscription } from 'rxjs';
import { filter, switchMap, map, distinctUntilChanged, skip } from 'rxjs/operators';

interface ScanResult {
  card: any;
  uid: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  private lastScanService = inject(LastScanService);
  private router = inject(Router);
  private sub!: Subscription;

  message = "Insérez votre carte Navigo";

  ngOnInit(): void {

    // ✅ Reset Firebase + état local à chaque retour sur home
    this.isRedirecting = false;
    this.lastScanService.resetUID();

    this.sub = this.lastScanService.getLastScan().pipe(

      skip(1), // Ignorer le premier événement (valeur initiale Firebase)

      // ✅ Ignorer uid vide
      filter((scan: any) => !!scan?.uid && scan.uid !== ''),

      // ✅ Ne réagir que si l'UID change vraiment
      distinctUntilChanged((a: any, b: any) => a?.uid === b?.uid),

      switchMap((scan: any) => {
        this.message = "Carte détectée...";
        return this.lastScanService.getCard(scan.uid).pipe(
          map((card: any): ScanResult => ({ card, uid: scan.uid as string }))
        );
      })

    ).subscribe((result: ScanResult) => {

      if (this.isRedirecting) return;
      this.isRedirecting = true;

      if (result.card?.status === 'blocked') {
        this.message = "Carte bloquée";
        this.isRedirecting = false;
        return;
      }

      console.log('🚀 Redirection vers /recharge/', result.uid);
      this.router.navigate(['/recharge', result.uid]);
    });
  }

  // ✅ Déclaré ici pour pouvoir le reset dans ngOnInit
  private isRedirecting = false;

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.isRedirecting = false; // ✅ Reset au destroy
  }
}