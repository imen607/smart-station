import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recharge',
  standalone: true,
  templateUrl: './recharge.html',
  styleUrl: './recharge.css'
})
export class RechargeComponent implements OnInit {
  uid: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.uid = this.route.snapshot.paramMap.get('uid') || '';
    console.log('UID reçu dans recharge :', this.uid);
  }

  goToOffers() {
    if (!this.uid) {
      console.log('UID introuvable');
      return;
    }

    this.router.navigate(['/offers', this.uid]);
  }
}