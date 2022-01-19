import { Observable, of, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { requestFailure } from '@app/actions';
import IProduct from '@app/interfaces/product.interface';
import ICategory from '@app/interfaces/category.interface';
import { Store } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import {
  createProduct,
  createProductFailure,
  createProductSuccess,
  getProductsByCategory,
  getProductsByCategorySuccess,
  getProductsByName,
  getProductsByNameSuccess,
  setCurrentProduct,
  updateProduct,
  updateProductFailure,
  updateProductSuccess,
} from './product.actions';
import { StateWithSm } from './sm.reducer';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient, private store: Store<StateWithSm>) {}

  getProductsByCategory(categoryId: string) {
    this.store.dispatch(getProductsByCategory());
    console.log(`categoryId`, categoryId);
    this.http
      .get<{ products: IProduct[] }>(
        `${environment.apiUrl}/products/category/${categoryId}`
      )
      .subscribe({
        next: (data) => {
          console.log(
            `data from product service: getProductsByCAt result`,
            data
          );
          return this.store.dispatch(getProductsByCategorySuccess(data));
        },
        error: (error) => this.store.dispatch(requestFailure(error)),
      });
  }
  getProductsByName(searchText: string) {
    this.store.dispatch(getProductsByName());
    console.log(`searchText`, searchText);
    if (searchText === '') {
      this.store.dispatch(getProductsByCategory());
      return;
    }
    this.http
      .get<{ products: IProduct[] }>(
        `${environment.apiUrl}/products/name/${searchText}`
      )
      .subscribe({
        next: (data) => {
          console.log(
            `data from product service: getProductsByName result`,
            data
          );
          return this.store.dispatch(getProductsByNameSuccess(data));
        },
        error: (error) => this.store.dispatch(requestFailure(error)),
      });
  }

  getCategories() {
    try {
      return this.http.get<ICategory[]>(`${environment.apiUrl}/categories/`);
    } catch (error: any) {
      this.store.dispatch(requestFailure(error));

      return of([]) as Observable<ICategory[]>;
    }
  }

  async createProduct(product: Partial<IProduct>) {
    this.store.dispatch(createProduct());
    return this.http
      .post<{ newProduct: IProduct }>(
        `${environment.apiUrl}/products/create`,
        product
      )
      .pipe(take(1))
      .toPromise()
      .then((data) => {
        console.log(`data`, data);

        if (data) this.store.dispatch(createProductSuccess(data));
      })
      .catch((error) => {
        this.store.dispatch(requestFailure(error));
        this.store.dispatch(createProductFailure());
      });
  }
  async updateProduct(
    productId: string,
    update: { update: Partial<IProduct> }
  ) {
    this.store.dispatch(updateProduct());

    return this.http
      .put<{ updatedProduct: IProduct }>(
        `${environment.apiUrl}/products/update/${productId}`,
        update
      )
      .pipe(take(1))
      .toPromise()
      .then((data) => {
        console.log(`data`, data);
        if (data) this.store.dispatch(updateProductSuccess(data));
      })
      .catch((error) => {
        this.store.dispatch(requestFailure(error));
        this.store.dispatch(updateProductFailure());
      });
  }

  async setCurrentProduct(product: IProduct) {
    console.log(`Product service trying to set current product to:`, product);
    this.store
      .select((state) => state.sm.loadingCurrentProduct)
      .subscribe((isBusyWithPrev) => {
        if (!isBusyWithPrev)
          this.store.dispatch(setCurrentProduct({ product }));
      });
  }
}
