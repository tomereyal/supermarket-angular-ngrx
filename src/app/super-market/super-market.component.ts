import { CartService } from './state&service/cart.service';
import { StateWithSm } from './state&service/sm.reducer';
import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import ICart from '@app/interfaces/cart.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-super-market',
  templateUrl: './super-market.component.html',
  styleUrls: ['./super-market.component.css'],
})
export class SuperMarketComponent implements OnInit {
  constructor(private router: Router, private cartService: CartService) {
    this.cartService.getCart();
    this.router.navigate(['shop']);
  }

  ngOnInit(): void {}
}
