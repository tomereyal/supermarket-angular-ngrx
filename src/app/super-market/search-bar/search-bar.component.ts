import { Component, OnInit } from '@angular/core';
import IProduct from '@app/interfaces/product.interface';
import { debounceTime, map, Observable, Subject } from 'rxjs';
import { ProductService } from '../state&service/product.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
})
export class SearchBarComponent implements OnInit {
  $products: Observable<IProduct[]>;
  subject = new Subject();
  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.subject
      .pipe(
        debounceTime(1000),
        map((searchText) => {
          return this.productService.getProductsByName(searchText as string);
        })
      )
      .subscribe();
  }
  search(value: any) {
    this.subject.next(value);
  }
}
