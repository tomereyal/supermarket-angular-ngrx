import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsReviewComponent } from './items-review.component';

describe('ItemsReviewComponent', () => {
  let component: ItemsReviewComponent;
  let fixture: ComponentFixture<ItemsReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemsReviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
