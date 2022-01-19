import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRemProductComponent } from './add-rem-product.component';

describe('AddRemProductComponent', () => {
  let component: AddRemProductComponent;
  let fixture: ComponentFixture<AddRemProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRemProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRemProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
