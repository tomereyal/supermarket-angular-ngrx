import IOrder from '@app/interfaces/order.interface';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { StateWithSm } from '../state&service/sm.reducer';
import { OrderService } from '../state&service/order.service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-success-page',
  templateUrl: './success-page.component.html',
  styleUrls: ['./success-page.component.css'],
})
export class SuccessPageComponent implements OnInit {
  title = 'htmltopdf';
  state$: Observable<{ confirmedOrderId: string }>;
  $recentOrder: Observable<IOrder>;
  @ViewChild('pdfTable') pdfTable: ElementRef;

  generatePdf() {
    let pdf = new jsPDF('p', 'pt', 'a4');
    pdf.html(this.pdfTable.nativeElement, {
      callback: (pdf) => {
        pdf.output('dataurlnewwindow');
      },
    });
  }

  constructor(
    public activatedRoute: ActivatedRoute,
    private store: Store<StateWithSm>,
    private orderService: OrderService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.orderService.getPreviousOrders();
    this.state$ = this.activatedRoute.paramMap.pipe(
      map(() => window.history.state)
    );

    this.$recentOrder = this.store.select(
      (state) => state.sm.previousOrders[0]
    );
  }
}
