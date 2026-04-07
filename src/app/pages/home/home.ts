import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LastScanService } from '../../services/last-scan';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl:'./home.css'
})
export class HomeComponent implements OnInit {
  private LastScanService = inject(LastScanService);
  private router = inject(Router);

  message = "Présentez votre carte";

  ngOnInit(): void {
    this.LastScanService.getLastScan().subscribe((scan: any) => {
      if (scan?.uid) {
        this.LastScanService.getCard(scan.uid).subscribe((card: any) => {
          if (card && card.status === 'active') {
            this.router.navigate(['/recharge', scan.uid]);
          } else {
            this.message = "Carte inconnue ou bloquée";
          }
        });
      }
    });
  }
}