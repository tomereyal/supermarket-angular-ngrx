import { Directive, Input, OnInit } from '@angular/core';
import { MatGridList } from '@angular/material/grid-list';
import { MediaObserver, MediaChange } from '@angular/flex-layout';

export interface IResponsiveColumnsMap {
  [key: string]: number;
}

// Usage: <mat-grid-list [responsiveCols]="{xs: 2, sm: 2, md: 4, lg: 6, xl: 8}">
@Directive({
  selector: '[responsiveCols]',
})
export class ResponsiveColsDirective implements OnInit {

  //DEFAULT COL_SIZE MAP IF NO MAP IS GIVEN AT ELEMENT TAG'S INPUT 
  private countBySize: IResponsiveColumnsMap = {
    xs: 2,
    sm: 2,
    md: 4,
    lg: 6,
    xl: 8,
  };

  public get cols(): IResponsiveColumnsMap {
    return this.countBySize;
  }

  @Input('responsiveCols')
  public set cols(map: IResponsiveColumnsMap) {
    if (map && 'object' === typeof map) {
      this.countBySize = map;
    }
  }

  public constructor(private grid: MatGridList, private media: MediaObserver) {
    this.initializeColsCount();
  }

  public ngOnInit(): void {
    this.initializeColsCount();
    this.media.asObservable().subscribe((changes: MediaChange[]) => {
      const mq = changes[0].mqAlias;
      return (this.grid.cols = this.countBySize[mq]);
    });
  }

  private initializeColsCount(): void {
    Object.keys(this.countBySize).some((mqAlias: string): boolean => {
      const isActive = this.media.isActive(mqAlias);

      if (isActive) {
        this.grid.cols = this.countBySize[mqAlias];
      }

      return isActive;
    });
  }
}
