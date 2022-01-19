import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { State } from '@app/reducers';
import { Store } from '@ngrx/store';
import { skip } from 'rxjs';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css'],
})
export class AlertsComponent implements OnInit {
  constructor(private _snackBar: MatSnackBar, private store: Store<State>) {}

  ngOnInit(): void {
    this.store
      .select((state) => state.error)
      .pipe(skip(1))
      .subscribe({
        next: (error) => {
          this.openSnackBar(error);
        },
      });
  }
  openSnackBar(error: Error) {
    this._snackBar.open(error.message, 'X', {
      horizontalPosition: 'start',
      verticalPosition: 'bottom',
      duration: 5 * 1000,
    });
  }
}
