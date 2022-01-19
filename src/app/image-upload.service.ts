import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import { requestFailure } from './actions';
import { Store } from '@ngrx/store';
import { StateWithSm } from './super-market/state&service/sm.reducer';

@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {
  constructor(private http: HttpClient, private store: Store<StateWithSm>) {}

  async uploadImage(base64EncodedImage: string) {
    return this.http
      .post<{ url: string }>(`${environment.apiUrl}/uploads`, {
        data: base64EncodedImage,
      })
      .pipe(take(1))
      .toPromise()
      .then((url) => {
        console.log(`response from upload service`, url);
        return url?.url;
      })
      .catch((err) => this.store.dispatch(requestFailure(err)));
  }
}
